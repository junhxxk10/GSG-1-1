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
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  qaId?: string;
}

function buildInitialGreeting(displayName: string, unit: CurriculumUnit | null): string {
  const h = new Date().getHours();
  const time = h < 12 ? "좋은 아침이에요" : h < 18 ? "안녕하세요" : "좋은 저녁이에요";

  if (!unit) {
    return `${time}! **${displayName}님** 💪\n\n궁금한 것이 있으면 뭐든지 물어보세요!\n질문들은 자동으로 마인드맵에 저장돼요 🗺️\n\n위의 **단원 선택** 버튼을 눌러 현재 공부하는 단원을 설정하면 더 정확한 답변을 받을 수 있어요!`;
  }

  const subLabel = unit.category ? `${unit.subject} > ${unit.category} > ${unit.unit}` : `${unit.subject} > ${unit.unit}`;
  const keyConceptsText = unit.keyConcepts.slice(0, 3).map((c) => `==**${c}**==`).join(", ");

  return `${time}! **${displayName}님** 💪\n\n지금 **${subLabel}** 공부 중이군요!\n\n이 단원의 핵심 개념: ${keyConceptsText}\n\n어떤 부분이 헷갈리는지 바로 물어보세요. 마인드맵에 자동 저장돼요 🗺️`;
}

function formatContent(text: string) {
  return text.split("\n").map((line, i) => {
    const formatted = line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/==(.+?)==/g, '<mark style="background:#fff176;padding:0 2px;border-radius:3px;font-weight:500">$1</mark>');
    if (line.startsWith("• ")) {
      return (
        <li key={i} className="ml-4 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
      );
    }
    return (
      <p key={i} className="text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });
}

export default function ChatPage({ user, qaItems, currentUnit, onQAAdded, onUnitChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevUnitRef = useRef<CurriculumUnit | null>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: buildInitialGreeting(user.displayName, currentUnit),
      timestamp: new Date().toISOString(),
    }]);
    prevUnitRef.current = currentUnit;
    isFirstMount.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Context switch message when unit changes after initial load
  useEffect(() => {
    if (isFirstMount.current) return;
    const prevUnit = prevUnitRef.current;
    if (prevUnit?.id === currentUnit?.id) return;

    prevUnitRef.current = currentUnit;

    if (currentUnit) {
      const subLabel = currentUnit.category
        ? `${currentUnit.subject} > ${currentUnit.category} > ${currentUnit.unit}`
        : `${currentUnit.subject} > ${currentUnit.unit}`;
      const keyConceptsText = currentUnit.keyConcepts.slice(0, 3).map((c) => `==**${c}**==`).join(", ");

      setMessages((prev) => [
        ...prev,
        {
          id: `ctx-${Date.now()}`,
          role: "system",
          content: `📖 단원 변경: **${subLabel}**\n\n핵심 개념: ${keyConceptsText}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [currentUnit]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: question, timestamp: new Date().toISOString() },
    ]);
    setLoading(true);

    try {
      const answer = await askClaude(question, currentUnit, qaItems.slice(-3));
      const qaItem = createQAItem(question, answer, currentUnit, qaItems);
      storage.addQAItem(qaItem);
      onQAAdded(qaItem);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: answer, timestamp: new Date().toISOString(), qaId: qaItem.id },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "assistant", content: "죄송해요, 오류가 발생했어요. 다시 시도해볼게요!", timestamp: new Date().toISOString() },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const toggleSubject = (subject: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      next.has(subject) ? next.delete(subject) : next.add(subject);
      return next;
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

      {/* Unit selector — accordion */}
      {showUnitSelector && (
        <div className="bg-white border-b border-purple-100 shadow-soft max-h-72 overflow-y-auto">
          <div className="p-3 space-y-1">
            <p className="text-xs font-semibold text-gray-400 mb-2">과목을 눌러 단원 목록을 펼쳐보세요</p>
            {allSubjects.map((subject) => {
              const units = CURRICULUM_DATA[subject];
              const hasCategories = units.some((u) => u.category);
              const isExpanded = expandedSubjects.has(subject);

              return (
                <div key={subject}>
                  {/* Subject header — clickable */}
                  <button
                    onClick={() => toggleSubject(subject)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-pastel-lavender active:scale-[0.98] transition-all"
                  >
                    <span className="text-sm font-bold text-purple-700">{subject}</span>
                    <span className="text-purple-400 text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </button>

                  {/* Unit list */}
                  {isExpanded && (
                    <div className="mt-1 ml-2 space-y-1 pb-1">
                      {hasCategories ? (
                        (() => {
                          const categories = Array.from(new Set(units.map((u) => u.category).filter(Boolean))) as string[];
                          return categories.map((cat) => (
                            <div key={cat} className="mb-2">
                              <p className="text-xs font-semibold text-gray-400 px-2 py-1">▸ {cat}</p>
                              {units.filter((u) => u.category === cat).map((unit) => (
                                <button
                                  key={unit.id}
                                  onClick={() => { onUnitChange(unit); storage.setCurrentUnit(unit); setShowUnitSelector(false); }}
                                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-[0.98] mb-0.5 ${
                                    currentUnit?.id === unit.id ? "bg-purple-100 text-purple-700 font-semibold" : "bg-gray-50 text-gray-600 hover:bg-purple-50"
                                  }`}
                                >
                                  {unit.unit}
                                </button>
                              ))}
                            </div>
                          ));
                        })()
                      ) : (
                        <button
                          onClick={() => { onUnitChange(units[0]); storage.setCurrentUnit(units[0]); setShowUnitSelector(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all active:scale-[0.98] ${
                            currentUnit?.id === units[0].id ? "bg-purple-100 text-purple-700 font-semibold" : "bg-gray-50 text-gray-600 hover:bg-purple-50"
                          }`}
                        >
                          {subject} (공통)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          if (msg.role === "system") {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-pastel-blue rounded-2xl px-4 py-2 max-w-[85%]">
                  <div className="text-blue-600 space-y-0.5">{formatContent(msg.content)}</div>
                </div>
              </div>
            );
          }
          return (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <span className="text-white text-xs">AI</span>
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-tr-sm"
                  : "bg-white shadow-soft rounded-tl-sm"
              }`}>
                {msg.role === "user" ? (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="text-gray-700 space-y-1">{formatContent(msg.content)}</div>
                )}
                <p className={`text-xs mt-1 ${msg.role === "user" ? "text-purple-200 text-right" : "text-gray-300"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mr-2 mt-1">
              <span className="text-white text-xs">AI</span>
            </div>
            <div className="bg-white shadow-soft rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex space-x-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
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
          <p className="text-xs text-gray-400 mb-2">💡 {currentUnit.unit} 예시 질문</p>
          <div className="flex flex-wrap gap-2">
            {currentUnit.keyPoints.slice(0, 3).map((point, i) => (
              <button key={i}
                onClick={() => { setInput(`${point}에 대해 설명해줘`); inputRef.current?.focus(); }}
                className="px-3 py-1.5 rounded-xl bg-pastel-purple text-purple-600 text-xs font-medium active:scale-95 transition-all">
                {point}?
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
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
          <button onClick={handleSend} disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
