"use client";

interface Props {
  activeTab: "library" | "my-art";
  onTabChange: (tab: "library" | "my-art") => void;
}

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex bg-white border-t-2 border-pink-200 pb-[env(safe-area-inset-bottom)]">
      <button
        onClick={() => onTabChange("library")}
        className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
          activeTab === "library" ? "text-pink-500" : "text-pink-300"
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="text-xs font-bold">Library</span>
        {activeTab === "library" && (
          <div className="w-5 h-1 rounded-full bg-pink-500 mt-0.5" />
        )}
      </button>
      <button
        onClick={() => onTabChange("my-art")}
        className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
          activeTab === "my-art" ? "text-pink-500" : "text-pink-300"
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-xs font-bold">My Art</span>
        {activeTab === "my-art" && (
          <div className="w-5 h-1 rounded-full bg-pink-500 mt-0.5" />
        )}
      </button>
    </nav>
  );
}
