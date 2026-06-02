import React from "react";
import { TabType } from "../types";

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; emoji: string }[] = [
  { id: "home", label: "홈", emoji: "🏠" },
  { id: "chat", label: "질문", emoji: "💬" },
  { id: "mindmap", label: "마인드맵", emoji: "🗺️" },
  { id: "settings", label: "설정", emoji: "⚙️" },
];

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <div className="bg-white border-t border-purple-100 px-2 pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:scale-95 ${
              activeTab === tab.id ? "text-purple-600" : "text-gray-400"
            }`}
          >
            <span className={`text-xl transition-transform ${activeTab === tab.id ? "scale-110" : ""}`}>
              {tab.emoji}
            </span>
            <span className={`text-xs font-medium ${activeTab === tab.id ? "text-purple-600" : "text-gray-400"}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-2 w-1 h-1 rounded-full bg-purple-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
