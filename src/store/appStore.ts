import { QAItem, User, CurriculumUnit, FilterSettings } from "../types";

const STORAGE_KEYS = {
  USER: "studymap_user",
  QA_ITEMS: "studymap_qa_items",
  UNITS: "studymap_units",
  FILTER: "studymap_filter",
  CURRENT_UNIT: "studymap_current_unit",
};

export const storage = {
  getUser: (): User | null => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  clearUser: () => localStorage.removeItem(STORAGE_KEYS.USER),

  getQAItems: (): QAItem[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.QA_ITEMS);
    return raw ? JSON.parse(raw) : [];
  },
  setQAItems: (items: QAItem[]) => {
    localStorage.setItem(STORAGE_KEYS.QA_ITEMS, JSON.stringify(items));
  },
  addQAItem: (item: QAItem) => {
    const items = storage.getQAItems();
    items.push(item);
    storage.setQAItems(items);
  },
  updateQAItem: (id: string, updates: Partial<QAItem>) => {
    const items = storage.getQAItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
      storage.setQAItems(items);
    }
  },

  getUnits: (): CurriculumUnit[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.UNITS);
    return raw ? JSON.parse(raw) : [];
  },
  setUnits: (units: CurriculumUnit[]) => {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  },

  getFilter: (): FilterSettings => {
    const raw = localStorage.getItem(STORAGE_KEYS.FILTER);
    return raw
      ? JSON.parse(raw)
      : { viewMode: "all", showAnswers: true };
  },
  setFilter: (filter: FilterSettings) => {
    localStorage.setItem(STORAGE_KEYS.FILTER, JSON.stringify(filter));
  },

  getCurrentUnit: (): CurriculumUnit | null => {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_UNIT);
    return raw ? JSON.parse(raw) : null;
  },
  setCurrentUnit: (unit: CurriculumUnit | null) => {
    if (unit) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_UNIT, JSON.stringify(unit));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_UNIT);
    }
  },
};

export const CURRICULUM_DATA: Record<string, CurriculumUnit[]> = {
  수학: [
    {
      id: "math-1-1",
      subject: "수학",
      grade: "고1",
      chapter: "1단원",
      unit: "다항식",
      keyPoints: ["다항식의 연산", "나머지 정리", "인수분해"],
      keyConcepts: ["다항식", "단항식", "차수", "계수", "항등식"],
      color: "#e3f2fd",
    },
    {
      id: "math-1-2",
      subject: "수학",
      grade: "고1",
      chapter: "2단원",
      unit: "방정식과 부등식",
      keyPoints: ["복소수", "이차방정식", "이차함수", "여러 가지 방정식"],
      keyConcepts: ["허수", "복소수", "판별식", "근과 계수의 관계"],
      color: "#fce4ec",
    },
    {
      id: "math-2-1",
      subject: "수학",
      grade: "고2",
      chapter: "1단원",
      unit: "집합과 명제",
      keyPoints: ["집합의 연산", "명제", "충분조건과 필요조건"],
      keyConcepts: ["집합", "부분집합", "합집합", "교집합", "명제", "역·이·대우"],
      color: "#e8f5e9",
    },
  ],
  영어: [
    {
      id: "eng-1-1",
      subject: "영어",
      grade: "고1",
      chapter: "문법",
      unit: "시제",
      keyPoints: ["현재완료", "과거완료", "미래완료"],
      keyConcepts: ["단순시제", "진행형", "완료형", "완료진행형"],
      color: "#fff9e6",
    },
    {
      id: "eng-1-2",
      subject: "영어",
      grade: "고1",
      chapter: "문법",
      unit: "조동사",
      keyPoints: ["can/could", "may/might", "must/should", "will/would"],
      keyConcepts: ["능력", "허가", "의무", "추측", "조언"],
      color: "#e0f7f0",
    },
  ],
  과학: [
    {
      id: "sci-1-1",
      subject: "과학",
      grade: "고1",
      chapter: "물리학",
      unit: "힘과 운동",
      keyPoints: ["뉴턴의 운동법칙", "중력", "마찰력"],
      keyConcepts: ["속도", "가속도", "힘", "관성", "작용반작용"],
      color: "#f0e6ff",
    },
    {
      id: "sci-1-2",
      subject: "과학",
      grade: "고1",
      chapter: "화학",
      unit: "원자의 세계",
      keyPoints: ["원자 모형", "전자 배치", "주기율표"],
      keyConcepts: ["양성자", "중성자", "전자", "원자번호", "주기", "족"],
      color: "#fbe9e7",
    },
  ],
  국어: [
    {
      id: "kor-1-1",
      subject: "국어",
      grade: "고1",
      chapter: "문학",
      unit: "시의 이해",
      keyPoints: ["운율", "이미지", "화자", "주제"],
      keyConcepts: ["운율", "심상", "어조", "시적 화자", "함축적 의미"],
      color: "#e8d5f5",
    },
    {
      id: "kor-1-2",
      subject: "국어",
      grade: "고1",
      chapter: "언어",
      unit: "음운론",
      keyPoints: ["음운 변동", "자음동화", "모음조화"],
      keyConcepts: ["음운", "음절", "자음", "모음", "음운변동"],
      color: "#fce4ec",
    },
  ],
};
