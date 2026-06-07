import { QAItem, CurriculumUnit } from "../types";
import { v4 as uuidv4 } from "uuid";

export type AIProvider = "claude" | "openai" | "gemini";

export interface AISettings {
  provider: AIProvider;
  claudeKey: string;
  openaiKey: string;
  openaiModel: string;
  geminiKey: string;
  geminiModel: string;
}

export const AI_MODELS = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
  gemini: ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-pro"],
};

export function getAISettings(): AISettings {
  const storedGeminiModel = localStorage.getItem("gemini_model");
  const validGeminiModels = AI_MODELS.gemini;
  const geminiModel =
    storedGeminiModel && validGeminiModels.includes(storedGeminiModel)
      ? storedGeminiModel
      : "gemini-2.0-flash";

  return {
    provider: (localStorage.getItem("ai_provider") as AIProvider) || (process.env.REACT_APP_AI_PROVIDER as AIProvider) || "gemini",
    claudeKey: localStorage.getItem("studymap_api_key") || process.env.REACT_APP_CLAUDE_API_KEY || "",
    openaiKey: localStorage.getItem("openai_api_key") || "",
    openaiModel: localStorage.getItem("openai_model") || "gpt-4o-mini",
    geminiKey: localStorage.getItem("gemini_api_key") || process.env.REACT_APP_GEMINI_API_KEY || "",
    geminiModel,
  };
}

export function saveAISettings(settings: Partial<AISettings>) {
  if (settings.provider) localStorage.setItem("ai_provider", settings.provider);
  if (settings.claudeKey !== undefined) localStorage.setItem("studymap_api_key", settings.claudeKey);
  if (settings.openaiKey !== undefined) localStorage.setItem("openai_api_key", settings.openaiKey);
  if (settings.openaiModel !== undefined) localStorage.setItem("openai_model", settings.openaiModel);
  if (settings.geminiKey !== undefined) localStorage.setItem("gemini_api_key", settings.geminiKey);
  if (settings.geminiModel !== undefined) localStorage.setItem("gemini_model", settings.geminiModel);
}

function buildSystemPrompt(currentUnit?: CurriculumUnit | null, previousQAs?: QAItem[]): string {
  const unitContext = currentUnit
    ? `현재 학습 단원: ${currentUnit.subject}${currentUnit.category ? ` > ${currentUnit.category}` : ""} > ${currentUnit.unit} (${currentUnit.grade})`
    : "";

  return `당신은 고등학생의 공부를 도와주는 학습 도우미입니다.

[답변 규칙]
1. 질문에 대해 정확하고 직접적으로 답변하세요. "~를 중심으로 공부하세요" 같은 말은 하지 마세요.
2. 개념 설명, 풀이, 비교, 예시 등 질문이 원하는 형태로 바로 답해주세요.
3. 틀리기 쉽거나, 이후 일반선택·진로선택 과목에서도 계속 등장하는 핵심 용어나 개념은 ==용어== 형식으로 표시하세요.
4. 중요 키워드나 정의는 **굵게** 표시하세요.
5. 목록은 • 로 시작하는 줄로 정리하세요.
6. 한국어로 답변하세요.
7. 너무 길게 쓰지 말고 핵심만 명확하게 정리하세요.
${unitContext ? `\n[현재 학습 단원]\n${unitContext}` : ""}
${previousQAs && previousQAs.length > 0 ? `\n[이전 질문 맥락]\n${previousQAs.map((q) => `Q: ${q.question}`).join("\n")}` : ""}`;
}

