"use client";

import { useState } from "react";

// ─── SOLID COLOR PALETTES ───

const PALETTES = {
  Baddie: [
    "#FF69B4", "#FF1493", "#C71585", "#DB7093", "#FFB6C1",
    "#FFC0CB", "#FF6347", "#FF4500", "#FFD700", "#FFA500",
    "#E6E6FA", "#DDA0DD", "#BA55D3", "#9370DB", "#8B008B",
    "#000000", "#4A4A4A", "#808080", "#C0C0C0", "#FFFFFF",
    "#F5DEB3", "#DEB887", "#D2691E", "#8B4513", "#654321",
  ],
  Pastel: [
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
    "#E8BAFF", "#FFB3E6", "#B3FFE6", "#FFE6B3", "#B3D9FF",
    "#FFB3B3", "#B3FFB3", "#B3B3FF", "#FFE6FF", "#E6FFE6",
    "#FFE6E6", "#E6E6FF", "#FFF0F5", "#F0FFF0", "#F5F5DC",
    "#FAEBD7", "#FFF8DC", "#FFFACD", "#FAFAD2", "#FFEFD5",
  ],
  Bold: [
    "#FF0000", "#FF4500", "#FF8C00", "#FFD700", "#32CD32",
    "#00CED1", "#1E90FF", "#4169E1", "#8A2BE2", "#FF00FF",
    "#DC143C", "#B22222", "#228B22", "#006400", "#00008B",
    "#4B0082", "#800080", "#800000", "#808000", "#008080",
    "#000000", "#333333", "#666666", "#999999", "#FFFFFF",
  ],
  Skin: [
    "#FFF0E6", "#FFE4CC", "#FFDFC4", "#F5CBA7", "#F0D5BE",
    "#EECEB3", "#E1B899", "#D5A77F", "#C99B6C", "#BB8855",
    "#A67744", "#8B6538", "#7A5C44", "#6B4423", "#563C2A",
    "#4A3728", "#3C2415", "#2A1B0F", "#1A0F08", "#F5CBA7",
    "#FFE0BD", "#FFD1A4", "#FFC18A", "#FFB071", "#FF9F57",
  ],
  Lips: [
    "#FF1744", "#E91E63", "#C2185B", "#AD1457", "#880E4F",
    "#FF5252", "#FF4081", "#F50057", "#D50000", "#B71C1C",
    "#FF8A80", "#FF80AB", "#F48FB1", "#CE93D8", "#BA68C8",
    "#EF9A9A", "#FFCDD2", "#F8BBD0", "#E57373", "#CC6666",
    "#A0522D", "#8B4513", "#D2691E", "#CD853F", "#DEB887",
  ],
  Denim: [
    "#1565C0", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5",
    "#64B5F6", "#90CAF9", "#BBDEFB", "#E3F2FD", "#0D47A1",
    "#5C6BC0", "#7986CB", "#9FA8DA", "#3F51B5", "#283593",
    "#546E7A", "#78909C", "#90A4AE", "#B0BEC5", "#CFD8DC",
    "#37474F", "#455A64", "#607D8B", "#263238", "#ECEFF1",
  ],
  Hair: [
    "#F5DEB3", "#DAA520", "#B8860B", "#D4A574", "#8B6914",
    "#A0522D", "#8B4513", "#6B4423", "#4A3728", "#2C1810",
    "#1A1A1A", "#0A0A0A", "#333333", "#555555", "#E5E7EB",
    "#9CA3AF", "#DC2626", "#7F1D1D", "#F9A8D4", "#BE185D",
    "#60A5FA", "#1E3A8A", "#C084FC", "#581C87", "#22C55E",
  ],
  Nature: [
    "#228B22", "#32CD32", "#90EE90", "#006400", "#8FBC8F",
    "#87CEEB", "#4682B4", "#1E90FF", "#00BFFF", "#87CEFA",
    "#F4A460", "#DEB887", "#D2B48C", "#BC8F8F", "#CD853F",
    "#FFD700", "#FFA07A", "#FF6347", "#FF4500", "#DC143C",
    "#8B4513", "#A0522D", "#D2691E", "#DAA520", "#B8860B",
  ],
  Fabric: [
    "#FFFFFF", "#F5F5F5", "#E8E8E8", "#D4D4D4", "#1A1A1A",
    "#8B0000", "#B22222", "#DC143C", "#191970", "#000080",
    "#800080", "#4B0082", "#2F4F4F", "#556B2F", "#8B4513",
    "#F5F5DC", "#FFFDD0", "#FFF8E7", "#FAF0E6", "#FFEFD5",
    "#FFD700", "#C0C0C0", "#CD7F32", "#B87333", "#E8CCD7",
  ],
};

