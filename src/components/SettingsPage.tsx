import React, { useState } from "react";
import { User, FilterSettings, CurriculumUnit, QAItem } from "../types";
import { storage, CURRICULUM_DATA } from "../store/appStore";
import { AIProvider, AI_MODELS, getAISettings, saveAISettings } from "../utils/aiService";

interface Props {
  user: User;
  filter: FilterSettings;
  currentUnit: CurriculumUnit | null;
  qaItems: QAItem[];
  onFilterChange: (filter: FilterSettings) => void;
  onUnitChange: (unit: CurriculumUnit | null) => void;
  onLogout: () => void;
  onClearAll: () => void;
}

const PROVIDER_INFO: Record<AIProvider, { label: string; color: string; bg: string; placeholder: string; docsUrl: string }> = {
  claude: { label: "Claude", color: "text-purple-700", bg: "bg-pastel-purple", placeholder: "sk-ant-api03-...", docsUrl: "https://console.anthropic.com" },
  openai: { label: "OpenAI", color: "text-green-700", bg: "bg-green-50", placeholder: "sk-proj-...", docsUrl: "https://platform.openai.com" },
  gemini: { label: "Gemini", color: "text-blue-700", bg: "bg-blue-50", placeholder: "AIza...", docsUrl: "https://aistudio.google.com" },
};

