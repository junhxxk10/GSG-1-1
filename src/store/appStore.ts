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
    // ── I-1. 물질의 규칙성과 결합 ──
    {
      id: "sci-1-1",
      subject: "과학",
      category: "I-1. 물질의 규칙성과 결합",
      grade: "고1",
      chapter: "I. 물질과 규칙성",
      unit: "우주 초기 원소의 생성",
      keyPoints: ["빅뱅 이후 수소·헬륨 생성", "별의 진화와 무거운 원소 생성", "우주의 역사와 원소 분포"],
      keyConcepts: ["빅뱅", "수소", "헬륨", "핵융합", "초신성", "원소 생성"],
      color: "#e3f2fd",
    },
    {
      id: "sci-1-2",
      subject: "과학",
      category: "I-1. 물질의 규칙성과 결합",
      grade: "고1",
      chapter: "I. 물질과 규칙성",
      unit: "지구와 생명체를 이루는 원소",
      keyPoints: ["주기율표와 원소 주기성", "지각·대기·생명체의 주요 원소", "원소의 성질과 주기성"],
      keyConcepts: ["주기율표", "원소", "주기성", "족", "전자 배치", "이온화 에너지"],
      color: "#e3f2fd",
    },
    {
      id: "sci-1-3",
      subject: "과학",
      category: "I-1. 물질의 규칙성과 결합",
      grade: "고1",
      chapter: "I. 물질과 규칙성",
      unit: "원소들의 화학 결합",
      keyPoints: ["이온 결합", "공유 결합", "금속 결합", "결합과 물질의 성질"],
      keyConcepts: ["이온결합", "공유결합", "금속결합", "전기음성도", "옥텟규칙", "극성"],
      color: "#e3f2fd",
    },

    // ── I-2. 자연의 구성 물질 ──
    {
      id: "sci-2-1",
      subject: "과학",
      category: "I-2. 자연의 구성 물질",
      grade: "고1",
      chapter: "I. 물질과 규칙성",
      unit: "지각을 이루는 물질",
      keyPoints: ["규산염 광물의 구조", "지각의 구성 원소", "암석의 생성과 분류"],
      keyConcepts: ["규산염", "석영", "장석", "암석", "광물", "SiO₄ 사면체"],
      color: "#e3f2fd",
    },
    {
      id: "sci-2-2",
      subject: "과학",
      category: "I-2. 자연의 구성 물질",
      grade: "고1",
      chapter: "I. 물질과 규칙성",
      unit: "생명체를 이루는 물질",
      keyPoints: ["탄소 화합물의 특성", "단백질·DNA의 구조와 기능", "세포막의 구성"],
      keyConcepts: ["탄소화합물", "아미노산", "단백질", "핵산", "DNA", "세포막", "인지질"],
      color: "#e3f2fd",
    },
    {
      id: "sci-2-3",
      subject: "과학",
      category: "I-2. 자연의 구성 물질",
      grade: "고1",
      chapter: "I. 물질과 규칙성",
      unit: "신소재의 개발과 이용",
      keyPoints: ["반도체와 초전도체 특성", "그래핀·탄소나노튜브", "신소재의 활용 분야"],
      keyConcepts: ["반도체", "초전도체", "그래핀", "탄소나노튜브", "풀러렌", "액정"],
      color: "#e3f2fd",
    },

    // ── II-1. 역학적 시스템 ──
    {
      id: "sci-3-1",
      subject: "과학",
      category: "II-1. 역학적 시스템",
      grade: "고1",
      chapter: "II. 시스템과 상호작용",
      unit: "중력과 역학적 시스템",
      keyPoints: ["뉴턴의 운동 법칙", "중력의 크기와 방향", "역학적 에너지 보존"],
      keyConcepts: ["관성", "가속도", "뉴턴의 법칙", "중력", "역학적 에너지", "자유낙하"],
      color: "#e3f2fd",
    },
    {
      id: "sci-3-2",
      subject: "과학",
      category: "II-1. 역학적 시스템",
      grade: "고1",
      chapter: "II. 시스템과 상호작용",
      unit: "운동량과 충격량",
      keyPoints: ["운동량의 정의와 보존", "충격량과 충돌", "안전장치의 원리"],
      keyConcepts: ["운동량", "충격량", "운동량 보존", "충돌", "반발계수", "에어백"],
      color: "#e3f2fd",
    },

    // ── II-2. 지구 시스템 ──
    {
      id: "sci-4-1",
      subject: "과학",
      category: "II-2. 지구 시스템",
      grade: "고1",
      chapter: "II. 시스템과 상호작용",
      unit: "지구 시스템의 구성과 상호작용",
      keyPoints: ["지권·수권·기권·생물권·외권", "지구계의 상호 작용", "판 구조론"],
      keyConcepts: ["지권", "수권", "기권", "생물권", "외권", "판 구조론", "상호작용"],
      color: "#e3f2fd",
    },
    {
      id: "sci-4-2",
      subject: "과학",
      category: "II-2. 지구 시스템",
      grade: "고1",
      chapter: "II. 시스템과 상호작용",
      unit: "지구 시스템의 에너지와 물질 순환",
      keyPoints: ["지구 에너지의 근원", "탄소·질소·물 순환", "기상 현상과 기후"],
      keyConcepts: ["태양 에너지", "지열", "탄소 순환", "질소 순환", "물 순환", "기후"],
      color: "#e3f2fd",
    },

    // ── II-3. 생명 시스템 ──
    {
      id: "sci-5-1",
      subject: "과학",
      category: "II-3. 생명 시스템",
      grade: "고1",
      chapter: "II. 시스템과 상호작용",
      unit: "생명 시스템의 기본 단위",
      keyPoints: ["세포의 구조와 기능", "원핵세포와 진핵세포", "세포소기관의 역할"],
      keyConcepts: ["세포", "세포막", "핵", "미토콘드리아", "리보솜", "엽록체", "원핵세포"],
      color: "#e3f2fd",
    },
    {
      id: "sci-5-2",
      subject: "과학",
      category: "II-3. 생명 시스템",
      grade: "고1",
      chapter: "II. 시스템과 상호작용",
      unit: "물질대사와 세포",
      keyPoints: ["세포 호흡과 ATP", "광합성의 과정", "효소의 특성"],
      keyConcepts: ["물질대사", "ATP", "세포 호흡", "광합성", "효소", "기질특이성"],
      color: "#e3f2fd",
    },
    {
      id: "sci-5-3",
      subject: "과학",
      category: "II-3. 생명 시스템",
      grade: "고1",
      chapter: "II. 시스템과 상호작용",
      unit: "유전 정보와 단백질 합성",
      keyPoints: ["DNA의 이중나선 구조", "전사와 번역", "유전자와 단백질의 관계"],
      keyConcepts: ["DNA", "RNA", "전사", "번역", "코돈", "아미노산", "리보솜"],
      color: "#e3f2fd",
    },

    // ── III-1. 화학 변화 ──
    {
      id: "sci-6-1",
      subject: "과학",
      category: "III-1. 화학 변화",
      grade: "고1",
      chapter: "III. 변화와 다양성",
      unit: "산화와 환원",
      keyPoints: ["산화·환원의 정의", "전자 이동과 산화수", "산화·환원 반응의 예"],
      keyConcepts: ["산화", "환원", "산화수", "산화제", "환원제", "전자 이동", "부식"],
      color: "#e3f2fd",
    },
    {
      id: "sci-6-2",
      subject: "과학",
      category: "III-1. 화학 변화",
      grade: "고1",
      chapter: "III. 변화와 다양성",
      unit: "산과 염기",
      keyPoints: ["산·염기의 정의", "수소 이온 농도(pH)", "지시약과 pH 측정"],
      keyConcepts: ["산", "염기", "pH", "수소 이온", "수산화 이온", "브뢴스테드·로우리"],
      color: "#e3f2fd",
    },
    {
      id: "sci-6-3",
      subject: "과학",
      category: "III-1. 화학 변화",
      grade: "고1",
      chapter: "III. 변화와 다양성",
      unit: "중화 반응",
      keyPoints: ["중화 반응의 원리", "중화 적정", "생활 속 중화 반응"],
      keyConcepts: ["중화반응", "염", "물", "당량점", "적정", "지시약"],
      color: "#e3f2fd",
    },

    // ── III-2. 생물 다양성과 유지 ──
    {
      id: "sci-7-1",
      subject: "과학",
      category: "III-2. 생물 다양성과 유지",
      grade: "고1",
      chapter: "III. 변화와 다양성",
      unit: "변이와 자연선택",
      keyPoints: ["변이의 원인과 종류", "자연선택의 원리", "진화의 증거"],
      keyConcepts: ["변이", "자연선택", "적자생존", "진화", "적응", "돌연변이"],
      color: "#e3f2fd",
    },
    {
      id: "sci-7-2",
      subject: "과학",
      category: "III-2. 생물 다양성과 유지",
      grade: "고1",
      chapter: "III. 변화와 다양성",
      unit: "생물 다양성 보전",
      keyPoints: ["생물 다양성의 의미와 수준", "생물 다양성 감소 원인", "생물 다양성 보전 방법"],
      keyConcepts: ["유전적 다양성", "종 다양성", "생태계 다양성", "멸종위기", "보전"],
      color: "#e3f2fd",
    },

    // ── IV-1. 생태계와 환경 ──
    {
      id: "sci-8-1",
      subject: "과학",
      category: "IV-1. 생태계와 환경",
      grade: "고1",
      chapter: "IV. 환경과 에너지",
      unit: "생태계의 구성과 기능",
      keyPoints: ["생태계의 구성 요소", "먹이사슬과 에너지 흐름", "물질 순환"],
      keyConcepts: ["생산자", "소비자", "분해자", "먹이사슬", "에너지 피라미드", "탄소 순환"],
      color: "#e3f2fd",
    },
    {
      id: "sci-8-2",
      subject: "과학",
      category: "IV-1. 생태계와 환경",
      grade: "고1",
      chapter: "IV. 환경과 에너지",
      unit: "지구 환경 변화와 인류",
      keyPoints: ["기후 변화의 원인", "온실효과와 지구 온난화", "환경 문제와 지속가능성"],
      keyConcepts: ["온실가스", "지구 온난화", "기후 변화", "탄소 발자국", "지속가능발전"],
      color: "#e3f2fd",
    },

    // ── IV-2. 발전과 신재생 에너지 ──
    {
      id: "sci-9-1",
      subject: "과학",
      category: "IV-2. 발전과 신재생 에너지",
      grade: "고1",
      chapter: "IV. 환경과 에너지",
      unit: "전기 에너지 생산",
      keyPoints: ["전자기 유도의 원리", "발전기의 구조", "전력 수송과 변압기"],
      keyConcepts: ["전자기 유도", "발전기", "교류", "변압기", "송전", "전력 손실"],
      color: "#e3f2fd",
    },
    {
      id: "sci-9-2",
      subject: "과학",
      category: "IV-2. 발전과 신재생 에너지",
      grade: "고1",
      chapter: "IV. 환경과 에너지",
      unit: "신재생 에너지와 지속가능 발전",
      keyPoints: ["태양광·풍력·수력 발전", "핵발전의 원리와 특성", "에너지 자원의 미래"],
      keyConcepts: ["태양광", "풍력", "핵분열", "핵융합", "신재생에너지", "에너지 전환"],
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

export interface ResourceLink {
  name: string;
  url: string;
  desc: string;
}

// 과목별 참고 사이트
export const SUBJECT_RESOURCES: Record<string, ResourceLink[]> = {
  수학: [
    { name: "EBS 수학", url: "https://www.ebsi.co.kr/ebs/pot/potr/retrievePotMain.ebs", desc: "EBS 수학 강의·문제" },
    { name: "GeoGebra", url: "https://www.geogebra.org/graphing", desc: "함수·그래프 시각화" },
    { name: "수학방", url: "https://mathbang.net", desc: "개념 정리·예제" },
  ],
  영어: [
    { name: "EBS 영어", url: "https://www.ebsi.co.kr", desc: "EBS 영어 강의" },
    { name: "Cambridge Dictionary", url: "https://dictionary.cambridge.org/ko", desc: "영영·영한 사전" },
    { name: "Longman Dictionary", url: "https://www.ldoceonline.com", desc: "예문 중심 영어 사전" },
  ],
  국어: [
    { name: "국립국어원", url: "https://www.korean.go.kr", desc: "표준국어대사전·어문규범" },
    { name: "우리말샘", url: "https://opendict.korean.go.kr", desc: "한국어 열린 사전" },
    { name: "EBS 국어", url: "https://www.ebsi.co.kr", desc: "EBS 국어 강의" },
  ],
  과학: [
    { name: "사이언스올", url: "https://www.scienceall.com", desc: "과학 개념·용어 사전" },
    { name: "EBS 과학", url: "https://www.ebsi.co.kr", desc: "EBS 과학 강의" },
    { name: "PhET 시뮬레이션", url: "https://phet.colorado.edu/ko", desc: "물리·화학·생물 시뮬레이션" },
  ],
  사회: [
    { name: "EBS 사회", url: "https://www.ebsi.co.kr", desc: "EBS 사회 강의" },
    { name: "두산백과", url: "https://www.doopedia.co.kr", desc: "사회·역사 개념 사전" },
    { name: "통계청", url: "https://www.kostat.go.kr", desc: "한국 사회 통계 자료" },
  ],
};

// 카테고리별 추가 참고 사이트
export const CATEGORY_RESOURCES: Record<string, ResourceLink[]> = {
  문학: [
    { name: "한국고전종합DB", url: "https://db.itkc.or.kr", desc: "고전 문학 원문 자료" },
    { name: "문학나눔", url: "https://www.munhaknaum.com", desc: "현대 문학 작품" },
  ],
  비문학: [
    { name: "RISS", url: "https://www.riss.kr", desc: "학술 논문·자료 검색" },
    { name: "KISTI", url: "https://www.kisti.re.kr", desc: "과학기술 정보 검색" },
  ],
  언어: [
    { name: "국립국어원", url: "https://www.korean.go.kr", desc: "표준국어대사전" },
    { name: "한국어기초사전", url: "https://krdict.korean.go.kr", desc: "기초 어휘 사전" },
  ],
  한지: [
    { name: "국토지리정보원", url: "https://www.ngii.go.kr", desc: "지형도·위성지도" },
    { name: "통계지리정보서비스", url: "https://sgis.kostat.go.kr", desc: "인구·지역 통계 지도" },
  ],
  세지: [
    { name: "Google 어스", url: "https://earth.google.com/web", desc: "세계 지형 탐색" },
    { name: "CIA World Factbook", url: "https://www.cia.gov/the-world-factbook", desc: "각국 정보·통계" },
  ],
  사회문화: [
    { name: "통계청", url: "https://www.kostat.go.kr", desc: "사회·인구 통계" },
    { name: "한국리서치", url: "https://hrcopinion.co.kr", desc: "사회 여론·트렌드" },
  ],
  "윤리와 사상": [
    { name: "철학사전", url: "https://terms.naver.com/list.naver?cid=41908", desc: "철학 개념 사전" },
    { name: "Stanford Encyclopedia", url: "https://plato.stanford.edu", desc: "철학 백과사전 (영문)" },
  ],
  경제: [
    { name: "한국은행 경제교육", url: "https://www.bok.or.kr/portal/main/sub/B0000222.do", desc: "경제 개념 교육 자료" },
    { name: "KDI 경제정보센터", url: "https://eiec.kdi.re.kr", desc: "경제 지식·통계" },
  ],
  "정치와 법": [
    { name: "법제처", url: "https://www.law.go.kr", desc: "한국 법령 원문" },
    { name: "헌법재판소", url: "https://www.ccourt.go.kr", desc: "헌법 판례·자료" },
  ],
  "I-1. 물질의 규칙성과 결합": [
    { name: "주기율표", url: "https://ptable.com/?lang=ko", desc: "인터랙티브 주기율표" },
    { name: "PhET 화학", url: "https://phet.colorado.edu/ko/simulations/category/chemistry", desc: "화학 결합 시뮬레이션" },
  ],
  "II-1. 역학적 시스템": [
    { name: "PhET 물리", url: "https://phet.colorado.edu/ko/simulations/category/physics", desc: "뉴턴 법칙·운동 시뮬레이션" },
  ],
  "II-3. 생명 시스템": [
    { name: "NCBI", url: "https://www.ncbi.nlm.nih.gov", desc: "유전자·생명 과학 자료" },
    { name: "iBiology", url: "https://www.ibiology.org", desc: "세포·분자생물학 강의 (영문)" },
  ],
};

export function getResourcesForUnit(unit: CurriculumUnit | null): ResourceLink[] {
  if (!unit) return [];
  const subjectRes = SUBJECT_RESOURCES[unit.subject] || [];
  const categoryRes = unit.category ? (CATEGORY_RESOURCES[unit.category] || []) : [];
  // 카테고리 자료를 앞에, 최대 4개
  return [...categoryRes, ...subjectRes].slice(0, 4);
}
