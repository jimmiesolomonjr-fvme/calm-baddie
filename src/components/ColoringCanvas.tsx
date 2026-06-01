"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  floodFill,
  gradientFill,
  findRegion,
  hexToRgba,
  type TextureType,
} from "@/lib/flood-fill";
import { saveProgress, loadProgress } from "@/lib/storage";

export type Tool = "fill" | "gradient" | "eraser" | "eyedropper";

export interface EyedropperResult {
  color: string;
  gradientColor2?: string;
}

interface Props {
  imageId: string;
  imageName: string;
  imageSrc: string;
  selectedColor: string;
  gradientColor2: string;
  selectedTexture: TextureType;
  activeTool: Tool;
  brushSize: number;
  onCanvasReady?: () => void;
  onEyedrop?: (result: EyedropperResult) => void;
}

interface HistoryEntry {
  data: ImageData;
}

export default function ColoringCanvas({
  imageId,
  imageName,
  imageSrc,
  selectedColor,
  gradientColor2,
  selectedTexture,
  activeTool,
  brushSize,
  onCanvasReady,
  onEyedrop,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Transform state for zoom/pan
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const [, forceRender] = useState(0);

  // "Continue or Start Fresh" modal
  const [showResumeModal, setShowResumeModal] = useState(false);
  const pendingLoadRef = useRef<{
    img: HTMLImageElement;
    saved: { canvasData: string };
  } | null>(null);

  // Gesture state
  const gestureRef = useRef({
    isPanning: false,
    isPinching: false,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    lastDist: 0,
    lastMidX: 0,
    lastMidY: 0,
    startTime: 0,
    moved: false,
    activePointers: new Map<number, { x: number; y: number }>(),
  });

  // History for undo/redo
  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIdxRef = useRef(-1);

  // Canvas dimensions
  const dimsRef = useRef({ width: 0, height: 0 });

  // Animation lock — prevents interaction during fill animation
  const isAnimatingRef = useRef(false);

  const pushHistory = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, dimsRef.current.width, dimsRef.current.height);
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push({ data });
    historyIdxRef.current = historyRef.current.length - 1;
    if (historyRef.current.length > 30) {
      historyRef.current.shift();
      historyIdxRef.current--;
    }
  }, []);

  const undo = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || historyIdxRef.current <= 0) return;
    historyIdxRef.current--;
    const entry = historyRef.current[historyIdxRef.current];
    ctx.putImageData(entry.data, 0, 0);
    forceRender((n) => n + 1);
  }, []);

  const redo = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current++;
    const entry = historyRef.current[historyIdxRef.current];
    ctx.putImageData(entry.data, 0, 0);
    forceRender((n) => n + 1);
  }, []);

  // Clear all — reset to original image
  const clearAll = useCallback(() => {
    const ctx = ctxRef.current;
    const img = imageRef.current;
    if (!ctx || !img) return;
    ctx.clearRect(0, 0, dimsRef.current.width, dimsRef.current.height);
    ctx.drawImage(img, 0, 0);
    pushHistory();
    forceRender((n) => n + 1);
  }, [pushHistory]);

  // Expose undo/redo/clear via custom events
  useEffect(() => {
    const handleUndo = () => undo();
    const handleRedo = () => redo();
    const handleClear = () => clearAll();
    window.addEventListener("coloring-undo", handleUndo);
    window.addEventListener("coloring-redo", handleRedo);
    window.addEventListener("coloring-clear-all", handleClear);
    return () => {
      window.removeEventListener("coloring-undo", handleUndo);
      window.removeEventListener("coloring-redo", handleRedo);
      window.removeEventListener("coloring-clear-all", handleClear);
    };
  }, [undo, redo, clearAll]);

  // Prevent ALL browser-level zoom while coloring page is mounted.
  // Must be on document level — container-level listeners fire too late.
  useEffect(() => {
    // Prevent pinch-zoom on touch devices (2+ finger touchmove)
    const preventTouchZoom = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
      }
    };

    // Prevent Safari gesture-based zoom
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    // Prevent Ctrl+wheel zoom (desktop browsers)
    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // All listeners must be non-passive to allow preventDefault
    document.addEventListener("touchmove", preventTouchZoom, { passive: false });
    document.addEventListener("touchstart", preventTouchZoom, { passive: false });
    document.addEventListener("gesturestart", preventGesture, { capture: true });
    document.addEventListener("gesturechange", preventGesture, { capture: true });
    document.addEventListener("gestureend", preventGesture, { capture: true });
    document.addEventListener("wheel", preventWheelZoom, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventTouchZoom);
      document.removeEventListener("touchstart", preventTouchZoom);
      document.removeEventListener("gesturestart", preventGesture, { capture: true } as EventListenerOptions);
      document.removeEventListener("gesturechange", preventGesture, { capture: true } as EventListenerOptions);
      document.removeEventListener("gestureend", preventGesture, { capture: true } as EventListenerOptions);
      document.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const thumbCanvas = document.createElement("canvas");
      thumbCanvas.width = 200;
      thumbCanvas.height = 200;
      const tctx = thumbCanvas.getContext("2d");
      if (tctx) {
        const scale = Math.min(200 / canvas.width, 200 / canvas.height);
        const w = canvas.width * scale;
        const h = canvas.height * scale;
        tctx.drawImage(canvas, (200 - w) / 2, (200 - h) / 2, w, h);
      }
      const thumbUrl = thumbCanvas.toDataURL("image/jpeg", 0.7);
      saveProgress(imageId, imageName, dataUrl, thumbUrl);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageId, imageName]);

  // Fit canvas to container helper
  const fitToContainer = useCallback((img: HTMLImageElement) => {
    const container = containerRef.current;
    if (!container) return;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const scaleX = containerW / img.width;
    const scaleY = containerH / img.height;
    const scale = Math.min(scaleX, scaleY) * 0.95;
    transformRef.current = {
      x: (containerW - img.width * scale) / 2,
      y: (containerH - img.height * scale) / 2,
      scale,
    };
    forceRender((n) => n + 1);
  }, []);

  // Load the original image fresh
  const loadFresh = useCallback(
    (img: HTMLImageElement) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      historyRef.current = [];
      historyIdxRef.current = -1;
      pushHistory();
      onCanvasReady?.();
      fitToContainer(img);
    },
    [pushHistory, onCanvasReady, fitToContainer]
  );

  // Load saved progress
  const loadSaved = useCallback(
    (savedDataUrl: string, img: HTMLImageElement) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const savedImg = new Image();
      savedImg.onload = () => {
        ctx.drawImage(savedImg, 0, 0);
        historyRef.current = [];
        historyIdxRef.current = -1;
        pushHistory();
        onCanvasReady?.();
        fitToContainer(img);
      };
      savedImg.src = savedDataUrl;
    },
    [pushHistory, onCanvasReady, fitToContainer]
  );

  // Handle resume modal choices
  const handleContinue = useCallback(() => {
    setShowResumeModal(false);
    const pending = pendingLoadRef.current;
    if (!pending) return;
    loadSaved(pending.saved.canvasData, pending.img);
    pendingLoadRef.current = null;
  }, [loadSaved]);

  const handleStartFresh = useCallback(() => {
    setShowResumeModal(false);
    const pending = pendingLoadRef.current;
    if (!pending) return;
    loadFresh(pending.img);
    pendingLoadRef.current = null;
  }, [loadFresh]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;
      dimsRef.current = { width: img.width, height: img.height };

      const saved = loadProgress(imageId);
      if (saved) {
        // Show the resume modal
        pendingLoadRef.current = { img, saved };
        setShowResumeModal(true);
        // In the meantime, show the saved version
        const tempImg = new Image();
        tempImg.onload = () => {
          ctx.drawImage(tempImg, 0, 0);
          fitToContainer(img);
        };
        tempImg.src = saved.canvasData;
      } else {
        loadFresh(img);
      }
    };
    img.src = imageSrc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, imageId]);

  // Convert screen coords to canvas coords
  const screenToCanvas = useCallback(
    (sx: number, sy: number): [number, number] => {
      const container = containerRef.current;
      if (!container) return [0, 0];
      const rect = container.getBoundingClientRect();
      const t = transformRef.current;
      const cx = (sx - rect.left - t.x) / t.scale;
      const cy = (sy - rect.top - t.y) / t.scale;
      return [cx, cy];
    },
    []
  );

  // Track shift key for eyedropper gradient mode
  const shiftHeldRef = useRef(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "Shift") shiftHeldRef.current = true; };
    const up = (e: KeyboardEvent) => { if (e.key === "Shift") shiftHeldRef.current = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Eyedropper: sample color at point. Shift = grab gradient (sample top & bottom of region).
  const handleEyedrop = useCallback(
    (x: number, y: number) => {
      const ctx = ctxRef.current;
      if (!ctx || !onEyedrop) return;
      const { width, height } = dimsRef.current;
      const px = Math.round(x);
      const py = Math.round(y);
      if (px < 0 || px >= width || py < 0 || py >= height) return;

      const data = ctx.getImageData(0, 0, width, height).data;

      const toHex = (i: number) => {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
      };

      const tappedColor = toHex((py * width + px) * 4);

      if (shiftHeldRef.current) {
        // Gradient mode: scan up and down from tap point to find region bounds,
        // then sample colors at the top and bottom of the region.
        const isBlack = (i: number) => data[i] < 50 && data[i + 1] < 50 && data[i + 2] < 50 && data[i + 3] > 128;

        // Scan up
        let topY = py;
        for (let sy = py - 1; sy >= Math.max(0, py - 300); sy--) {
          const idx = (sy * width + px) * 4;
          if (isBlack(idx)) break;
          topY = sy;
        }

        // Scan down
        let bottomY = py;
        for (let sy = py + 1; sy < Math.min(height, py + 300); sy++) {
          const idx = (sy * width + px) * 4;
          if (isBlack(idx)) break;
          bottomY = sy;
        }

        const color1 = toHex((topY * width + px) * 4);
        const color2 = toHex((bottomY * width + px) * 4);

        onEyedrop({ color: color1, gradientColor2: color2 });
      } else {
        onEyedrop({ color: tappedColor });
      }
    },
    [onEyedrop]
  );

  // Animate fill: paint rows from top to bottom over ~300ms
  const animateFill = useCallback(
    (filledImageData: ImageData, regionFilled: Uint8Array, minY: number, maxY: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { width } = dimsRef.current;

      isAnimatingRef.current = true;

      const totalRows = maxY - minY + 1;
      const durationMs = Math.min(400, Math.max(150, totalRows * 0.5));
      const startTime = performance.now();

      // Keep a snapshot of the canvas before fill for compositing
      const beforeData = ctx.getImageData(0, 0, dimsRef.current.width, dimsRef.current.height);

      const frame = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentRow = minY + Math.floor(eased * totalRows);

        // Start from the before state each frame, then overlay filled rows up to currentRow
        const frameData = new ImageData(
          new Uint8ClampedArray(beforeData.data),
          dimsRef.current.width,
          dimsRef.current.height
        );

        for (let y = minY; y <= currentRow; y++) {
          for (let x = 0; x < width; x++) {
            const pixelIdx = y * width + x;
            if (regionFilled[pixelIdx]) {
              const idx = pixelIdx * 4;
              frameData.data[idx] = filledImageData.data[idx];
              frameData.data[idx + 1] = filledImageData.data[idx + 1];
              frameData.data[idx + 2] = filledImageData.data[idx + 2];
              frameData.data[idx + 3] = filledImageData.data[idx + 3];
            }
          }
        }

        ctx.putImageData(frameData, 0, 0);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          // Final: put the complete filled image
          ctx.putImageData(filledImageData, 0, 0);
          isAnimatingRef.current = false;
          pushHistory();
          forceRender((n) => n + 1);
        }
      };

      requestAnimationFrame(frame);
    },
    [pushHistory]
  );

  // Handle fill at point
  const handleFill = useCallback(
    (x: number, y: number) => {
      const ctx = ctxRef.current;
      if (!ctx || isAnimatingRef.current) return;
      const { width, height } = dimsRef.current;

      const rx = Math.round(x);
      const ry = Math.round(y);
      if (rx < 0 || rx >= width || ry < 0 || ry >= height) return;

      const imageData = ctx.getImageData(0, 0, width, height);
      const color = hexToRgba(selectedColor);

      if (activeTool === "eraser") {
        // Eraser: instant (no animation needed)
        const origCanvas = document.createElement("canvas");
        origCanvas.width = width;
        origCanvas.height = height;
        const origCtx = origCanvas.getContext("2d");
        let result: ImageData;
        if (origCtx && imageRef.current) {
          origCtx.drawImage(imageRef.current, 0, 0);
          const origData = origCtx.getImageData(0, 0, width, height);
          const idx = (ry * width + rx) * 4;
          const origColor = {
            r: origData.data[idx],
            g: origData.data[idx + 1],
            b: origData.data[idx + 2],
            a: origData.data[idx + 3],
          };
          result = floodFill(imageData, x, y, origColor);
        } else {
          result = floodFill(imageData, x, y, { r: 255, g: 255, b: 255, a: 255 });
        }
        ctx.putImageData(result, 0, 0);
        pushHistory();
        forceRender((n) => n + 1);
        return;
      }

      // Find the region first
      const { filled: regionFilled, minY, maxY } = findRegion(
        imageData.data, width, height, rx, ry, 50
      );

      // Compute the final filled image
      let filledImageData: ImageData;
      if (activeTool === "gradient") {
        filledImageData = gradientFill(
          imageData, x, y, color, hexToRgba(gradientColor2)
        );
      } else {
        filledImageData = floodFill(imageData, x, y, color);
      }

      // Animate the reveal
      animateFill(filledImageData, regionFilled, minY, maxY);
    },
    [selectedColor, gradientColor2, activeTool, pushHistory, animateFill]
  );

  // Pointer handlers — use pointer events for single-finger interactions
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (showResumeModal || isAnimatingRef.current) return;
      const g = gestureRef.current;
      g.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // If this is a second finger, start pinch
      if (g.activePointers.size === 2) {
        g.isPanning = false;
        g.isDrawing = false;
        g.isPinching = true;
        const pts = Array.from(g.activePointers.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        g.lastDist = Math.hypot(dx, dy);
        g.lastMidX = (pts[0].x + pts[1].x) / 2;
        g.lastMidY = (pts[0].y + pts[1].y) / 2;
        return;
      }

      const [cx, cy] = screenToCanvas(e.clientX, e.clientY);
      g.startTime = Date.now();
      g.moved = false;

      g.isPanning = true;
      g.lastX = e.clientX;
      g.lastY = e.clientY;
    },
    [activeTool, screenToCanvas, showResumeModal]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (showResumeModal) return;
      const g = gestureRef.current;
      g.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Pinch-to-zoom with two pointers
      if (g.isPinching && g.activePointers.size === 2) {
        const pts = Array.from(g.activePointers.values());
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const dist = Math.hypot(dx, dy);
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;

        const scaleFactor = dist / g.lastDist;
        const t = transformRef.current;
        const newScale = Math.max(0.2, Math.min(5, t.scale * scaleFactor));

        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const cx = midX - rect.left;
          const cy = midY - rect.top;
          t.x = cx - ((cx - t.x) * newScale) / t.scale;
          t.y = cy - ((cy - t.y) * newScale) / t.scale;
        }

        // Also pan with midpoint movement
        t.x += midX - g.lastMidX;
        t.y += midY - g.lastMidY;

        t.scale = newScale;
        g.lastDist = dist;
        g.lastMidX = midX;
        g.lastMidY = midY;
        forceRender((n) => n + 1);
        return;
      }

      if (g.isPanning) {
        const dx = e.clientX - g.lastX;
        const dy = e.clientY - g.lastY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          g.moved = true;
        }
        transformRef.current.x += dx;
        transformRef.current.y += dy;
        g.lastX = e.clientX;
        g.lastY = e.clientY;
        forceRender((n) => n + 1);
      }
    },
    [activeTool, screenToCanvas, showResumeModal]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (showResumeModal) return;
      const g = gestureRef.current;
      g.activePointers.delete(e.pointerId);

      if (g.isPinching) {
        if (g.activePointers.size < 2) {
          g.isPinching = false;
        }
        return;
      }

      if (g.isPanning && !g.moved) {
        const [cx, cy] = screenToCanvas(e.clientX, e.clientY);
        if (activeTool === "eyedropper") {
          handleEyedrop(cx, cy);
        } else {
          handleFill(cx, cy);
        }
      }

      g.isPanning = false;
    },
    [activeTool, screenToCanvas, handleFill, handleEyedrop, pushHistory, showResumeModal]
  );

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const t = transformRef.current;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.2, Math.min(5, t.scale * delta));

    t.x = cx - ((cx - t.x) * newScale) / t.scale;
    t.y = cy - ((cy - t.y) * newScale) / t.scale;
    t.scale = newScale;
    forceRender((n) => n + 1);
  }, []);

  const t = transformRef.current;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative bg-[#fef7fb]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: "none" }}
    >
      {/* Checkerboard background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          transformOrigin: "0 0",
          transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})`,
          imageRendering: "auto",
        }}
      />

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl p-6 mx-6 max-w-sm w-full shadow-2xl text-center">
            <p className="text-4xl mb-3">🎨</p>
            <h2 className="text-xl font-black text-pink-600 mb-2">
              Welcome Back!
            </h2>
            <p className="text-sm text-pink-400 mb-5">
              You have saved progress on this image. What would you like to do?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleContinue}
                className="w-full py-3 rounded-full bg-pink-500 text-white font-bold text-sm active:bg-pink-600 shadow-lg shadow-pink-200"
              >
                Continue Where I Left Off
              </button>
              <button
                onClick={handleStartFresh}
                className="w-full py-3 rounded-full bg-pink-50 text-pink-500 font-bold text-sm border-2 border-pink-200 active:bg-pink-100"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
