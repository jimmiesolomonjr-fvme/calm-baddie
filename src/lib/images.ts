/**
 * Image catalog for the coloring library.
 */

export interface ColoringImage {
  id: string;
  name: string;
  src: string;
  category: string;
  premium: boolean;
  isNew?: boolean;
}

export const categories = [
  "All",
  "Baddie",
  "Lifestyle",
  "Fashion",
  "Nature",
  "Cozy",
] as const;

export type Category = (typeof categories)[number];

export const coloringImages: ColoringImage[] = [
  {
    id: "graffiti-queen",
    name: "Graffiti Queen",
    src: "/images/graffiti-queen.png",
    category: "Baddie",
    premium: false,
    isNew: true,
  },
  {
    id: "vip-baddie",
    name: "VIP Baddie",
    src: "/images/vip-baddie.png",
    category: "Lifestyle",
    premium: false,
    isNew: true,
  },
  {
    id: "nail-salon",
    name: "Nail Salon",
    src: "/images/nail-salon.png",
    category: "Lifestyle",
    premium: false,
    isNew: true,
  },
  {
    id: "chill-vibes",
    name: "Chill Vibes",
    src: "/images/chill-vibes.png",
    category: "Baddie",
    premium: false,
    isNew: true,
  },
  {
    id: "henny-nights",
    name: "Henny Nights",
    src: "/images/henny-nights.png",
    category: "Lifestyle",
    premium: false,
    isNew: true,
  },
];

export function getImagesByCategory(category: Category): ColoringImage[] {
  if (category === "All") return coloringImages;
  return coloringImages.filter((img) => img.category === category);
}

export function getImageById(id: string): ColoringImage | undefined {
  return coloringImages.find((img) => img.id === id);
}
