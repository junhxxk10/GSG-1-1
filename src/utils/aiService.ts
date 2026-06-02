import { QAItem, CurriculumUnit } from "../types";
import { v4 as uuidv4 } from "uuid";

const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY || "";

export async function askClaude(
  question: string,
  currentUnit?: CurriculumUnit | null,
  previousQAs?: QAItem[]
): Promise<string> {
  const systemPrompt = `당신은 친절하고 명확한 학습 도우미입니다. 학생의 질문에 한국어로 답변해주세요.
${currentUnit ? `현재 학습 단원: ${currentUnit.subject} - ${currentUnit.unit} (${currentUnit.grade})` : ""}
${previousQAs && previousQAs.length > 0 ? `이전 질문들을 참고하여 연관성 있게 답변해주세요.` : ""}

답변은 명확하고 교육적으로, 학생이 이해하기 쉽게 설명해주세요.
핵심 개념은 **굵게** 표시하고, 중요한 내용은 bullet point로 정리해주세요.`;

  if (!CLAUDE_API_KEY) {
    return generateMockAnswer(question, currentUnit);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
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
      const error = await response.json();
      console.error("Claude API error:", error);
      return generateMockAnswer(question, currentUnit);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (err) {
    console.error("API call failed:", err);
    return generateMockAnswer(question, currentUnit);
  }
}

function generateMockAnswer(question: string, unit?: CurriculumUnit | null): string {
  const answers: Record<string, string> = {
    default: `**질문에 대한 답변**\n\n"${question}"에 대해 설명드릴게요.\n\n• 핵심 개념을 이해하는 것이 중요합니다\n• 관련 예제를 통해 학습하면 더욱 효과적입니다\n• 꾸준한 복습이 실력 향상의 비결입니다\n\n더 구체적인 질문이 있으시면 언제든지 물어보세요!`,
  };

  if (unit) {
    return `**${unit.unit}** 관련 질문이군요!\n\n${question}에 대해 답변드립니다:\n\n• ${unit.keyPoints[0]}의 기본 원리를 이해하세요\n• **${unit.keyConcepts[0]}** 개념을 중심으로 학습하면 도움이 됩니다\n• ${unit.keyPoints.length > 1 ? unit.keyPoints[1] : "관련 개념들"}과의 연결고리를 찾아보세요\n\n${unit.subject} ${unit.unit} 단원의 핵심은 **${unit.keyConcepts.slice(0, 2).join(", ")}** 입니다.`;
  }

  return answers.default;
}

export function extractTags(question: string, answer: string): string[] {
  const text = question + " " + answer;
  const mathTerms = ["방정식", "함수", "미분", "적분", "극한", "수열", "확률", "통계", "벡터", "행렬"];
  const sciTerms = ["힘", "에너지", "파동", "전기", "자기", "원자", "분자", "반응", "진화", "유전"];
  const engTerms = ["문법", "시제", "조동사", "관계사", "접속사", "독해", "어휘", "영작"];
  const korTerms = ["문학", "소설", "시", "수필", "독서", "문법", "음운", "어휘", "화법", "작문"];

  const allTerms = [...mathTerms, ...sciTerms, ...engTerms, ...korTerms];
  return allTerms.filter((term) => text.includes(term)).slice(0, 4);
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