export default function SettingsPage({ user, filter, currentUnit, qaItems, onFilterChange, onUnitChange, onLogout, onClearAll }: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  const aiSettings = getAISettings();
  const [provider, setProvider] = useState<AIProvider>(aiSettings.provider);
  const [claudeKey, setClaudeKey] = useState(aiSettings.claudeKey);
  const [openaiKey, setOpenaiKey] = useState(aiSettings.openaiKey);
  const [openaiModel, setOpenaiModel] = useState(aiSettings.openaiModel);
  const [geminiKey, setGeminiKey] = useState(aiSettings.geminiKey);
  const [geminiModel, setGeminiModel] = useState(aiSettings.geminiModel);

  const toggleSubject = (subject: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      next.has(subject) ? next.delete(subject) : next.add(subject);
      return next;
    });
  };

  const handleSaveAI = () => {
    saveAISettings({ provider, claudeKey, openaiKey, openaiModel, geminiKey, geminiModel });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const allSubjects = Object.keys(CURRICULUM_DATA);
  const viewModes: { value: FilterSettings["viewMode"]; label: string; desc: string; emoji: string }[] = [
    { value: "all", label: "전체 보기", desc: "모든 질문을 마인드맵에 표시", emoji: "🌐" },
    { value: "unit", label: "단원별 보기", desc: "현재 단원 Q&A만 표시", emoji: "📖" },
    { value: "my-qa", label: "즐겨찾기만", desc: "즐겨찾기한 질문만 표시", emoji: "⭐" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-pastel-lavender/30 to-white">
      <div className="px-4 pt-6 pb-8 space-y-5 max-w-2xl md:mx-auto">

        {/* Profile */}
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">{user.displayName[0]}</span>
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{user.displayName}</p>
              <p className="text-sm text-gray-400">@{user.username}</p>
              {user.email && <p className="text-xs text-purple-400 mt-0.5">{user.email}</p>}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{qaItems.length}</p>
              <p className="text-xs text-gray-400">전체 질문</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-amber-500">{qaItems.filter((q) => q.isBookmarked).length}</p>
              <p className="text-xs text-gray-400">즐겨찾기</p>
            </div>
          </div>
        </div>

        {/* AI Provider Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-semibold text-gray-700 text-sm mb-3">🤖 AI 설정</p>

          {/* Provider selector */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(["claude", "openai", "gemini"] as AIProvider[]).map((p) => {
              const info = PROVIDER_INFO[p];
              return (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                    provider === p ? `${info.bg} ${info.color} ring-2 ring-offset-1 ring-current` : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {info.label}
                </button>
              );
            })}
          </div>

          {/* Claude settings */}
          {provider === "claude" && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-medium">API 키 (Anthropic Console)</label>
              <input
                type="password"
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder={PROVIDER_INFO.claude.placeholder}
                className="w-full px-3 py-2.5 rounded-xl bg-pastel-lavender text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <p className="text-xs text-gray-400">모델: claude-sonnet-4-6 (고정)</p>
            </div>
          )}

          {/* OpenAI settings */}
          {provider === "openai" && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-medium">API 키 (OpenAI Platform)</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder={PROVIDER_INFO.openai.placeholder}
                className="w-full px-3 py-2.5 rounded-xl bg-green-50 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              <label className="text-xs text-gray-500 font-medium">모델</label>
              <select
                value={openaiModel}
                onChange={(e) => setOpenaiModel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-green-50 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                {AI_MODELS.openai.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          {/* Gemini settings */}
          {provider === "gemini" && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-medium">API 키 (Google AI Studio)</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder={PROVIDER_INFO.gemini.placeholder}
                className="w-full px-3 py-2.5 rounded-xl bg-blue-50 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <label className="text-xs text-gray-500 font-medium">모델</label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-blue-50 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {AI_MODELS.gemini.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          <button
            onClick={handleSaveAI}
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-semibold active:scale-95 transition-all"
          >
            {saved ? "저장됨 ✓" : "AI 설정 저장"}
          </button>
        </div>

        {/* Mindmap view mode */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-semibold text-gray-700 text-sm mb-3">🗺️ 마인드맵 보기 설정</p>
          <div className="space-y-2">
            {viewModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onFilterChange({ ...filter, viewMode: mode.value })}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] ${
                  filter.viewMode === mode.value
                    ? "bg-pastel-purple border-2 border-pastel-purple-deep"
                    : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <span className="text-lg flex-shrink-0">{mode.emoji}</span>
                <div className="text-left">
                  <p className={`text-sm font-medium ${filter.viewMode === mode.value ? "text-purple-700" : "text-gray-600"}`}>{mode.label}</p>
                  <p className="text-xs text-gray-400">{mode.desc}</p>
                </div>
                {filter.viewMode === mode.value && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Unit selector */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-semibold text-gray-700 text-sm mb-3">📚 현재 학습 단원</p>

          {currentUnit ? (
            <div className="bg-pastel-blue rounded-xl p-3 mb-3">
              <p className="font-medium text-blue-700 text-sm">{currentUnit.unit}</p>
              <p className="text-xs text-blue-400">
                {currentUnit.subject}{currentUnit.category ? ` > ${currentUnit.category}` : ""} · {currentUnit.grade}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-sm text-gray-400">단원이 선택되지 않았어요</p>
            </div>
          )}

          {/* Accordion unit list */}
          <div className="space-y-1.5">
            {allSubjects.map((subject) => {
              const units = CURRICULUM_DATA[subject];
              const hasCategories = units.some((u) => u.category);
              const isExpanded = expandedSubjects.has(subject);

              return (
                <div key={subject}>
                  <button
                    onClick={() => toggleSubject(subject)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-pastel-lavender active:scale-[0.98] transition-all"
                  >
                    <span className="text-sm font-bold text-purple-700">{subject}</span>
                    <span className="text-purple-400 text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-1 ml-2 max-h-64 overflow-y-auto rounded-xl">
                      {hasCategories ? (
                        (() => {
                          const cats = Array.from(new Set(units.map((u) => u.category).filter(Boolean))) as string[];
                          return cats.map((cat) => (
                            <div key={cat} className="mb-2">
                              <p className="text-xs font-semibold text-gray-400 px-2 py-1 sticky top-0 bg-white">▸ {cat}</p>
                              {units.filter((u) => u.category === cat).map((unit) => (
                                <button key={unit.id}
                                  onClick={() => { onUnitChange(unit); storage.setCurrentUnit(unit); }}
                                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-[0.98] mb-0.5 ${
                                    currentUnit?.id === unit.id ? "bg-purple-100 text-purple-700 font-semibold" : "bg-gray-50 text-gray-500 hover:bg-purple-50"
                                  }`}>
                                  {unit.unit}
                                </button>
                              ))}
                            </div>
                          ));
                        })()
                      ) : (
                        units.map((unit) => (
                          <button key={unit.id}
                            onClick={() => { onUnitChange(unit); storage.setCurrentUnit(unit); }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-[0.98] mb-0.5 ${
                              currentUnit?.id === unit.id ? "bg-purple-100 text-purple-700 font-semibold" : "bg-gray-50 text-gray-500 hover:bg-purple-50"
                            }`}>
                            {unit.unit}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {currentUnit && (
            <button
              onClick={() => { onUnitChange(null); storage.setCurrentUnit(null); }}
              className="w-full mt-2 py-2 rounded-xl bg-gray-100 text-gray-400 text-xs active:scale-95"
            >
              단원 선택 해제
            </button>
          )}
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-semibold text-gray-700 text-sm mb-3">⚙️ 계정 관리</p>
          <div className="space-y-2">
            {!showClearConfirm ? (
              <button onClick={() => setShowClearConfirm(true)}
                className="w-full py-3 rounded-xl bg-red-50 text-red-400 text-sm font-medium active:scale-95 transition-all">
                전체 질문 삭제
              </button>
            ) : (
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-sm text-red-500 font-medium mb-2">정말 삭제하시겠어요? 복구 불가해요.</p>
                <div className="flex gap-2">
                  <button onClick={() => { onClearAll(); setShowClearConfirm(false); }}
                    className="flex-1 py-2 rounded-xl bg-red-400 text-white text-sm font-medium active:scale-95">삭제</button>
                  <button onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-500 text-sm font-medium active:scale-95">취소</button>
                </div>
              </div>
            )}
            <button onClick={onLogout}
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium active:scale-95 transition-all">
              로그아웃
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300">StudyMap v1.1 · Made with ❤️</p>
      </div>
    </div>
  );
}
