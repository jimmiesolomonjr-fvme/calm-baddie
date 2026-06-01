"use client";

import type { Tool } from "./ColoringCanvas";

interface Props {
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onShare: () => void;
  onBack: () => void;
  onClearAll: () => void;
}

const tools: { id: Tool; icon: string; label: string; hint?: string }[] = [
  { id: "fill", icon: "🪣", label: "Solid Fill" },
  { id: "gradient", icon: "🌈", label: "Gradient Fill" },
  { id: "eyedropper", icon: "💧", label: "Color Picker", hint: "Shift = grab gradient" },
  { id: "eraser", icon: "🧹", label: "Eraser" },
];

export default function Toolbar({
  activeTool,
  onToolSelect,
  onUndo,
  onRedo,
  onSave,
  onShare,
  onBack,
  onClearAll,
}: Props) {
  return (
    <div className="bg-white">
      {/* Top action bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-pink-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-pink-500 font-bold text-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={onUndo}
            className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center active:bg-pink-100"
            title="Undo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3L3 13" />
            </svg>
          </button>
          <button
            onClick={onRedo}
            className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center active:bg-pink-100"
            title="Redo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.69 3L21 13" />
            </svg>
          </button>
          <button
            onClick={onClearAll}
            className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center active:bg-red-100"
            title="Clear All"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M5 6l1 14h12l1-14" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="px-3 py-1.5 rounded-full bg-pink-50 text-pink-500 font-bold text-xs active:bg-pink-100"
          >
            Save
          </button>
          <button
            onClick={onShare}
            className="px-3 py-1.5 rounded-full bg-pink-500 text-white font-bold text-xs active:bg-pink-600"
          >
            Share
          </button>
        </div>
      </div>

      {/* Tool buttons */}
      <div className="flex items-center justify-around px-4 py-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`tool-btn flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl ${
              activeTool === tool.id
                ? "active bg-pink-100"
                : "bg-transparent"
            }`}
          >
            <span className="text-lg">{tool.icon}</span>
            <span className="text-[10px] font-bold text-pink-500">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Eyedropper hint */}
      {activeTool === "eyedropper" && (
        <div className="px-4 pb-2 text-center">
          <span className="text-[11px] font-semibold text-pink-400">
            Tap to pick a solid color &nbsp;·&nbsp; Hold <kbd className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-600 font-bold text-[10px]">Shift</kbd> + tap to grab a gradient
          </span>
        </div>
      )}
    </div>
  );
}
