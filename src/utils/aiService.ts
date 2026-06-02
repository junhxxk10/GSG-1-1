import { QAItem, CurriculumUnit } from "../types";
import { v4 as uuidv4 } from "uuid";

export async function askClaude(
  question: string,
  currentUnit?: CurriculumUnit | null,
  previousQAs?: QAItem[]
): Promise<string> {
  const apiKey =
    localStorage.getItem("studymap_api_key") ||
    process.env.REACT_APP_CLAUDE_API_KEY ||
    "";

  const unitContext = currentUnit
    ? `현재 학습 단원: ${currentUnit.subject}${currentUnit.category ? ` > ${currentUnit.category}` : ""} > ${currentUnit.unit} (${currentUnit.grade})`
    : "";

  const systemPrompt = `당신은 고등학생의 공부를 도와주는 학습 도우미입니다.

[답변 규칙]
1. 질문에 대해 정확하고 직접적으로 답변하세요. "~를 중심으로 공부하세요" 같은 말은 하지 마세요.
2. 개념 설명, 풀이, 비교, 예시 등 질문이 원하는 형태로 바로 답해주세요.
3. 틀리기 쉽거나, 이후 일반선택·진로선택 과목에서도 계속 등장하는 핵심 용어나 개념은 ==용어== 형식으로 표시하세요. (예: ==판별식==, ==형태소==)
4. 중요 키워드나 정의는 **굵게** 표시하세요.
5. 목록은 • 로 시작하는 줄로 정리하세요.
6. 한국어로 답변하세요.
7. 너무 길게 쓰지 말고 핵심만 명확하게 정리하세요.
${unitContext ? `\n[현재 학습 단원]\n${unitContext}` : ""}
${previousQAs && previousQAs.length > 0 ? `\n[이전 질문 맥락 참고]\n${previousQAs.map(q => `Q: ${q.question}`).join("\n")}` : ""}`;

  if (!apiKey) {
    return generateMockAnswer(question, currentUnit);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", await response.json());
      return generateMockAnswer(question, currentUnit);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    console.error("API call failed:", err);
    return generateMockAnswer(question, currentUnit);
  }
}

