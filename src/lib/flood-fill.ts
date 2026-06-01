/**
 * Boundary-based flood fill for coloring book images.
 * Regions are defined by outline boundaries, NOT by color matching.
 * This means filling over a gradient replaces the entire region, not just
 * the pixels that match the tap point's color.
 */

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

function getPixel(data: Uint8ClampedArray, idx: number): RGBA {
  return {
    r: data[idx],
    g: data[idx + 1],
    b: data[idx + 2],
    a: data[idx + 3],
  };
}

function setPixel(data: Uint8ClampedArray, idx: number, color: RGBA) {
  data[idx] = color.r;
  data[idx + 1] = color.g;
  data[idx + 2] = color.b;
  data[idx + 3] = color.a;
}

function isOutline(pixel: RGBA, threshold: number): boolean {
  return pixel.r < threshold && pixel.g < threshold && pixel.b < threshold && pixel.a > 128;
}

function isAntiAliasedEdge(pixel: RGBA): boolean {
  const avg = (pixel.r + pixel.g + pixel.b) / 3;
  return avg >= 40 && avg <= 200 && pixel.a > 128 &&
    Math.abs(pixel.r - pixel.g) < 20 && Math.abs(pixel.g - pixel.b) < 20;
}

export function hexToRgba(hex: string): RGBA {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0, a: 255 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: result[4] ? parseInt(result[4], 16) : 255,
  };
}

export function rgbaToHex(color: RGBA): string {
  return (
    "#" +
    [color.r, color.g, color.b].map((c) => c.toString(16).padStart(2, "0")).join("")
  );
}

export interface FloodFillOptions {
  tolerance?: number;
  outlineThreshold?: number;
}

/**
 * Find the entire enclosed region by spreading from a point,
 * stopping only at outline boundaries. Color-agnostic — works whether
 * the region is white, solid-filled, or gradient-filled.
 */
export function findRegion(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  outlineThreshold: number
): { filled: Uint8Array; minY: number; maxY: number } {
  const filled = new Uint8Array(width * height);
  let minY = height;
  let maxY = 0;

  const stack: number[] = [startY * width + startX];

  while (stack.length > 0) {
    const pixelIdx = stack.pop()!;
    if (filled[pixelIdx]) continue;

    const y = (pixelIdx / width) | 0;
    const x = pixelIdx - y * width;

    const idx = pixelIdx * 4;
    const pixel = getPixel(data, idx);
    if (isOutline(pixel, outlineThreshold)) continue;

    filled[pixelIdx] = 1;

    // Scanline: expand left
    let left = x;
    while (left > 0) {
      const li = (y * width + (left - 1)) * 4;
      if (isOutline(getPixel(data, li), outlineThreshold)) break;
      left--;
      filled[y * width + left] = 1;
    }

    // Scanline: expand right
    let right = x;
    while (right < width - 1) {
      const ri = (y * width + (right + 1)) * 4;
      if (isOutline(getPixel(data, ri), outlineThreshold)) break;
      right++;
      filled[y * width + right] = 1;
    }

    // Track vertical bounds
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;

    // Queue rows above and below
    for (let i = left; i <= right; i++) {
      if (y > 0 && !filled[(y - 1) * width + i]) {
        stack.push((y - 1) * width + i);
      }
      if (y < height - 1 && !filled[(y + 1) * width + i]) {
        stack.push((y + 1) * width + i);
      }
    }
  }

  return { filled, minY, maxY };
}

/**
 * Clean up anti-aliased edge pixels adjacent to filled region.
 */
function cleanupEdges(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  filled: Uint8Array,
  fillColor: RGBA
) {
  for (let pass = 0; pass < 2; pass++) {
    const toBlend: { idx: number; blend: number }[] = [];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const pixelIdx = y * width + x;
        if (filled[pixelIdx]) continue;

        const idx = pixelIdx * 4;
        const pixel = getPixel(data, idx);

        if (pixel.r < 40 && pixel.g < 40 && pixel.b < 40 && pixel.a > 200) continue;

        let filledNeighbors = 0;
        const offsets = [-width - 1, -width, -width + 1, -1, 1, width - 1, width, width + 1];
        for (const off of offsets) {
          if (filled[pixelIdx + off]) filledNeighbors++;
        }

        if (filledNeighbors === 0) continue;

        if (isAntiAliasedEdge(pixel)) {
          const blend = Math.min(1, filledNeighbors / 4);
          toBlend.push({ idx, blend });
        } else if (pixel.r > 200 && pixel.g > 200 && pixel.b > 200 && filledNeighbors >= 3) {
          toBlend.push({ idx, blend: 0.9 });
        }
      }
    }

    for (const { idx, blend } of toBlend) {
      const pixel = getPixel(data, idx);
      const pixelIdx = idx / 4;
      setPixel(data, idx, {
        r: Math.round(pixel.r * (1 - blend) + fillColor.r * blend),
        g: Math.round(pixel.g * (1 - blend) + fillColor.g * blend),
        b: Math.round(pixel.b * (1 - blend) + fillColor.b * blend),
        a: 255,
      });
      if (blend > 0.5) filled[pixelIdx] = 1;
    }
  }
}

