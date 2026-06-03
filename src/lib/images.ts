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
  {
    id: "shopping-spree",
    name: "Shopping Spree",
    src: "/images/shopping-spree.png",
    category: "Fashion",
    premium: false,
    isNew: true,
  },
  {
    id: "studio-session",
    name: "Studio Session",
    src: "/images/studio-session.png",
    category: "Lifestyle",
    premium: false,
    isNew: true,
  },
  {
    id: "mirror-selfie",
    name: "Mirror Selfie",
    src: "/images/mirror-selfie.png",
    category: "Baddie",
    premium: false,
    isNew: true,
  },
  {
    id: "moto-baddie",
    name: "Moto Baddie",
    src: "/images/moto-baddie.png",
    category: "Baddie",
    premium: false,
    isNew: true,
  },
  {
    id: "dinner-date",
    name: "Dinner Date",
    src: "/images/dinner-date.png",
    category: "Lifestyle",
    premium: false,
    isNew: true,
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    src: "/images/iced-coffee.png",
    category: "Lifestyle",
    premium: false,
    isNew: true,
  },
  {
    id: "slam-cover",
    name: "SLAM Cover",
    src: "/images/slam-cover.png",
    category: "Baddie",
    premium: false,
    isNew: true,
  },
  {
    id: "dance-battle",
    name: "Dance Battle",
    src: "/images/dance-battle.png",
    category: "Lifestyle",
    premium: false,
    isNew: true,
  },
  {
    id: "beach-baddies",
    name: "Beach Baddies",
    src: "/images/beach-baddies.png",
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
