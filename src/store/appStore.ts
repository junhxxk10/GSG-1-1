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
    return raw ? JSON.parse(raw) : { viewMode: "all", showAnswers: true };
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
      id: "math-only",
      subject: "수학",
      grade: "고1",
      chapter: "수학",
      unit: "수학",
      keyPoints: [],
      keyConcepts: [],
      color: "#e3f2fd",
    },
  ],

  영어: [
    {
      id: "eng-only",
      subject: "영어",
      grade: "고1",
      chapter: "영어",
      unit: "영어",
      keyPoints: [],
      keyConcepts: [],
      color: "#fff9e6",
    },
  ],

  국어: [
    // ── 문학 ──
    {
      id: "kor-lit-1",
      subject: "국어",
      category: "문학",
      grade: "고1",
      chapter: "문학",
      unit: "시의 이해",
      keyPoints: ["운율과 이미지", "화자와 어조", "시적 표현법", "주제 파악"],
      keyConcepts: ["운율", "심상", "화자", "어조", "반어", "역설", "상징"],
      color: "#e8d5f5",
    },
    {
      id: "kor-lit-2",
      subject: "국어",
      category: "문학",
      grade: "고1",
      chapter: "문학",
      unit: "소설의 이해",
      keyPoints: ["서술자와 시점", "인물·사건·배경", "갈등 구조", "주제 파악"],
      keyConcepts: ["서술자", "시점", "플롯", "복선", "갈등", "주제", "소재"],
      color: "#e8d5f5",
    },
    {
      id: "kor-lit-3",
      subject: "국어",
      category: "문학",
      grade: "고1",
      chapter: "문학",
      unit: "수필·극의 이해",
      keyPoints: ["수필의 특성", "희곡과 시나리오", "무대 지문"],
      keyConcepts: ["수필", "희곡", "시나리오", "지문", "대사", "해설"],
      color: "#e8d5f5",
    },

    // ── 비문학 ──
    {
      id: "kor-read-1",
      subject: "국어",
      category: "비문학",
      grade: "고1",
      chapter: "독서",
      unit: "독서의 방법",
      keyPoints: ["사실적 읽기", "추론적 읽기", "비판적 읽기", "창의적 읽기"],
      keyConcepts: ["중심 내용", "구조 파악", "추론", "비판적 독해", "논증"],
      color: "#fce4ec",
    },
    {
      id: "kor-read-2",
      subject: "국어",
      category: "비문학",
      grade: "고1",
      chapter: "독서",
      unit: "인문·예술 지문",
      keyPoints: ["개념 이해", "관점 비교", "논지 파악"],
      keyConcepts: ["개념", "관점", "전제", "논지", "근거"],
      color: "#fce4ec",
    },
    {
      id: "kor-read-3",
      subject: "국어",
      category: "비문학",
      grade: "고1",
      chapter: "독서",
      unit: "사회·경제 지문",
      keyPoints: ["정보 분류", "인과 관계", "수치·도표 해석"],
      keyConcepts: ["인과", "상관", "근거", "수치 해석", "논리적 흐름"],
      color: "#fce4ec",
    },
    {
      id: "kor-read-4",
      subject: "국어",
      category: "비문학",
      grade: "고1",
      chapter: "독서",
      unit: "과학·기술 지문",
      keyPoints: ["원리·과정 이해", "개념 정의", "비교·대조"],
      keyConcepts: ["원리", "과정", "메커니즘", "비교", "대조", "예시"],
      color: "#fce4ec",
    },

    // ── 언어 (2015 개정 언어와 매체 교육과정) ──
    {
      id: "kor-lang-1",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "I. 언어와 국어",
      unit: "언어와 인간",
      keyPoints: ["언어의 특성(자의성·사회성·역사성·창조성)", "언어와 사고", "언어와 사회·문화"],
      keyConcepts: ["자의성", "사회성", "역사성", "창조성", "기호", "언어 공동체"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-2",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "I. 언어와 국어",
      unit: "국어의 특성과 위상",
      keyPoints: ["국어의 음운·어휘·문법적 특성", "한글의 우수성", "국어의 위상"],
      keyConcepts: ["교착어", "음소문자", "한글", "어휘 체계", "경어법"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-3",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "II. 음운",
      unit: "음운 체계",
      keyPoints: ["자음 체계(조음 위치·방법)", "모음 체계(단모음·이중모음)", "음절의 구조"],
      keyConcepts: ["자음", "모음", "음소", "음절", "조음 위치", "조음 방법", "단모음", "이중모음"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-4",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "II. 음운",
      unit: "음운 변동",
      keyPoints: ["교체(동화)", "탈락", "첨가", "축약"],
      keyConcepts: ["음운 변동", "자음 동화", "모음 동화", "구개음화", "두음법칙", "탈락", "첨가", "축약"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-5",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "III. 단어",
      unit: "형태소와 단어의 형성",
      keyPoints: ["형태소 분류(자립·의존, 실질·형식)", "단어 형성(합성·파생)", "어근과 접사"],
      keyConcepts: ["형태소", "자립형태소", "의존형태소", "실질형태소", "형식형태소", "어근", "접사", "합성어", "파생어"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-6",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "III. 단어",
      unit: "품사의 종류와 특성",
      keyPoints: ["9품사 체계", "체언·용언·수식언·관계언·독립언", "품사의 통용"],
      keyConcepts: ["명사", "대명사", "수사", "동사", "형용사", "관형사", "부사", "조사", "감탄사", "품사"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-7",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "IV. 문장과 담화",
      unit: "문장의 성분과 구조",
      keyPoints: ["주성분(주어·서술어·목적어·보어)", "부속성분·독립성분", "문장의 짜임(홑문장·겹문장)"],
      keyConcepts: ["주어", "서술어", "목적어", "보어", "관형어", "부사어", "독립어", "홑문장", "겹문장", "이어진문장", "안긴문장"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-8",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "IV. 문장과 담화",
      unit: "문법 요소",
      keyPoints: ["종결 표현(평서·의문·명령·청유·감탄)", "높임 표현", "시제·동작상", "피동·사동", "부정 표현", "인용 표현"],
      keyConcepts: ["높임법", "시제", "동작상", "피동", "사동", "부정표현", "인용절", "종결어미"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-9",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "IV. 문장과 담화",
      unit: "담화",
      keyPoints: ["담화의 개념과 구성 요소", "담화의 맥락", "담화 표지"],
      keyConcepts: ["담화", "화자", "청자", "맥락", "응집성", "통일성", "담화 표지"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-10",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "V. 국어의 역사",
      unit: "국어의 변천",
      keyPoints: ["고대·중세·근대·현대 국어의 특징", "훈민정음 창제", "음운·문법·어휘의 변화"],
      keyConcepts: ["고대국어", "중세국어", "근대국어", "현대국어", "훈민정음", "방점", "주격조사 이형태"],
      color: "#e0f7f0",
    },
    {
      id: "kor-lang-11",
      subject: "국어",
      category: "언어",
      grade: "고1",
      chapter: "VI. 매체 언어",
      unit: "매체 언어의 특성과 표현",
      keyPoints: ["매체 언어의 복합 양식성", "매체별 표현 방식", "매체 언어 비판적 수용"],
      keyConcepts: ["매체", "복합 양식", "디지털 매체", "매체 언어", "비판적 수용", "생산자 의도"],
      color: "#e0f7f0",
    },
  ],

  과학: [
    {
      id: "sci-1",
      subject: "과학",
      category: "1학기",
      grade: "고1",
      chapter: "통합과학 1단원",
      unit: "물질의 규칙성과 결합",
      keyPoints: ["원소의 생성(빅뱅·별)", "주기율표와 원소 주기성", "화학 결합(이온·공유·금속)", "물질의 성질"],
      keyConcepts: ["빅뱅", "원소", "주기율표", "이온결합", "공유결합", "금속결합", "전기음성도", "옥텟규칙"],
      color: "#e3f2fd",
    },
    {
      id: "sci-2",
      subject: "과학",
      category: "1학기",
      grade: "고1",
      chapter: "통합과학 2단원",
      unit: "자연의 구성 물질",
      keyPoints: ["지각·생명체의 구성 물질", "신소재의 성질과 활용", "세포막과 지질이중층"],
      keyConcepts: ["규산염 광물", "탄소 화합물", "단백질", "핵산", "세포막", "신소재", "탄소나노튜브", "그래핀"],
      color: "#e3f2fd",
    },
    {
      id: "sci-3",
      subject: "과학",
      category: "1학기",
      grade: "고1",
      chapter: "통합과학 3단원",
      unit: "역학적 시스템",
      keyPoints: ["뉴턴의 운동법칙", "중력과 역학적 에너지", "운동량과 충격량"],
      keyConcepts: ["속도", "가속도", "관성", "뉴턴의 법칙", "중력", "역학적 에너지 보존", "운동량", "충격량"],
      color: "#e3f2fd",
    },
    {
      id: "sci-4",
      subject: "과학",
      category: "2학기",
      grade: "고1",
      chapter: "통합과학 4단원",
      unit: "지구 시스템",
      keyPoints: ["지구계의 구성과 상호작용", "판 구조론", "지권·수권·기권·생물권·외권"],
      keyConcepts: ["지권", "수권", "기권", "생물권", "외권", "판 구조론", "순환", "상호작용"],
      color: "#e3f2fd",
    },
    {
      id: "sci-5",
      subject: "과학",
      category: "2학기",
      grade: "고1",
      chapter: "통합과학 5단원",
      unit: "생물다양성과 유지",
      keyPoints: ["진화와 자연선택", "생물다양성의 의미", "변이와 유전적 다양성"],
      keyConcepts: ["자연선택", "진화", "변이", "생물다양성", "유전적 다양성", "종다양성", "생태계다양성"],
      color: "#e3f2fd",
    },
    {
      id: "sci-6",
      subject: "과학",
      category: "2학기",
      grade: "고1",
      chapter: "통합과학 6단원",
      unit: "생태계와 환경",
      keyPoints: ["생태계 구성과 기능", "에너지 흐름·물질 순환", "환경 변화와 지속가능성"],
      keyConcepts: ["생산자", "소비자", "분해자", "먹이사슬", "에너지 흐름", "탄소순환", "기후변화", "지속가능발전"],
      color: "#e3f2fd",
    },
  ],

  사회: [
    // ── 한지 (한국지리 영역) ──
    {
      id: "soc-geo-1",
      subject: "사회",
      category: "한지",
      grade: "고1",
      chapter: "한국지리",
      unit: "국토 인식과 지리 정보",
      keyPoints: ["국토의 위치와 영역", "지리 정보 시스템(GIS)", "우리나라의 위치적 특성"],
      keyConcepts: ["영역", "영토", "영해", "배타적 경제수역", "GIS", "원격 탐사"],
      color: "#e8f5e9",
    },
    {
      id: "soc-geo-2",
      subject: "사회",
      category: "한지",
      grade: "고1",
      chapter: "한국지리",
      unit: "자연환경과 인간 생활",
      keyPoints: ["한반도의 지형 형성", "기후 특성과 주민 생활", "자연재해와 대응"],
      keyConcepts: ["지형", "기후", "기온역전", "계절풍", "자연재해", "적응", "열섬현상"],
      color: "#e8f5e9",
    },
    {
      id: "soc-geo-3",
      subject: "사회",
      category: "한지",
      grade: "고1",
      chapter: "한국지리",
      unit: "인구와 도시",
      keyPoints: ["인구 변천과 고령화", "도시화와 도시 문제", "지역 격차와 균형 발전"],
      keyConcepts: ["인구 변천 모델", "고령화", "도시화율", "역도시화", "도시 문제", "지역 격차"],
      color: "#e8f5e9",
    },

    // ── 세지 (세계지리 영역) ──
    {
      id: "soc-wgeo-1",
      subject: "사회",
      category: "세지",
      grade: "고1",
      chapter: "세계지리",
      unit: "세계의 기후와 자연환경",
      keyPoints: ["기후 지역 구분", "열대·건조·온대·냉대·한대 기후", "기후와 생활 양식"],
      keyConcepts: ["기후", "열대우림", "사바나", "사막", "지중해성 기후", "냉대기후", "툰드라"],
      color: "#e8f5e9",
    },
    {
      id: "soc-wgeo-2",
      subject: "사회",
      category: "세지",
      grade: "고1",
      chapter: "세계지리",
      unit: "세계의 인문환경과 지역 이해",
      keyPoints: ["세계 인구 분포와 도시화", "문화권 구분", "주요 지역의 특성"],
      keyConcepts: ["인구 분포", "도시화", "문화권", "종교", "민족", "지역화"],
      color: "#e8f5e9",
    },
    {
      id: "soc-wgeo-3",
      subject: "사회",
      category: "세지",
      grade: "고1",
      chapter: "세계지리",
      unit: "세계화와 지역 변화",
      keyPoints: ["세계화의 의미와 영향", "지역 갈등과 협력", "지속가능한 발전"],
      keyConcepts: ["세계화", "다국적 기업", "지역 갈등", "난민", "국제기구", "지속가능발전"],
      color: "#e8f5e9",
    },

    // ── 사회문화 ──
    {
      id: "soc-cult-1",
      subject: "사회",
      category: "사회문화",
      grade: "고1",
      chapter: "사회문화",
      unit: "개인과 사회구조",
      keyPoints: ["사회화와 자아 형성", "사회 집단과 조직", "사회 제도"],
      keyConcepts: ["사회화", "지위", "역할", "역할 갈등", "1차 집단", "2차 집단", "관료제", "탈관료제"],
      color: "#fff9e6",
    },
    {
      id: "soc-cult-2",
      subject: "사회",
      category: "사회문화",
      grade: "고1",
      chapter: "사회문화",
      unit: "문화와 사회",
      keyPoints: ["문화의 의미와 특성", "문화 이해 관점", "문화 변동"],
      keyConcepts: ["문화", "하위문화", "반문화", "문화 상대주의", "자문화 중심주의", "문화 접변", "문화 동화"],
      color: "#fff9e6",
    },
    {
      id: "soc-cult-3",
      subject: "사회",
      category: "사회문화",
      grade: "고1",
      chapter: "사회문화",
      unit: "사회 불평등과 사회 복지",
      keyPoints: ["사회 불평등 현상", "사회 이동과 계층 구조", "사회 복지와 복지 제도"],
      keyConcepts: ["계층", "계급", "사회 이동", "교육 기회", "사회 복지", "빈부격차", "노동 시장"],
      color: "#fff9e6",
    },

    // ── 윤리와 사상 ──
    {
      id: "soc-eth-1",
      subject: "사회",
      category: "윤리와 사상",
      grade: "고1",
      chapter: "윤리와 사상",
      unit: "인간과 윤리",
      keyPoints: ["윤리학의 의미와 목적", "도덕적 주체로서의 인간", "윤리 이론의 유형"],
      keyConcepts: ["윤리", "도덕", "의무론", "공리주의", "덕 윤리", "배려 윤리", "도덕적 추론"],
      color: "#fbe9e7",
    },
    {
      id: "soc-eth-2",
      subject: "사회",
      category: "윤리와 사상",
      grade: "고1",
      chapter: "윤리와 사상",
      unit: "동양 윤리 사상",
      keyPoints: ["유교 윤리(인·의·예)", "불교 윤리(자비·팔정도)", "도가 윤리(무위자연)"],
      keyConcepts: ["인(仁)", "의(義)", "예(禮)", "자비", "팔정도", "무위자연", "인의예지", "도(道)"],
      color: "#fbe9e7",
    },
    {
      id: "soc-eth-3",
      subject: "사회",
      category: "윤리와 사상",
      grade: "고1",
      chapter: "윤리와 사상",
      unit: "서양 윤리 사상",
      keyPoints: ["소크라테스·플라톤·아리스토텔레스", "칸트의 의무론", "공리주의(벤담·밀)", "현대 윤리학"],
      keyConcepts: ["이데아", "덕(arete)", "행복(eudaimonia)", "정언명령", "최대 다수 최대 행복", "공리", "공정"],
      color: "#fbe9e7",
    },

    // ── 경제 ──
    {
      id: "soc-eco-1",
      subject: "사회",
      category: "경제",
      grade: "고1",
      chapter: "경제",
      unit: "경제 주체와 시장",
      keyPoints: ["희소성과 합리적 선택", "수요·공급과 가격 결정", "시장 실패와 정부 개입"],
      keyConcepts: ["희소성", "기회비용", "수요", "공급", "균형가격", "시장실패", "외부효과", "공공재"],
      color: "#e3f2fd",
    },
    {
      id: "soc-eco-2",
      subject: "사회",
      category: "경제",
      grade: "고1",
      chapter: "경제",
      unit: "국민 경제와 거시 경제",
      keyPoints: ["GDP와 경제 성장", "실업과 인플레이션", "경기 변동과 안정화 정책"],
      keyConcepts: ["GDP", "경제성장률", "실업률", "인플레이션", "스태그플레이션", "재정정책", "통화정책"],
      color: "#e3f2fd",
    },
    {
      id: "soc-eco-3",
      subject: "사회",
      category: "경제",
      grade: "고1",
      chapter: "경제",
      unit: "국제 경제와 무역",
      keyPoints: ["비교 우위와 무역", "환율과 국제 수지", "무역 정책과 국제 협력"],
      keyConcepts: ["비교우위", "절대우위", "자유무역", "보호무역", "환율", "국제수지", "경상수지"],
      color: "#e3f2fd",
    },

    // ── 정치와 법 ──
    {
      id: "soc-pol-1",
      subject: "사회",
      category: "정치와 법",
      grade: "고1",
      chapter: "정치와 법",
      unit: "민주주의와 헌법",
      keyPoints: ["민주주의의 원리", "헌법의 기본 원리", "기본권의 종류와 제한"],
      keyConcepts: ["국민주권", "권력분립", "법치주의", "기본권", "자유권", "평등권", "사회권", "참정권"],
      color: "#f0e6ff",
    },
    {
      id: "soc-pol-2",
      subject: "사회",
      category: "정치와 법",
      grade: "고1",
      chapter: "정치와 법",
      unit: "정치 과정과 참여",
      keyPoints: ["선거 제도", "정당·이익집단·시민단체", "지방 자치와 민주 시민"],
      keyConcepts: ["선거", "정당", "이익집단", "NGO", "지방자치", "정치 참여", "여론", "미디어"],
      color: "#f0e6ff",
    },
    {
      id: "soc-pol-3",
      subject: "사회",
      category: "정치와 법",
      grade: "고1",
      chapter: "정치와 법",
      unit: "법의 이해와 적용",
      keyPoints: ["법의 의미와 목적", "민법·형법의 기초", "재판 절차와 인권 보장"],
      keyConcepts: ["법", "민법", "형법", "행정법", "재판", "무죄추정원칙", "적법절차", "인권"],
      color: "#f0e6ff",
    },
  ],
};