/**
 * Solid flood fill — fills the entire enclosed region with one color.
 */
export function floodFill(
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: RGBA,
  options: FloodFillOptions = {}
): ImageData {
  const { outlineThreshold = 50 } = options;
  const { width, height, data } = imageData;

  startX = Math.round(startX);
  startY = Math.round(startY);

  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return imageData;
  }

  const startPixel = getPixel(data, (startY * width + startX) * 4);
  if (isOutline(startPixel, outlineThreshold)) return imageData;

  const { filled } = findRegion(data, width, height, startX, startY, outlineThreshold);

  // Apply fill color to all region pixels
  for (let i = 0; i < width * height; i++) {
    if (filled[i]) {
      setPixel(data, i * 4, fillColor);
    }
  }

  cleanupEdges(data, width, height, filled, fillColor);
  return imageData;
}

/**
 * Gradient fill — fills the entire enclosed region with a vertical gradient.
 */
export function gradientFill(
  imageData: ImageData,
  startX: number,
  startY: number,
  color1: RGBA,
  color2: RGBA,
  options: FloodFillOptions = {},
  flipped = false
): ImageData {
  const { outlineThreshold = 50 } = options;
  const { width, height, data } = imageData;

  startX = Math.round(startX);
  startY = Math.round(startY);

  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return imageData;
  }

  const startPixel = getPixel(data, (startY * width + startX) * 4);
  if (isOutline(startPixel, outlineThreshold)) return imageData;

  const { filled, minY, maxY } = findRegion(data, width, height, startX, startY, outlineThreshold);

  // Apply gradient (flipped = bottom-to-top)
  const top = flipped ? color2 : color1;
  const bottom = flipped ? color1 : color2;
  const range = maxY - minY || 1;
  for (let y = minY; y <= maxY; y++) {
    const t = (y - minY) / range;
    const color: RGBA = {
      r: Math.round(top.r * (1 - t) + bottom.r * t),
      g: Math.round(top.g * (1 - t) + bottom.g * t),
      b: Math.round(top.b * (1 - t) + bottom.b * t),
      a: 255,
    };
    for (let x = 0; x < width; x++) {
      if (filled[y * width + x]) {
        setPixel(data, (y * width + x) * 4, color);
      }
    }
  }

  const midColor: RGBA = {
    r: Math.round((color1.r + color2.r) / 2),
    g: Math.round((color1.g + color2.g) / 2),
    b: Math.round((color1.b + color2.b) / 2),
    a: 255,
  };
  cleanupEdges(data, width, height, filled, midColor);

  return imageData;
}

/**
 * Texture types (kept for type compatibility).
 */
export type TextureType = "dots" | "stripes" | "crosshatch" | "zigzag" | "hearts";

export function textureFill(
  imageData: ImageData,
  startX: number,
  startY: number,
  baseColor: RGBA,
  texture: TextureType,
  options: FloodFillOptions = {}
): ImageData {
  const { outlineThreshold = 50 } = options;
  const { width, height, data } = imageData;

  startX = Math.round(startX);
  startY = Math.round(startY);

  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return imageData;
  }

  const startPixel = getPixel(data, (startY * width + startX) * 4);
  if (isOutline(startPixel, outlineThreshold)) return imageData;

  const { filled } = findRegion(data, width, height, startX, startY, outlineThreshold);

  const lightColor: RGBA = {
    r: Math.min(255, baseColor.r + 40),
    g: Math.min(255, baseColor.g + 40),
    b: Math.min(255, baseColor.b + 40),
    a: 255,
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!filled[y * width + x]) continue;

      let usePattern = false;
      const spacing = 8;

      switch (texture) {
        case "dots":
          usePattern = x % spacing < 3 && y % spacing < 3;
          break;
        case "stripes":
          usePattern = (x + y) % spacing < 3;
          break;
        case "crosshatch":
          usePattern = x % spacing < 2 || y % spacing < 2;
          break;
        case "zigzag":
          usePattern = (x + (y % (spacing * 2) < spacing ? y : -y)) % spacing < 3;
          break;
        case "hearts": {
          const hx = x % 16 - 8;
          const hy = y % 16 - 8;
          usePattern = (hx * hx + (hy - Math.abs(hx) * 0.6) * (hy - Math.abs(hx) * 0.6)) < 20;
          break;
        }
      }

      const color = usePattern ? lightColor : baseColor;
      setPixel(data, (y * width + x) * 4, color);
    }
  }

  cleanupEdges(data, width, height, filled, baseColor);
  return imageData;
}
