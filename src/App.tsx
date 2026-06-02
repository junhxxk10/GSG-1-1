import React, { useState, useEffect } from "react";
import { User, QAItem, CurriculumUnit, FilterSettings, TabType } from "./types";
import { storage } from "./store/appStore";
import WelcomeScreen from "./components/WelcomeScreen";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import MindMapPage from "./components/MindMapPage";
import SettingsPage from "./components/SettingsPage";
import BottomNav from "./components/BottomNav";
import SidebarNav from "./components/SidebarNav";
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
    setQAItems(storage.getQAItems());
    const savedUnit = storage.getCurrentUnit();
    if (savedUnit) setCurrentUnit(savedUnit);
    setFilter(storage.getFilter());
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setQAItems(storage.getQAItems());
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

  const handleQAAdded = (item: QAItem) => setQAItems((prev) => [...prev, item]);

  const handleQAUpdated = (id: string, updates: Partial<QAItem>) => {
    setQAItems((prev) => prev.map((qa) => (qa.id === id ? { ...qa, ...updates } : qa)));
  };

  const handleClearAll = () => {
    storage.setQAItems([]);
    setQAItems([]);
  };

  if (!user) return <WelcomeScreen onLogin={handleLogin} />;

  const pageContent = (
    <>
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
        <MindMapPage qaItems={qaItems} currentUnit={currentUnit} filter={filter} />
      )}
      {activeTab === "settings" && (
        <SettingsPage
          user={user}
          filter={filter}
          currentUnit={currentUnit}
          qaItems={qaItems}
          onFilterChange={(f) => { setFilter(f); storage.setFilter(f); }}
          onUnitChange={setCurrentUnit}
          onLogout={handleLogout}
          onClearAll={handleClearAll}
        />
      )}
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0">
        <SidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userName={user.displayName}
          qaCount={qaItems.length}
        />
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile: center with max-width; Desktop: full width */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row md:bg-white">
          <div className="flex-1 overflow-hidden flex flex-col max-w-lg mx-auto w-full md:max-w-none md:mx-0">
            {pageContent}
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden max-w-lg mx-auto w-full">
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