// ─── GRADIENT PRESETS BY CATEGORY ───

export interface GradientPreset {
  id: string;
  name: string;
  color1: string;
  color2: string;
}

const GRADIENT_CATEGORIES: Record<string, GradientPreset[]> = {
  "Skin Tones": [
    { id: "porcelain", name: "Porcelain", color1: "#FFF0E6", color2: "#F5D5C0" },
    { id: "fair", name: "Fair", color1: "#FFE4CC", color2: "#E8C4A2" },
    { id: "light", name: "Light", color1: "#F5CBA7", color2: "#D4A574" },
    { id: "beige", name: "Beige", color1: "#EECEB3", color2: "#C99B6C" },
    { id: "honey", name: "Honey", color1: "#DEB887", color2: "#A67744" },
    { id: "golden-brown", name: "Golden Brown", color1: "#D4A574", color2: "#8B6538" },
    { id: "caramel", name: "Caramel", color1: "#C99B6C", color2: "#7A5C44" },
    { id: "brown", name: "Brown", color1: "#A67744", color2: "#5C3D2E" },
    { id: "chestnut", name: "Chestnut", color1: "#8B6538", color2: "#4A3728" },
    { id: "deep-brown", name: "Deep Brown", color1: "#6B4423", color2: "#3C2415" },
    { id: "espresso", name: "Espresso", color1: "#563C2A", color2: "#2A1B0F" },
    { id: "dark", name: "Dark", color1: "#4A3728", color2: "#1A0F08" },
  ],
  Shades: [
    { id: "shadow-soft", name: "Soft Shadow", color1: "#F8F8F8", color2: "#D4D4D4" },
    { id: "shadow-med", name: "Medium Shadow", color1: "#E5E5E5", color2: "#9CA3AF" },
    { id: "shadow-deep", name: "Deep Shadow", color1: "#9CA3AF", color2: "#4B5563" },
    { id: "shadow-dark", name: "Dark Shadow", color1: "#6B7280", color2: "#1F2937" },
    { id: "warm-shade", name: "Warm Shade", color1: "#FDF2E9", color2: "#D5B895" },
    { id: "cool-shade", name: "Cool Shade", color1: "#EEF2FF", color2: "#A5B4FC" },
    { id: "pink-shade", name: "Pink Shade", color1: "#FFF1F2", color2: "#E8A0BF" },
    { id: "brown-shade", name: "Brown Shade", color1: "#D7C4A5", color2: "#7C6650" },
  ],
  Sunset: [
    { id: "sunset-classic", name: "Classic Sunset", color1: "#FF6B6B", color2: "#FFD93D" },
    { id: "sunset-rose", name: "Rose Sunset", color1: "#FF9FD5", color2: "#FF6B6B" },
    { id: "sunset-fire", name: "Fire Sunset", color1: "#FF4500", color2: "#FFD700" },
    { id: "sunset-peach", name: "Peach Glow", color1: "#FECACA", color2: "#FDE68A" },
    { id: "sunset-coral", name: "Coral Sunset", color1: "#FF8A80", color2: "#FF80AB" },
    { id: "sunset-golden", name: "Golden Hour", color1: "#FDE68A", color2: "#B45309" },
  ],
  "Cotton Candy": [
    { id: "cc-classic", name: "Classic", color1: "#FF9FD5", color2: "#A78BFA" },
    { id: "cc-lavender", name: "Lavender Dream", color1: "#C4B5FD", color2: "#FBCFE8" },
    { id: "cc-blush", name: "Blush", color1: "#FFF1F2", color2: "#FB7185" },
    { id: "cc-fairy", name: "Fairy Dust", color1: "#F0ABFC", color2: "#67E8F9" },
    { id: "cc-bubblegum", name: "Bubblegum", color1: "#F472B6", color2: "#E879F9" },
    { id: "cc-lilac", name: "Lilac Mist", color1: "#DDD6FE", color2: "#FECDD3" },
  ],
  Ocean: [
    { id: "ocean-deep", name: "Deep Ocean", color1: "#38BDF8", color2: "#1E3A5F" },
    { id: "ocean-sky", name: "Sky Blue", color1: "#BAE6FD", color2: "#FFFFFF" },
    { id: "ocean-mint", name: "Mint Sea", color1: "#6EE7B7", color2: "#3B82F6" },
    { id: "ocean-ice", name: "Ice", color1: "#E0F2FE", color2: "#7DD3FC" },
    { id: "ocean-teal", name: "Teal Depths", color1: "#5EEAD4", color2: "#0F766E" },
    { id: "ocean-midnight", name: "Midnight Sea", color1: "#1E3A5F", color2: "#0F172A" },
  ],
  Earth: [
    { id: "earth-forest", name: "Forest", color1: "#22C55E", color2: "#064E3B" },
    { id: "earth-mocha", name: "Mocha", color1: "#92400E", color2: "#FDE68A" },
    { id: "earth-rosegold", name: "Rose Gold", color1: "#F9A8D4", color2: "#D4A574" },
    { id: "earth-terracotta", name: "Terracotta", color1: "#E07B4C", color2: "#8B4513" },
    { id: "earth-olive", name: "Olive Grove", color1: "#A3BE8C", color2: "#4A5A3A" },
    { id: "earth-clay", name: "Clay", color1: "#D4A574", color2: "#7C5B3A" },
  ],
  Neon: [
    { id: "neon-pink", name: "Neon Pink", color1: "#FF00FF", color2: "#FF69B4" },
    { id: "neon-blue", name: "Neon Blue", color1: "#00FFFF", color2: "#0EA5E9" },
    { id: "neon-mixed", name: "Neon Mix", color1: "#F0ABFC", color2: "#22D3EE" },
    { id: "neon-berry", name: "Berry Neon", color1: "#9333EA", color2: "#EC4899" },
    { id: "neon-lime", name: "Neon Lime", color1: "#BFFF00", color2: "#22C55E" },
    { id: "neon-midnight", name: "Midnight Glow", color1: "#1E1B4B", color2: "#6366F1" },
  ],
  Hair: [
    { id: "hair-blonde", name: "Blonde", color1: "#F5DEB3", color2: "#DAA520" },
    { id: "hair-strawberry", name: "Strawberry", color1: "#FFC0A0", color2: "#CC6644" },
    { id: "hair-auburn", name: "Auburn", color1: "#A0522D", color2: "#5C2E0E" },
    { id: "hair-brunette", name: "Brunette", color1: "#6B4423", color2: "#2C1810" },
    { id: "hair-black", name: "Black", color1: "#333333", color2: "#0A0A0A" },
    { id: "hair-silver", name: "Silver", color1: "#E5E7EB", color2: "#9CA3AF" },
    { id: "hair-red", name: "Red", color1: "#DC2626", color2: "#7F1D1D" },
    { id: "hair-pink", name: "Pink", color1: "#F9A8D4", color2: "#BE185D" },
    { id: "hair-blue", name: "Blue", color1: "#60A5FA", color2: "#1E3A8A" },
    { id: "hair-purple", name: "Purple", color1: "#C084FC", color2: "#581C87" },
  ],
  Metallic: [
    { id: "metal-gold", name: "Gold", color1: "#FFD700", color2: "#B8860B" },
    { id: "metal-silver", name: "Silver", color1: "#E8E8E8", color2: "#808080" },
    { id: "metal-bronze", name: "Bronze", color1: "#CD7F32", color2: "#6B3E1F" },
    { id: "metal-copper", name: "Copper", color1: "#DA8A67", color2: "#8B4513" },
    { id: "metal-platinum", name: "Platinum", color1: "#F5F5F5", color2: "#B0B0B0" },
    { id: "metal-rosegold", name: "Rose Gold", color1: "#F4C2C2", color2: "#B76E79" },
    { id: "metal-chrome", name: "Chrome", color1: "#D0D0D0", color2: "#505050" },
    { id: "metal-brass", name: "Brass", color1: "#E8C547", color2: "#8B7536" },
  ],
  Lips: [
    { id: "lips-nude", name: "Nude", color1: "#D4A08C", color2: "#B07D6A" },
    { id: "lips-pink", name: "Pink", color1: "#FF69B4", color2: "#C71585" },
    { id: "lips-red", name: "Classic Red", color1: "#FF1744", color2: "#B71C1C" },
    { id: "lips-berry", name: "Berry", color1: "#9C27B0", color2: "#4A148C" },
    { id: "lips-mauve", name: "Mauve", color1: "#CE93D8", color2: "#8E4585" },
    { id: "lips-coral", name: "Coral", color1: "#FF7043", color2: "#D84315" },
    { id: "lips-brown", name: "Brown", color1: "#A1887F", color2: "#5D4037" },
    { id: "lips-plum", name: "Plum", color1: "#7B1FA2", color2: "#38006B" },
  ],
  Clothing: [
    { id: "cloth-white-tee", name: "White Tee", color1: "#FFFFFF", color2: "#E0E0E0" },
    { id: "cloth-black-dress", name: "Black Dress", color1: "#2A2A2A", color2: "#0A0A0A" },
    { id: "cloth-denim-light", name: "Light Denim", color1: "#90CAF9", color2: "#42A5F5" },
    { id: "cloth-denim-dark", name: "Dark Denim", color1: "#1565C0", color2: "#0D47A1" },
    { id: "cloth-red-dress", name: "Red Dress", color1: "#EF5350", color2: "#B71C1C" },
    { id: "cloth-olive", name: "Olive Cargo", color1: "#8D9B6A", color2: "#556B2F" },
    { id: "cloth-leather", name: "Leather", color1: "#5D4037", color2: "#1A0F08" },
    { id: "cloth-pink-silk", name: "Pink Silk", color1: "#F8BBD0", color2: "#F06292" },
    { id: "cloth-lavender", name: "Lavender Top", color1: "#E1BEE7", color2: "#AB47BC" },
    { id: "cloth-cream", name: "Cream Knit", color1: "#FFF8E1", color2: "#F5DEB3" },
  ],
  Nails: [
    { id: "nail-french", name: "French Tip", color1: "#FFFFFF", color2: "#FFE4E1" },
    { id: "nail-red", name: "Red Nails", color1: "#FF1744", color2: "#D50000" },
    { id: "nail-nude", name: "Nude Nails", color1: "#FFCCBC", color2: "#BCAAA4" },
    { id: "nail-black", name: "Black Nails", color1: "#333333", color2: "#0A0A0A" },
    { id: "nail-pink", name: "Hot Pink", color1: "#FF4081", color2: "#C51162" },
    { id: "nail-chrome", name: "Chrome Nails", color1: "#E0E0E0", color2: "#757575" },
    { id: "nail-lavender", name: "Lavender", color1: "#CE93D8", color2: "#8E24AA" },
    { id: "nail-mint", name: "Mint", color1: "#A7FFEB", color2: "#00BFA5" },
  ],
};

