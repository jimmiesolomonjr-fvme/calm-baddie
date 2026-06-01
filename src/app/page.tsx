"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import { coloringImages, categories, type Category } from "@/lib/images";
import { getAllSavedArt, deleteSavedArt, type SavedArt } from "@/lib/storage";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"library" | "my-art">("library");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [savedArt, setSavedArt] = useState<SavedArt[]>([]);

  useEffect(() => {
    setSavedArt(getAllSavedArt());
  }, [activeTab]);

  const filteredImages =
    activeCategory === "All"
      ? coloringImages
      : coloringImages.filter((img) => img.category === activeCategory);

  const handleDeleteArt = (id: string) => {
    deleteSavedArt(id);
    setSavedArt(getAllSavedArt());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-pink-gradient pt-[env(safe-area-inset-top)]">
        <div className="px-4 pt-3 pb-2 flex justify-center">
          <Image
            src="/logo.png"
            alt="Calm Baddie - Adult Coloring Book"
            width={220}
            height={220}
            className="object-contain"
            priority
          />
        </div>

        {/* Category tabs (library only) */}
        {activeTab === "library" && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                    : "bg-white/70 text-pink-400 border border-pink-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar px-3 py-3">
        {activeTab === "library" ? (
          /* Library Grid */
          <div className="grid grid-cols-2 gap-3">
            {filteredImages.map((img) => (
              <Link
                key={img.id}
                href={`/color/${img.id}`}
                className="image-card relative rounded-2xl overflow-hidden border-2 border-pink-200 bg-white shadow-sm"
              >
                {img.isNew && (
                  <span className="absolute top-2 right-2 bg-green-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                    New
                  </span>
                )}
                <div className="aspect-square relative">
                  <Image
                    src={img.src}
                    alt={img.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="px-2 py-1.5 bg-pink-50">
                  <p className="text-xs font-bold text-pink-600 truncate">
                    {img.name}
                  </p>
                </div>
              </Link>
            ))}

            {filteredImages.length === 0 && (
              <div className="col-span-2 text-center py-20">
                <p className="text-5xl mb-3">🎨</p>
                <p className="text-pink-400 font-bold">
                  More designs coming soon!
                </p>
              </div>
            )}
          </div>
        ) : (
          /* My Art Grid */
          <div>
            {savedArt.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-3">🖼️</p>
                <p className="text-pink-400 font-bold">
                  No art yet! Start coloring to see your creations here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {savedArt.map((art) => (
                  <div
                    key={art.id}
                    className="image-card relative rounded-2xl overflow-hidden border-2 border-pink-200 bg-white shadow-sm"
                  >
                    {art.completed && (
                      <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                        Done
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm("Delete this artwork?")) {
                          handleDeleteArt(art.id);
                        }
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-400 text-white text-xs flex items-center justify-center z-10"
                    >
                      ×
                    </button>
                    <Link href={`/color/${art.imageId}`}>
                      <div className="aspect-square relative">
                        <Image
                          src={art.thumbnail}
                          alt={art.imageName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          unoptimized
                        />
                      </div>
                      <div className="px-2 py-1.5 bg-pink-50">
                        <p className="text-xs font-bold text-pink-600 truncate">
                          {art.imageName}
                        </p>
                        <p className="text-[10px] text-pink-300">
                          {new Date(art.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
