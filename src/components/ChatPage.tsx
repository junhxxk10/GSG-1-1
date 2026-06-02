import React, { useState, useRef, useEffect } from "react";
import { QAItem, CurriculumUnit, User } from "../types";
import { askClaude, createQAItem } from "../utils/aiService";
import { storage, CURRICULUM_DATA } from "../store/appStore";

interface Props {
  user: User;
  qaItems: QAItem[];
  currentUnit: CurriculumUnit | null;
  onQAAdded: (item: QAItem) => void;
  onUnitChange: (unit: CurriculumUnit) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  qaId?: string;
}

export default function ChatPage({ user, qaItems, currentUnit, onQAAdded, onUnitChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const greetHour = new Date().getHours();
      const greeting =
        greetHour < 12 ? "좋은 아침이에요!" : greetHour < 18 ? "안녕하세요!" : "좋은 저녁이에요!";
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `${greeting} **${user.displayName}님**, 오늘도 공부 열심히 화이팅! 💪\n\n궁금한 것이 있으면 뭐든지 물어보세요. 질문들은 자동으로 마인드맵에 저장돼요 🗺️\n\n${currentUnit ? `현재 단원: **${currentUnit.subject} - ${currentUnit.unit}**` : "아래 단원 선택 버튼을 눌러 현재 공부하는 단원을 설정해보세요!"}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.displayName, currentUnit]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const answer = await askClaude(question, currentUnit, qaItems.slice(-3));
      const qaItem = createQAItem(question, answer, currentUnit, qaItems);
      storage.addQAItem(qaItem);
      onQAAdded(qaItem);

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: answer,
        timestamp: new Date().toISOString(),
        qaId: qaItem.id,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "죄송해요, 답변을 불러오는 중에 오류가 발생했어요. 다시 시도해볼게요!",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/==(.+?)==/g, '<mark style="background:#fff176;padding:0 2px;border-radius:3px;font-weight:500">$1</mark>');
      if (line.startsWith("• ")) {
        return (
          <li
            key={i}
            className="ml-4 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted.slice(2) }}
          />
        );
      }
      return (
        <p
          key={i}
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  const allSubjects = Object.keys(CURRICULUM_DATA);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pastel-lavender/30 to-white">
      {/* Header */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur border-b border-purple-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800">AI 질문하기</h2>
          {currentUnit && (
            <p className="text-xs text-purple-400">
              {currentUnit.subject}{currentUnit.category ? ` > ${currentUnit.category}` : ""} · {currentUnit.unit}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowUnitSelector(!showUnitSelector)}
          className="px-3 py-1.5 rounded-xl bg-pastel-purple text-purple-600 text-xs font-medium active:scale-95 transition-all"
        >
          {currentUnit ? "단원 변경" : "단원 선택"}
        </button>
      </div>

      {/* Unit selector dropdown */}
      {showUnitSelector && (
        <div className="bg-white border-b border-purple-100 shadow-soft max-h-72 overflow-y-auto">
          <div className="p-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">공부하는 단원 선택</p>
            {allSubjects.map((subject) => {
              const units = CURRICULUM_DATA[subject];
              const hasCategories = units.some((u) => u.category);
              if (hasCategories) {
                const categories = Array.from(new Set(units.map((u) => u.category).filter(Boolean))) as string[];
                return (
                  <div key={subject} className="mb-3">
                    <p className="text-xs font-bold text-purple-600 mb-1">{subject}</p>
                    {categories.map((cat) => (
                      <div key={cat} className="mb-2 ml-2">
                        <p className="text-xs font-semibold text-gray-400 mb-1">▸ {cat}</p>
                        <div className="space-y-1">
                          {units.filter((u) => u.category === cat).map((unit) => (
                            <button
                              key={unit.id}
                              onClick={() => { onUnitChange(unit); storage.setCurrentUnit(unit); setShowUnitSelector(false); }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-98 ${
                                currentUnit?.id === unit.id ? "bg-purple-100 text-purple-700 font-medium" : "bg-gray-50 text-gray-600 hover:bg-purple-50"
                              }`}
                            >
                              {unit.unit}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <div key={subject} className="mb-2">
                  <button
                    onClick={() => { onUnitChange(units[0]); storage.setCurrentUnit(units[0]); setShowUnitSelector(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-98 ${
                      currentUnit?.id === units[0].id ? "bg-purple-100 text-purple-700 font-medium" : "bg-gray-50 text-gray-600 hover:bg-purple-50"
                    }`}
                  >
                    <span className="font-bold text-purple-500">{subject}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <span className="text-white text-xs">AI</span>
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-tr-sm"
                  : "bg-white shadow-soft rounded-tl-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              ) : (
                <div className="text-gray-700 space-y-1">{formatContent(msg.content)}</div>
              )}
              <p
                className={`text-xs mt-1 ${
                  msg.role === "user" ? "text-purple-200 text-right" : "text-gray-300"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mr-2 mt-1">
              <span className="text-white text-xs">AI</span>
            </div>
            <div className="bg-white shadow-soft rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex space-x-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick question chips */}
      {currentUnit && messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-400 mb-2">💡 {currentUnit.unit} 관련 질문 예시</p>
          <div className="flex flex-wrap gap-2">
            {currentUnit.keyPoints.slice(0, 3).map((point, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(`${point}에 대해 설명해줘`);
                  inputRef.current?.focus();
                }}
                className="px-3 py-1.5 rounded-xl bg-pastel-purple text-purple-600 text-xs font-medium active:scale-95 transition-all"
              >
                {point}?
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 pb-4 pt-2 bg-white/80 backdrop-blur border-t border-purple-100">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="궁금한 것을 물어보세요..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl bg-pastel-lavender border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none text-sm transition leading-relaxed"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all flex-shrink-0"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