type PaletteName = keyof typeof PALETTES;
type GradientCategoryName = keyof typeof GRADIENT_CATEGORIES;

interface Props {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  gradientColor2: string;
  onGradientColor2Select: (color: string) => void;
  showGradientPicker: boolean;
  isEyedropper?: boolean;
}

export default function ColorPalette({
  selectedColor,
  onColorSelect,
  gradientColor2,
  onGradientColor2Select,
  showGradientPicker,
  isEyedropper,
}: Props) {
  const [activePalette, setActivePalette] = useState<PaletteName>("Baddie");
  const [activeGradientCat, setActiveGradientCat] = useState<GradientCategoryName>("Skin Tones");
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const colors = PALETTES[activePalette];
  const gradients = GRADIENT_CATEGORIES[activeGradientCat];

  return (
    <div className="bg-white border-t-2 border-pink-200">
      {isEyedropper ? (
        /* ──── EYEDROPPER MODE ──── */
        <div className="px-4 py-3">
          <p className="text-xs font-bold text-pink-500 mb-3">
            Tap the canvas to pick a color
          </p>
          <div className="flex items-center gap-4">
            {/* Big swatch showing the current color */}
            <div
              className="w-16 h-16 rounded-2xl border-3 border-pink-300 shadow-lg shadow-pink-100"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-pink-400 mb-1">Selected Color</p>
              <p className="text-sm font-mono font-bold text-foreground">{selectedColor.toUpperCase()}</p>
              <p className="text-[10px] text-pink-300 mt-1">
                Hold <span className="font-bold text-pink-400">Shift</span> + tap for gradient
              </p>
            </div>
            {/* Mini gradient preview if they've grabbed one before */}
            {gradientColor2 && gradientColor2 !== selectedColor && (
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-pink-200"
                  style={{
                    background: `linear-gradient(180deg, ${selectedColor} 0%, ${gradientColor2} 100%)`,
                  }}
                />
                <span className="text-[9px] font-semibold text-pink-300">Last gradient</span>
              </div>
            )}
          </div>
        </div>
      ) : showGradientPicker ? (
        /* ──── GRADIENT MODE ──── */
        <>
          {/* Gradient category tabs */}
          <div className="flex gap-1.5 px-3 pt-2 overflow-x-auto hide-scrollbar">
            {(Object.keys(GRADIENT_CATEGORIES) as GradientCategoryName[]).map((name) => (
              <button
                key={name}
                onClick={() => setActiveGradientCat(name)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeGradientCat === name
                    ? "bg-pink-500 text-white"
                    : "bg-pink-50 text-pink-400"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Gradient preset swatches */}
          <div className="flex gap-2.5 px-3 py-2.5 overflow-x-auto hide-scrollbar">
            {gradients.map((preset) => {
              const isSelected =
                selectedColor === preset.color1 && gradientColor2 === preset.color2;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onColorSelect(preset.color1);
                    onGradientColor2Select(preset.color2);
                  }}
                  className="flex-shrink-0 flex flex-col items-center gap-1"
                >
                  <div
                    className={`rounded-xl overflow-hidden transition-transform ${
                      isSelected
                        ? "scale-110 ring-3 ring-pink-500 ring-offset-2"
                        : "ring-1 ring-gray-200"
                    }`}
                    style={{ width: 48, height: 48 }}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(180deg, ${preset.color1} 0%, ${preset.color2} 100%)`,
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-semibold text-pink-400 max-w-[52px] truncate">
                    {preset.name}
                  </span>
                </button>
              );
            })}

            {/* Custom gradient button */}
            <button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className="flex-shrink-0 flex flex-col items-center gap-1"
            >
              <div
                className={`w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center ${
                  showCustomPicker ? "border-pink-500 bg-pink-50" : "border-pink-300 bg-white"
                }`}
              >
                <span className="text-pink-400 text-lg">+</span>
              </div>
              <span className="text-[9px] font-semibold text-pink-400">Custom</span>
            </button>
          </div>

          {/* Custom gradient color pickers */}
          {showCustomPicker && (
            <div className="flex gap-3 px-3 pb-2">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-pink-400 block mb-1">
                  Top Color
                </label>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => onColorSelect(e.target.value)}
                  className="w-full h-9 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex-1 flex items-end pb-[1px]">
                <div
                  className="w-full h-9 rounded-lg border border-gray-200"
                  style={{
                    background: `linear-gradient(180deg, ${selectedColor} 0%, ${gradientColor2} 100%)`,
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-pink-400 block mb-1">
                  Bottom Color
                </label>
                <input
                  type="color"
                  value={gradientColor2}
                  onChange={(e) => onGradientColor2Select(e.target.value)}
                  className="w-full h-9 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        /* ──── SOLID FILL MODE ──── */
        <>
          {/* Palette tabs */}
          <div className="flex gap-1 px-3 pt-2 overflow-x-auto hide-scrollbar">
            {(Object.keys(PALETTES) as PaletteName[]).map((name) => (
              <button
                key={name}
                onClick={() => setActivePalette(name)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activePalette === name
                    ? "bg-pink-500 text-white"
                    : "bg-pink-50 text-pink-400"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Color swatches */}
          <div className="flex gap-2 px-3 py-2 overflow-x-auto hide-scrollbar">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`color-swatch w-9 h-9 rounded-full flex-shrink-0 border-2 ${
                  selectedColor === color
                    ? "selected border-white"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}

            {/* Custom color picker button */}
            <button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className="w-9 h-9 rounded-full flex-shrink-0 border-2 border-dashed border-pink-300 flex items-center justify-center bg-pink-50"
            >
              <span className="text-pink-400 text-lg">+</span>
            </button>
          </div>

          {/* Custom color picker */}
          {showCustomPicker && (
            <div className="px-3 pb-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => onColorSelect(e.target.value)}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