async function callClaude(systemPrompt: string, question: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
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
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

async function callOpenAI(systemPrompt: string, question: string, apiKey: string, model: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGeminiOnce(systemPrompt: string, question: string, apiKey: string, model: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    const err = new Error(msg) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return data.candidates[0].content.parts[0].text;
}

async function callGemini(systemPrompt: string, question: string, apiKey: string, model: string): Promise<string> {
  // 순서대로 시도: 지정 모델 → gemini-2.0-flash → gemini-2.0-flash-lite
  const fallbacks = [model, "gemini-2.0-flash", "gemini-2.0-flash-lite"].filter(
    (m, i, arr) => arr.indexOf(m) === i
  );
  let lastErr: Error = new Error("Gemini 호출 실패");
  for (const m of fallbacks) {
    try {
      return await callGeminiOnce(systemPrompt, question, apiKey, m);
    } catch (e: any) {
      lastErr = e;
      if (e.status === 503 || e.status === 429) continue; // 과부하·할당량 → 다음 모델 시도
      // 키 오류 등 다른 에러는 바로 중단
      if (e.status === 400) throw new Error(`Gemini 요청 오류 (잘못된 키 또는 모델): ${e.message}`);
      if (e.status === 403) throw new Error(`Gemini 인증 실패 (키 확인 필요): ${e.message}`);
      throw new Error(`Gemini API 오류: ${e.message}`);
    }
  }
  throw new Error(`Gemini 모든 모델 응답 없음 (서버 과부하). 잠시 후 다시 시도해주세요. (${lastErr.message})`);
}

export async function askClaude(
  question: string,
  currentUnit?: CurriculumUnit | null,
  previousQAs?: QAItem[]
): Promise<string> {
  const settings = getAISettings();
  const systemPrompt = buildSystemPrompt(currentUnit, previousQAs);

  switch (settings.provider) {
    case "claude":
      if (!settings.claudeKey) throw new Error("Claude API 키가 없어요. 설정 탭에서 입력해주세요.");
      return await callClaude(systemPrompt, question, settings.claudeKey);
    case "openai":
      if (!settings.openaiKey) throw new Error("OpenAI API 키가 없어요. 설정 탭에서 입력해주세요.");
      return await callOpenAI(systemPrompt, question, settings.openaiKey, settings.openaiModel);
    case "gemini":
      if (!settings.geminiKey) throw new Error("Gemini API 키가 없어요. 설정 탭에서 입력해주세요.");
      return await callGemini(systemPrompt, question, settings.geminiKey, settings.geminiModel);
    default:
      throw new Error("Unknown provider");
  }
}

function generateMockAnswer(question: string, unit?: CurriculumUnit | null): string {
  const q = question.toLowerCase();

  if (unit?.category === "언어" || q.includes("형태소") || q.includes("음운")) {
    if (q.includes("형태소")) {
      return `**형태소**란 의미를 가지는 가장 작은 언어 단위입니다.\n\n• **자립형태소**: 혼자 쓰일 수 있음 → 하늘, 밥, 예쁘\n• **의존형태소**: 혼자 쓰일 수 없음 → -이, -가, -었-, -다\n• **실질형태소**: 구체적 의미를 가짐 → 밥, 먹, 크\n• **형식형태소**: 문법적 기능만 함 → 조사, 어미, 접사\n\n예) "학생이 밥을 먹었다"\n→ 학생/이/밥/을/먹/었/다 (7개)\n\n==형식형태소==와 ==의존형태소==는 서로 다른 기준의 분류예요!`;
    }
    if (q.includes("음운변동") || q.includes("음운 변동")) {
      return `**음운 변동**은 음운이 환경에 따라 바뀌는 현상입니다.\n\n• **교체**: 한 음운 → 다른 음운\n  - ==자음동화==: 국물[궁물], 신라[실라]\n  - ==구개음화==: 굳이[구지], 해돋이[해도지]\n• **탈락**: 음운이 없어짐 → 닭[닥], 흙[흑]\n• **첨가**: 음운이 생김 → 솜이불[솜니불] (==ㄴ첨가==)\n• **축약**: 두 음운 → 하나 → 좋고[조코] (==격음화==)`;
    }
  }

  if (unit?.subject === "수학" || q.includes("판별식") || q.includes("함수") || q.includes("방정식")) {
    if (q.includes("판별식")) {
      return `**판별식 D = b² - 4ac**\n\n이차방정식 ax²+bx+c=0에서:\n• **D > 0**: 서로 다른 두 실근\n• **D = 0**: 중근\n• **D < 0**: 서로 다른 두 허근\n\n예) x²-5x+6=0 → D=25-24=1>0 → 두 실근\n\n==판별식==은 ==이차함수==의 그래프와 x축의 교점 수와 대응돼요.`;
    }
  }

  if (unit?.subject === "과학") {
    return `**[통합과학 · ${unit?.unit || ""}]** ${question}\n\n• 핵심 개념: ==${unit?.keyConcepts[0] || ""}==\n• ${unit?.keyPoints[0] || ""}\n• ${unit?.keyPoints[1] || ""}\n\n이 개념은 이후 ==물리학==, ==화학==, ==생명과학==, ==지구과학== 선택과목에서 심화됩니다.`;
  }

  if (unit?.subject === "사회") {
    return `**[${unit?.category || "사회"}]** ${question}\n\n• 핵심 개념: ==${unit?.keyConcepts[0] || ""}==, ==${unit?.keyConcepts[1] || ""}==\n• ${unit?.keyPoints[0] || ""}\n• ${unit?.keyPoints[1] || ""}\n\n⚙️ **API 키를 설정하면 실제 AI 답변을 받을 수 있어요** (설정 탭)`;
  }

  return `**${question}**에 대해 답변합니다.\n\n질문하신 내용을 분석 중이에요.\n\n• 개념의 정의를 먼저 파악하세요\n• 구체적인 예시로 이해를 확인하세요\n• 관련 개념과의 차이점도 정리하세요\n\n⚙️ **설정 탭에서 AI API 키를 설정하면 정확한 답변을 받을 수 있어요**`;
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
  if (existingQAs) newItem.relatedIds = findRelatedQAs(newItem, existingQAs);
  return newItem;
}
