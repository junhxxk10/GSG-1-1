import React, { useState } from "react";
import { User, FilterSettings, CurriculumUnit, QAItem } from "../types";
import { storage, CURRICULUM_DATA } from "../store/appStore";

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

export default function SettingsPage({
  user, filter, currentUnit, qaItems,
  onFilterChange, onUnitChange, onLogout, onClearAll
}: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("studymap_api_key") || "");
  const [apiSaved, setApiSaved] = useState(false);

  const saveApiKey = () => {
    localStorage.setItem("studymap_api_key", apiKey);
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2000);
  };

  const viewModes: { value: FilterSettings["viewMode"]; label: string; desc: string; emoji: string }[] = [
    { value: "all", label: "전체 보기", desc: "모든 질문을 마인드맵에 표시", emoji: "🌐" },
    { value: "unit", label: "단원별 보기", desc: "현재 단원 Q&A만 표시", emoji: "📖" },
    { value: "my-qa", label: "내 Q&A", desc: "즐겨찾기한 질문만 표시", emoji: "⭐" },
  ];

  const allSubjects = Object.keys(CURRICULUM_DATA);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-pastel-lavender/30 to-white">
      <div className="px-4 pt-6 pb-8 space-y-5">
        {/* Profile card */}
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                {user.displayName[0]}
              </span>
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
              <p className="text-xl font-bold text-amber-500">{qaItems.filter(q => q.isBookmarked).length}</p>
              <p className="text-xs text-gray-400">즐겨찾기</p>
            </div>
          </div>
        </div>

        {/* View mode filter */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-semibold text-gray-700 text-sm mb-3">🗺️ 마인드맵 보기 설정</p>
          <div className="space-y-2">
            {viewModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => {
                  const newFilter = { ...filter, viewMode: mode.value };
                  onFilterChange(newFilter);
                  storage.setFilter(newFilter);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] ${
                  filter.viewMode === mode.value
                    ? "bg-pastel-purple border-2 border-pastel-purple-deep"
                    : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <span className="text-lg flex-shrink-0">{mode.emoji}</span>
                <div className="text-left">
                  <p className={`text-sm font-medium ${filter.viewMode === mode.value ? "text-purple-700" : "text-gray-600"}`}>
                    {mode.label}
                  </p>
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

        {/* Current study unit */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-semibold text-gray-700 text-sm mb-3">📚 현재 학습 단원</p>
          {currentUnit ? (
            <div className="bg-pastel-blue rounded-xl p-3 mb-3">
              <p className="font-medium text-blue-700 text-sm">{currentUnit.unit}</p>
              <p className="text-xs text-blue-400">{currentUnit.subject} · {currentUnit.grade} · {currentUnit.chapter}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-sm text-gray-400">단원이 선택되지 않았어요</p>
            </div>
          )}

          <div className="space-y-3 max-h-48 overflow-y-auto">
            {allSubjects.map((subject) => (
              <div key={subject}>
                <p className="text-xs font-bold text-purple-500 mb-1">{subject}</p>
                <div className="space-y-1">
                  {CURRICULUM_DATA[subject].map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => {
                        onUnitChange(unit);
                        storage.setCurrentUnit(unit);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-[0.98] ${
                        currentUnit?.id === unit.id
                          ? "bg-purple-100 text-purple-700 font-semibold"
                          : "bg-gray-50 text-gray-500 hover:bg-purple-50"
                      }`}
                    >
                      {unit.grade} · {unit.chapter} · {unit.unit}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {currentUnit && (
            <button
              onClick={() => {
                onUnitChange(null);
                storage.setCurrentUnit(null);
              }}
              className="w-full mt-2 py-2 rounded-xl bg-gray-100 text-gray-400 text-xs active:scale-95"
            >
              단원 선택 해제
            </button>
          )}
        </div>

        {/* API Key setting */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-semibold text-gray-700 text-sm mb-1">🔑 Claude API 키 설정</p>
          <p className="text-xs text-gray-400 mb-3">API 키를 설정하면 실제 AI 답변을 받을 수 있어요</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 px-3 py-2 rounded-xl bg-pastel-lavender text-xs text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              onClick={saveApiKey}
              className="px-3 py-2 rounded-xl bg-purple-500 text-white text-xs font-medium active:scale-95 transition-all"
            >
              {apiSaved ? "저장됨 ✓" : "저장"}
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-semibold text-gray-700 text-sm mb-3">⚙️ 계정 관리</p>
          <div className="space-y-2">
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-3 rounded-xl bg-red-50 text-red-400 text-sm font-medium active:scale-95 transition-all"
              >
                전체 질문 삭제
              </button>
            ) : (
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-sm text-red-500 font-medium mb-2">정말 삭제하시겠어요? 복구할 수 없어요.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowClearConfirm(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-red-400 text-white text-sm font-medium active:scale-95"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-500 text-sm font-medium active:scale-95"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium active:scale-95 transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300">StudyMap v1.0 · Made with ❤️</p>
      </div>
    </div>
  );
}
