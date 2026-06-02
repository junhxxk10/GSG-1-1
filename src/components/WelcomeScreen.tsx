import React, { useState } from "react";
import { User } from "../types";
import { storage } from "../store/appStore";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onLogin: (user: User) => void;
}

type Mode = "welcome" | "login" | "signup";

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 6) return `${name}님, 밤늦게도 공부하시네요 🌙`;
  if (hour < 12) return `안녕하세요 ${name}님\n좋은 아침이에요 ☀️`;
  if (hour < 18) return `${name}님, 오늘도 열심히! 🌤`;
  return `${name}님, 저녁 공부 파이팅이에요 🌙`;
}

export default function WelcomeScreen({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>("welcome");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupPw, setSignupPw] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const DEMO_USER: User = {
    id: "demo-001",
    username: "junhxxk",
    email: "junhxxk@studymap.app",
    displayName: "준혁",
    createdAt: new Date().toISOString(),
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));

    const existing = storage.getUser();
    if (loginId === "junhxxk" && loginPw === "1234") {
      const user = { ...DEMO_USER };
      storage.setUser(user);
      onLogin(user);
    } else if (existing && existing.username === loginId) {
      onLogin(existing);
    } else if (loginId && loginPw) {
      setError("아이디 또는 비밀번호가 맞지 않아요.");
    } else {
      setError("아이디와 비밀번호를 입력해주세요.");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));

    if (!signupId || !signupPw || !signupName) {
      setError("모든 항목을 입력해주세요.");
      setLoading(false);
      return;
    }

    const user: User = {
      id: uuidv4(),
      username: signupId,
      email: signupEmail || `${signupId}@studymap.app`,
      displayName: signupName,
      createdAt: new Date().toISOString(),
    };
    storage.setUser(user);
    onLogin(user);
    setLoading(false);
  };

  const demoLogin = () => {
    storage.setUser(DEMO_USER);
    onLogin(DEMO_USER);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lavender via-white to-pastel-mint flex flex-col items-center justify-center px-6">
      {/* Logo area */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-pastel-purple-deep to-purple-400 flex items-center justify-center shadow-float">
          <span className="text-3xl">🗺️</span>
        </div>
        <h1 className="text-2xl font-bold text-purple-800 tracking-tight">StudyMap</h1>
        <p className="text-sm text-purple-400 mt-1">나만의 공부 마인드맵</p>
      </div>

      {mode === "welcome" && (
        <div className="w-full max-w-sm">
          {/* Greeting card */}
          <div className="bg-white rounded-3xl shadow-card p-6 mb-6 text-center">
            <p className="text-lg font-semibold text-purple-800 whitespace-pre-line leading-relaxed">
              {getGreeting("준혁")}
            </p>
            <p className="text-sm text-gray-400 mt-2">질문하고, 연결하고, 성장하세요</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setMode("login")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold text-base shadow-soft active:scale-95 transition-all"
            >
              로그인
            </button>
            <button
              onClick={() => setMode("signup")}
              className="w-full py-4 rounded-2xl bg-white border-2 border-pastel-purple-deep text-purple-600 font-semibold text-base active:scale-95 transition-all"
            >
              회원가입
            </button>
            <button
              onClick={demoLogin}
              className="w-full py-3 rounded-2xl bg-pastel-mint text-teal-600 font-medium text-sm active:scale-95 transition-all"
            >
              체험해보기 (데모)
            </button>
          </div>
        </div>
      )}

      {mode === "login" && (
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">로그인</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">아이디</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-pastel-lavender border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  placeholder="아이디를 입력하세요"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">비밀번호</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl bg-pastel-lavender border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  placeholder="비밀번호를 입력하세요"
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold disabled:opacity-60 active:scale-95 transition-all mt-2"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-4">
              테스트 계정: junhxxk / 1234
            </p>
          </div>
          <button onClick={() => setMode("welcome")} className="w-full mt-3 py-2 text-sm text-purple-400 active:scale-95">
            ← 뒤로
          </button>
        </div>
      )}

      {mode === "signup" && (
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">회원가입</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">이름 (닉네임)</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-pastel-lavender border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  placeholder="이름을 입력하세요"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">아이디</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-pastel-lavender border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  placeholder="사용할 아이디"
                  value={signupId}
                  onChange={(e) => setSignupId(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">이메일 (선택)</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-pastel-lavender border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  placeholder="이메일 주소"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">비밀번호</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl bg-pastel-lavender border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  placeholder="비밀번호"
                  value={signupPw}
                  onChange={(e) => setSignupPw(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold disabled:opacity-60 active:scale-95 transition-all mt-2"
              >
                {loading ? "가입 중..." : "가입하기"}
              </button>
            </form>
          </div>
          <button onClick={() => setMode("welcome")} className="w-full mt-3 py-2 text-sm text-purple-400 active:scale-95">
            ← 뒤로
          </button>
        </div>
      )}
    </div>
  );
}
