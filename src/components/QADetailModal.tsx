import React from "react";
import { QAItem } from "../types";
import { storage } from "../store/appStore";

interface Props {
  qa: QAItem;
  onClose: () => void;
  onBookmarkToggle?: (id: string) => void;
}

export default function QADetailModal({ qa, onClose, onBookmarkToggle }: Props) {
  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const boldFormatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/==(.+?)==/g, '<mark style="background:#fff176;padding:0 2px;border-radius:3px;font-weight:500">$1</mark>');
      if (line.startsWith("• ")) {
        return (
          <li
            key={i}
            className="ml-4 text-sm leading-relaxed text-gray-600"
            dangerouslySetInnerHTML={{ __html: boldFormatted.slice(2) }}
          />
        );
      }
      return (
        <p
          key={i}
          className="text-sm leading-relaxed text-gray-600"
          dangerouslySetInnerHTML={{ __html: boldFormatted }}
        />
      );
    });
  };

  const handleBookmark = () => {
    storage.updateQAItem(qa.id, { isBookmarked: !qa.isBookmarked });
    onBookmarkToggle?.(qa.id);
  };

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-float max-h-[85vh] flex flex-col">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex-1 mr-3">
            <div className="flex items-center gap-2 mb-1">
              {qa.subject && (
                <span className="px-2 py-0.5 rounded-lg bg-pastel-purple text-purple-600 text-xs font-medium">
                  {qa.subject}
                </span>
              )}
              <span className="text-xs text-gray-400">
                {new Date(qa.timestamp).toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className="w-8 h-8 rounded-full bg-pastel-yellow flex items-center justify-center active:scale-95 transition-all"
            >
              <span className="text-sm">{qa.isBookmarked ? "⭐" : "☆"}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:scale-95 transition-all text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Question */}
          <div className="bg-gradient-to-r from-pastel-purple to-pastel-lavender rounded-2xl p-4">
            <p className="text-xs font-semibold text-purple-400 mb-1">💬 질문</p>
            <p className="text-gray-800 font-medium text-sm leading-relaxed">{qa.question}</p>
          </div>

          {/* Answer */}
          <div className="bg-white rounded-2xl p-4 shadow-soft">
            <p className="text-xs font-semibold text-green-400 mb-2">✨ AI 답변</p>
            <div className="space-y-1">{formatContent(qa.answer)}</div>
          </div>

          {/* Tags */}
          {qa.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">🏷️ 관련 태그</p>
              <div className="flex flex-wrap gap-2">
                {qa.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-pastel-mint text-teal-600 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
