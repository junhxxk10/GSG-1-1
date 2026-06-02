import React, { useState, useEffect } from "react";
import { User, QAItem, CurriculumUnit, FilterSettings, TabType } from "./types";
import { storage } from "./store/appStore";
import WelcomeScreen from "./components/WelcomeScreen";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import MindMapPage from "./components/MindMapPage";
import SettingsPage from "./components/SettingsPage";
import BottomNav from "./components/BottomNav";
import "./index.css";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [qaItems, setQAItems] = useState<QAItem[]>([]);
  const [currentUnit, setCurrentUnit] = useState<CurriculumUnit | null>(null);
  const [filter, setFilter] = useState<FilterSettings>({ viewMode: "all", showAnswers: true });
  const [activeTab, setActiveTab] = useState<TabType>("home");

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) setUser(savedUser);

    const savedQAs = storage.getQAItems();
    setQAItems(savedQAs);

    const savedUnit = storage.getCurrentUnit();
    if (savedUnit) setCurrentUnit(savedUnit);

    const savedFilter = storage.getFilter();
    setFilter(savedFilter);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    const savedQAs = storage.getQAItems();
    setQAItems(savedQAs);
    const savedUnit = storage.getCurrentUnit();
    if (savedUnit) setCurrentUnit(savedUnit);
  };

  const handleLogout = () => {
    storage.clearUser();
    setUser(null);
    setQAItems([]);
    setCurrentUnit(null);
    setActiveTab("home");
  };

  const handleQAAdded = (item: QAItem) => {
    setQAItems((prev) => [...prev, item]);
  };

  const handleQAUpdated = (id: string, updates: Partial<QAItem>) => {
    setQAItems((prev) =>
      prev.map((qa) => (qa.id === id ? { ...qa, ...updates } : qa))
    );
  };

  const handleClearAll = () => {
    storage.setQAItems([]);
    setQAItems([]);
  };

  if (!user) {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {activeTab === "home" && (
          <HomePage
            user={user}
            qaItems={qaItems}
            currentUnit={currentUnit}
            onNavigateToChat={() => setActiveTab("chat")}
            onNavigateToMindmap={() => setActiveTab("mindmap")}
            onQAUpdated={handleQAUpdated}
          />
        )}
        {activeTab === "chat" && (
          <ChatPage
            user={user}
            qaItems={qaItems}
            currentUnit={currentUnit}
            onQAAdded={handleQAAdded}
            onUnitChange={setCurrentUnit}
          />
        )}
        {activeTab === "mindmap" && (
          <MindMapPage
            qaItems={qaItems}
            currentUnit={currentUnit}
            filter={filter}
          />
        )}
        {activeTab === "settings" && (
          <SettingsPage
            user={user}
            filter={filter}
            currentUnit={currentUnit}
            qaItems={qaItems}
            onFilterChange={setFilter}
            onUnitChange={setCurrentUnit}
            onLogout={handleLogout}
            onClearAll={handleClearAll}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
