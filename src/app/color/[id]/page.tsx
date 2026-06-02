"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ColoringCanvas, { type Tool, type EyedropperResult } from "@/components/ColoringCanvas";
import ColorPalette from "@/components/ColorPalette";
import Toolbar from "@/components/Toolbar";
import AdBanner from "@/components/AdBanner";
import { getImageById } from "@/lib/images";
import { downloadArt, shareArt } from "@/lib/storage";

export default function ColorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const image = getImageById(id);

  // Override viewport to fully disable browser zoom on this page
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute("content") || "";
    if (meta) {
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
      );
    }
    // Also prevent double-tap zoom via touch-action on body
    document.body.style.touchAction = "pan-x pan-y";
    document.documentElement.style.touchAction = "pan-x pan-y";

    return () => {
      if (meta) meta.setAttribute("content", original);
      document.body.style.touchAction = "";
      document.documentElement.style.touchAction = "";
    };
  }, []);

  const [selectedColor, setSelectedColor] = useState("#FF69B4");
  const [gradientColor2, setGradientColor2] = useState("#FFD700");
  const [activeTool, setActiveTool] = useState<Tool>("fill");
  const [showAd, setShowAd] = useState(true);

  // Auto-dismiss ad after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowAd(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleUndo = useCallback(() => {
    window.dispatchEvent(new Event("coloring-undo"));
  }, []);

  const handleRedo = useCallback(() => {
    window.dispatchEvent(new Event("coloring-redo"));
  }, []);

  const handleClearAll = useCallback(() => {
    window.dispatchEvent(new Event("coloring-clear-all"));
  }, []);

  const handleEyedrop = useCallback(
    (result: EyedropperResult) => {
      setSelectedColor(result.color);
      if (result.gradientColor2) {
        // Shift+tap: grabbed a gradient — switch to gradient tool
        setGradientColor2(result.gradientColor2);
        setActiveTool("gradient");
      } else {
        // Normal tap: grabbed a solid color — switch to fill tool
        setActiveTool("fill");
      }
    },
    []
  );

  const handleSave = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    downloadArt(dataUrl, `calm-baddie-${id}.png`);
  }, [id]);

  const handleShare = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    shareArt(dataUrl, `Calm Baddie - ${image?.name || "Art"}`);
  }, [id, image?.name]);

  if (!image) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-pink-50">
        <p className="text-5xl mb-4">😢</p>
        <p className="text-pink-500 font-bold text-lg">Image not found</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar at top */}
      <div className="pt-[env(safe-area-inset-top)]">
        <Toolbar
          activeTool={activeTool}
          onToolSelect={setActiveTool}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          onShare={handleShare}
          onBack={() => router.push("/")}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Canvas area */}
      <ColoringCanvas
        imageId={image.id}
        imageName={image.name}
        imageSrc={image.src}
        selectedColor={selectedColor}
        gradientColor2={gradientColor2}
        selectedTexture="dots"
        activeTool={activeTool}
        brushSize={10}
        onEyedrop={handleEyedrop}
      />

      {/* Dismissible ad */}
      {showAd && (
        <div className="relative">
          <AdBanner slot="0987654321" format="horizontal" />
          <button
            onClick={() => setShowAd(false)}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center"
          >
            ×
          </button>
        </div>
      )}

      {/* Color palette at bottom */}
      <div className="pb-[env(safe-area-inset-bottom)]">
        <ColorPalette
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          gradientColor2={gradientColor2}
          onGradientColor2Select={setGradientColor2}
          showGradientPicker={activeTool === "gradient"}
          isEyedropper={activeTool === "eyedropper"}
        />
      </div>
    </div>
  );
}
