export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  unitId?: string;
  tags: string[];
  relatedIds: string[];
  subject?: string;
  isBookmarked: boolean;
}

export interface CurriculumUnit {
  id: string;
  subject: string;
  category?: string;
  grade: string;
  chapter: string;
  unit: string;
  keyPoints: string[];
  keyConcepts: string[];
  color: string;
}

export interface MindMapNode {
  id: string;
  type: "qa" | "unit" | "concept" | "root";
  label: string;
  data: QAItem | CurriculumUnit | { label: string };
  position: { x: number; y: number };
}

export interface FilterSettings {
  viewMode: "all" | "unit" | "my-qa";
  selectedUnitId?: string;
  selectedSubject?: string;
  showAnswers: boolean;
}

export type TabType = "home" | "mindmap" | "chat" | "settings";
