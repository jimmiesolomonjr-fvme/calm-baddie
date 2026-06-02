"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import AdBanner from "@/components/AdBanner";
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
        <div className="px-4 pt-3 pb-1 flex justify-center">
          <Image
            src="/logo.png"
            alt="Color Baddies - Free Online Adult Coloring Book"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
        <p className="text-center text-pink-500 text-xs font-bold px-6 pb-2">
          Free online coloring pages — tap to fill with colors, gradients, and skin tones
        </p>

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
        {/* Ad banner */}
        <AdBanner slot="1234567890" format="horizontal" className="mb-3" />

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

        {/* SEO content — visible, styled to match the app */}
        {activeTab === "library" && (
          <section className="mt-6 mb-4 px-1">
            <div className="bg-white rounded-2xl border-2 border-pink-100 p-4">
              <h2 className="text-lg font-black text-pink-600 mb-2">
                Your Go-To Adult Coloring Book — Right in Your Browser
              </h2>
              <p className="text-xs text-pink-400 leading-relaxed mb-3">
                Color Baddies is a free online coloring book made for grown women who love bold,
                beautiful art. Every page features hand-curated baddie illustrations — from VIP
                nights and nail salon vibes to graffiti queens and shopping sprees. No app download
                needed. Just pick a page, tap a region, and watch it fill with color.
              </p>

              <h3 className="text-sm font-bold text-pink-600 mb-1">
                Coloring Tools That Actually Hit
              </h3>
              <ul className="text-xs text-pink-400 leading-relaxed mb-3 space-y-1">
                <li><span className="font-bold text-pink-500">Solid Fill</span> — Tap any region to flood it with your chosen color. 100+ colors across Baddie, Pastel, Bold, Skin, and Nature palettes.</li>
                <li><span className="font-bold text-pink-500">Gradient Fill</span> — Smooth two-tone blends with 70+ presets. Skin tone gradients, hair shades, sunset vibes, metallic finishes, cotton candy dreams, and more.</li>
                <li><span className="font-bold text-pink-500">Color Picker</span> — Tap any colored region to grab that exact shade. Hold Shift to sample a gradient.</li>
                <li><span className="font-bold text-pink-500">Undo, Redo, and Clear</span> — Experiment freely. Every stroke is reversible.</li>
              </ul>

              <h3 className="text-sm font-bold text-pink-600 mb-1">
                Made for Relaxation
              </h3>
              <p className="text-xs text-pink-400 leading-relaxed mb-3">
                Coloring is proven to reduce stress and anxiety. Color Baddies gives you that calm,
                creative escape wherever you are — on the couch, on the bus, on your lunch break.
                Your progress saves automatically so you can pick up right where you left off.
                When you finish a page, save it to your camera roll or share it with friends.
              </p>

              <h3 className="text-sm font-bold text-pink-600 mb-1">
                Works Everywhere
              </h3>
              <p className="text-xs text-pink-400 leading-relaxed">
                Color Baddies works on any device with a browser — iPhone, Android, iPad, laptop,
                desktop. Add it to your home screen for an app-like experience. New coloring pages
                added regularly. No account needed, no sign-up, completely free.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