// 과목별 샘플 답변 (API 키 없을 때)
function generateMockAnswer(question: string, unit?: CurriculumUnit | null): string {
  const q = question.toLowerCase();

  // 국어 - 언어
  if (unit?.category === "언어" || q.includes("형태소") || q.includes("음운") || q.includes("품사")) {
    if (q.includes("형태소")) {
      return `**형태소**란 의미를 가지는 가장 작은 언어 단위입니다.\n\n• **자립형태소**: 혼자 쓰일 수 있음 → 하늘, 먹, 예쁘\n• **의존형태소**: 혼자 쓰일 수 없음 → -이, -가, -었-, -다\n• **실질형태소**: 구체적 의미를 가짐 → 밥, 먹, 크\n• **형식형태소**: 문법적 기능만 함 → 조사, 어미, 접사\n\n예) "학생이 밥을 먹었다"\n→ 학생 / 이 / 밥 / 을 / 먹 / 었 / 다 (총 7개)\n\n==형식형태소==는 수능에서 자주 출제되는 개념이에요. ==의존형태소==와 혼동하지 마세요!`;
    }
    if (q.includes("음운 변동") || q.includes("음운변동")) {
      return `**음운 변동**은 음운이 다른 음운으로 바뀌거나 없어지거나 새로 생기는 현상입니다.\n\n• **교체(동화)**: 한 음운이 다른 음운으로 바뀜\n  - 자음동화: 국물[궁물], 신라[실라]\n  - ==구개음화==: 굳이[구지], 해돋이[해도지]\n• **탈락**: 음운이 없어짐\n  - 자음탈락: 닭[닥], 흙[흑]\n• **첨가**: 음운이 새로 생김\n  - ㄴ첨가: 솜이불[솜니불]\n• **축약**: 두 음운이 하나로 합쳐짐\n  - 격음화: 좋고[조코], 넣다[너타]`;
    }
  }

  // 국어 - 문학
  if (unit?.category === "문학" || q.includes("시") || q.includes("소설") || q.includes("서술")) {
    return `**${question}**에 대한 답변입니다.\n\n${q.includes("시점") ? "• **1인칭 주인공 시점**: 주인공이 직접 서술 → 주관적, 내면 심리 표현 용이\n• **1인칭 관찰자 시점**: 관찰자가 서술 → 객관적, 주인공 심리는 제한적\n• **3인칭 전지적 시점**: 서술자가 모든 것을 앎 → 인물 내면까지 서술\n• **3인칭 관찰자 시점**: 외부만 관찰 → 독자의 해석 중요\n\n==서술자==와 ==화자==를 구분하는 것이 수능에서 핵심입니다." : "문학 작품 분석 시 ==맥락==을 파악하는 것이 중요합니다.\n\n• 작품의 배경(시대·사회·작가)\n• 주제 의식과 작가의 의도\n• 표현 기법과 효과"}`;
  }

  // 수학
  if (unit?.subject === "수학" || q.includes("방정식") || q.includes("함수") || q.includes("미분") || q.includes("적분")) {
    if (q.includes("판별식")) {
      return `**판별식 D**는 이차방정식 ax²+bx+c=0의 근의 개수를 판단하는 식입니다.\n\n**D = b² - 4ac**\n\n• **D > 0**: 서로 다른 두 실근\n• **D = 0**: 중근 (같은 두 실근)\n• **D < 0**: 서로 다른 두 허근 (실근 없음)\n\n예) x²-5x+6=0 → D=25-24=1>0 → 두 실근 존재\n\n==판별식==은 ==이차함수==의 그래프와 x축의 관계(교점 수)와 완전히 대응돼요.`;
    }
    return `**${question}**에 대해 답변합니다.\n\n${q.includes("인수분해") ? "• a²-b² = (a+b)(a-b)\n• a²+2ab+b² = (a+b)²\n• a²-2ab+b² = (a-b)²\n• x²+(a+b)x+ab = (x+a)(x+b)\n\n==인수분해==는 ==근의 공식==과 연결되며 수학Ⅱ, 미적분에서도 계속 사용됩니다." : "수학 개념을 정확히 이해하려면 정의와 공식의 유도 과정을 알아두세요.\n\n==정의== → ==성질 도출== → ==공식 암기== 순서로 학습하면 오래 기억됩니다."}`;
  }

  // 과학
  if (unit?.subject === "과학" || q.includes("원소") || q.includes("에너지") || q.includes("세포")) {
    return `**${question}**에 대한 답변입니다.\n\n통합과학의 핵심 개념으로, ${unit?.unit || "해당 단원"}과 연결됩니다.\n\n• 기본 개념: ==${unit?.keyConcepts[0] || "핵심 용어"}==를 정확히 이해하세요\n• 원리 이해: ${unit?.keyPoints[0] || "단원의 핵심 원리"}를 숙지하세요\n• 실생활 연결: 배운 개념이 실생활에서 어떻게 적용되는지 생각해보세요\n\n==통합과학== 개념들은 이후 **물리학**, **화학**, **생명과학**, **지구과학** 각 과목에서 심화됩니다.`;
  }

  // 사회
  if (unit?.subject === "사회") {
    const categoryMap: Record<string, string> = {
      한지: "한국지리",
      세지: "세계지리",
      사회문화: "사회·문화",
      "윤리와 사상": "윤리와 사상",
      경제: "경제",
      "정치와 법": "정치와 법",
    };
    const subjectName = unit.category ? categoryMap[unit.category] || unit.category : "사회";
    return `**[${subjectName}]** ${question}에 대한 답변입니다.\n\n• **핵심 개념**: ==${unit.keyConcepts[0] || "주요 개념"}==을 중심으로 이해하세요\n• **주요 내용**: ${unit.keyPoints[0] || "단원 핵심 내용"}\n• **연결 개념**: ${unit.keyConcepts.slice(1, 3).join(", ") || "관련 개념들"}\n\n이 개념은 이후 ${subjectName} 심화 과목에서도 자주 등장하는 ==기초 개념==입니다.`;
  }

  // 영어
  if (unit?.subject === "영어" || q.includes("문법") || q.includes("시제") || q.includes("관계사")) {
    return `**${question}**에 대한 답변입니다.\n\n영어 개념을 정확히 이해하기 위해 예문과 함께 학습하세요.\n\n• 기본 규칙을 먼저 이해하세요\n• 예외 사항도 함께 정리하세요\n• 실제 문장에서 확인하며 적용하세요\n\n==핵심 문법 개념==은 수능까지 계속 활용되므로 정확하게 익혀두세요.`;
  }

  // 기본 답변
  return `**${question}**에 대한 답변입니다.\n\n질문하신 내용을 바탕으로 설명드릴게요.\n\n• 개념의 정의와 의미를 먼저 파악하세요\n• 구체적인 예시로 이해를 확인하세요\n• 관련 개념과의 차이점도 정리하세요\n\n더 구체적인 질문을 해주시면 더 정확한 답변을 드릴 수 있어요! API 키를 설정하면 실제 AI 답변을 받을 수 있습니다.`;
}

export function extractTags(question: string, answer: string): string[] {
  const text = question + " " + answer;
  const terms = [
    "방정식", "함수", "미분", "적분", "극한", "수열", "확률", "행렬",
    "음운", "형태소", "품사", "문장", "담화", "문학", "소설", "시",
    "에너지", "원소", "세포", "진화", "생태계", "지구",
    "경제", "민주주의", "문화", "사회화", "윤리",
    "시제", "조동사", "관계사",
  ];
  return terms.filter((term) => text.includes(term)).slice(0, 4);
}

export function findRelatedQAs(newQA: QAItem, existingQAs: QAItem[]): string[] {
  const newText = (newQA.question + " " + newQA.answer).toLowerCase();
  const relatedIds: string[] = [];

  for (const qa of existingQAs) {
    if (qa.id === newQA.id) continue;
    const existingText = (qa.question + " " + qa.answer).toLowerCase();
    const newWords = newText.split(/\s+/).filter((w) => w.length > 2);
    const matchCount = newWords.filter((w) => existingText.includes(w)).length;
    const similarity = matchCount / newWords.length;

    if (similarity > 0.15 || (newQA.unitId && qa.unitId && newQA.unitId === qa.unitId)) {
      relatedIds.push(qa.id);
    }
  }

  return relatedIds.slice(0, 3);
}

export function createQAItem(
  question: string,
  answer: string,
  currentUnit?: CurriculumUnit | null,
  existingQAs?: QAItem[]
): QAItem {
  const tags = extractTags(question, answer);
  const newItem: QAItem = {
    id: uuidv4(),
    question,
    answer,
    timestamp: new Date().toISOString(),
    unitId: currentUnit?.id,
    tags,
    relatedIds: [],
    subject: currentUnit?.subject,
    isBookmarked: false,
  };

  if (existingQAs) {
    newItem.relatedIds = findRelatedQAs(newItem, existingQAs);
  }

  return newItem;
}
