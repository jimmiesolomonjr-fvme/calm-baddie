"use client";

import type { Tool } from "./ColoringCanvas";
import {
  PaintBrushIcon,
  SwatchIcon,
  EyeDropperIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/solid";
import type { ComponentType, SVGProps } from "react";

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

const tools: { id: Tool; Icon: ComponentType<SVGProps<SVGSVGElement>>; label: string }[] = [
  { id: "fill", Icon: PaintBrushIcon, label: "Solid Fill" },
  { id: "gradient", Icon: SwatchIcon, label: "Gradient Fill" },
  { id: "eyedropper", Icon: EyeDropperIcon, label: "Color Picker" },
  { id: "eraser", Icon: ArrowPathIcon, label: "Eraser" },
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
          className="flex items-center gap-0.5 text-pink-500 font-bold text-sm"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={onUndo}
            className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center active:bg-pink-100"
            title="Undo"
          >
            <ArrowUturnLeftIcon className="w-[18px] h-[18px] text-pink-500" />
          </button>
          <button
            onClick={onRedo}
            className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center active:bg-pink-100"
            title="Redo"
          >
            <ArrowUturnRightIcon className="w-[18px] h-[18px] text-pink-500" />
          </button>
          <button
            onClick={onClearAll}
            className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center active:bg-red-100"
            title="Clear All"
          >
            <TrashIcon className="w-[18px] h-[18px] text-red-400" />
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
            <tool.Icon
              className={`w-6 h-6 ${
                activeTool === tool.id ? "text-pink-600" : "text-pink-400"
              }`}
            />
            <span
              className={`text-[10px] font-bold ${
                activeTool === tool.id ? "text-pink-600" : "text-pink-400"
              }`}
            >
              {tool.label}
            </span>
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
