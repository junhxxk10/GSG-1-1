import React, { useState } from "react";
import { QAItem, CurriculumUnit, User } from "../types";
import QADetailModal from "./QADetailModal";
import { storage } from "../store/appStore";

interface Props {
  user: User;
  qaItems: QAItem[];
  currentUnit: CurriculumUnit | null;
  onNavigateToChat: () => void;
  onNavigateToMindmap: () => void;
  onQAUpdated: (id: string, updates: Partial<QAItem>) => void;
}

export default function HomePage({ user, qaItems, currentUnit, onNavigateToChat, onNavigateToMindmap, onQAUpdated }: Props) {
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null);

  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? "밤새 공부하셨군요" :
    hour < 12 ? "좋은 아침이에요" :
    hour < 18 ? "오늘도 열심히" : "좋은 저녁이에요";

  const todayItems = qaItems.filter((qa) => {
    const qaDate = new Date(qa.timestamp).toDateString();
    const today = new Date().toDateString();
    return qaDate === today;
  });

  const bookmarked = qaItems.filter((qa) => qa.isBookmarked);
  const recentItems = [...qaItems].reverse().slice(0, 5);

  const handleBookmarkToggle = (id: string) => {
    const item = qaItems.find((qa) => qa.id === id);
    if (item) {
      const updates = { isBookmarked: !item.isBookmarked };
      storage.updateQAItem(id, updates);
      onQAUpdated(id, updates);
      if (selectedQA?.id === id) {
        setSelectedQA({ ...selectedQA, ...updates });
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-pastel-lavender/40 to-white">
      <div className="px-4 pt-6 pb-8 space-y-5">
        {/* Greeting card */}
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl p-5 text-white shadow-float">
          <p className="text-sm font-light opacity-80">{greeting}! ☀️</p>
          <h2 className="text-2xl font-bold mt-1">{user.displayName}님</h2>
          {currentUnit ? (
            <div className="mt-3 bg-white/20 rounded-2xl px-3 py-2 inline-flex items-center gap-2">
              <span className="text-xs">📖</span>
              <span className="text-xs font-medium">{currentUnit.subject} · {currentUnit.unit}</span>
            </div>
          ) : (
            <p className="text-xs opacity-70 mt-2">공부할 단원을 선택해보세요</p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "전체 질문", value: qaItems.length, color: "bg-pastel-purple", text: "text-purple-600", emoji: "💬" },
            { label: "오늘 질문", value: todayItems.length, color: "bg-pastel-mint", text: "text-teal-600", emoji: "✨" },
            { label: "즐겨찾기", value: bookmarked.length, color: "bg-pastel-yellow", text: "text-amber-600", emoji: "⭐" },
          ].map(({ label, value, color, text, emoji }) => (
            <div key={label} className={`${color} rounded-2xl p-3 text-center`}>
              <div className="text-xl mb-1">{emoji}</div>
              <p className={`text-xl font-bold ${text}`}>{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onNavigateToChat}
            className="bg-white rounded-2xl p-4 shadow-soft text-left active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-pastel-purple flex items-center justify-center mb-3">
              <span className="text-xl">💬</span>
            </div>
            <p className="font-semibold text-gray-700 text-sm">질문하기</p>
            <p className="text-xs text-gray-400 mt-0.5">AI에게 궁금한 것 물어보기</p>
          </button>
          <button
            onClick={onNavigateToMindmap}
            className="bg-white rounded-2xl p-4 shadow-soft text-left active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-pastel-mint flex items-center justify-center mb-3">
              <span className="text-xl">🗺️</span>
            </div>
            <p className="font-semibold text-gray-700 text-sm">마인드맵</p>
            <p className="text-xs text-gray-400 mt-0.5">질문 연결 지도 보기</p>
          </button>
        </div>

        {/* Current unit key points */}
        {currentUnit && (
          <div className="bg-white rounded-2xl shadow-soft p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-700 text-sm">📌 단원 핵심 포인트</p>
              <span className="text-xs text-purple-400">{currentUnit.unit}</span>
            </div>
            <div className="space-y-2">
              {currentUnit.keyPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-300 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 mb-2">핵심 개념</p>
              <div className="flex flex-wrap gap-1.5">
                {currentUnit.keyConcepts.map((c, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-pastel-lavender text-purple-600 text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Q&A */}
        {recentItems.length > 0 && (
          <div>
            <p className="font-semibold text-gray-700 text-sm mb-3">최근 질문들</p>
            <div className="space-y-2">
              {recentItems.map((qa) => (
                <button
                  key={qa.id}
                  onClick={() => setSelectedQA(qa)}
                  className="w-full bg-white rounded-2xl p-4 shadow-soft text-left active:scale-[0.98] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-sm font-medium text-gray-700 truncate">{qa.question}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{qa.answer.slice(0, 60)}...</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {qa.isBookmarked && <span className="text-sm">⭐</span>}
                      {qa.subject && (
                        <span className="px-2 py-0.5 rounded-lg bg-pastel-purple text-purple-600 text-xs">
                          {qa.subject}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(qa.timestamp).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {qaItems.length === 0 && (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">💡</div>
            <p className="text-gray-400 text-sm">아직 질문이 없어요</p>
            <p className="text-gray-300 text-xs mt-1">AI에게 첫 질문을 해보세요!</p>
          </div>
        )}
      </div>

      {selectedQA && (
        <QADetailModal
          qa={selectedQA}
          onClose={() => setSelectedQA(null)}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}
    </div>
  );
}
