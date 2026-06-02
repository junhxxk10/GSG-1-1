import React from "react";
import { TabType } from "../types";

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  userName: string;
  qaCount: number;
}

const tabs: { id: TabType; label: string; emoji: string }[] = [
  { id: "home", label: "홈", emoji: "🏠" },
  { id: "chat", label: "질문하기", emoji: "💬" },
  { id: "mindmap", label: "마인드맵", emoji: "🗺️" },
  { id: "settings", label: "설정", emoji: "⚙️" },
];

export default function SidebarNav({ activeTab, onTabChange, userName, qaCount }: Props) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-purple-100">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-soft">
            <span className="text-xl">🗺️</span>
          </div>
          <div>
            <p className="font-bold text-purple-800 text-base leading-tight">StudyMap</p>
            <p className="text-xs text-purple-400">나만의 공부 지도</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left group ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <span className={`text-xl transition-transform ${activeTab === tab.id ? "scale-110" : "group-hover:scale-105"}`}>
              {tab.emoji}
            </span>
            <span className={`text-sm ${activeTab === tab.id ? "font-semibold" : "font-medium"}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="ml-auto w-1.5 h-5 rounded-full bg-purple-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Stats */}
      <div className="px-4 py-3 mx-3 mb-3 rounded-2xl bg-pastel-lavender">
        <p className="text-xs text-purple-500 font-medium">누적 질문</p>
        <p className="text-2xl font-bold text-purple-700">{qaCount}</p>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">{userName[0]}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">{userName}</p>
            <p className="text-xs text-gray-400">학습 중 ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
}
