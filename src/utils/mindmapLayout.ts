import { QAItem, CurriculumUnit } from "../types";
import { CURRICULUM_DATA } from "../store/appStore";
import { Node, Edge } from "reactflow";

const SUBJECT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  수학: { bg: "#e3f2fd", border: "#90caf9", text: "#1565c0" },
  영어: { bg: "#fff9e6", border: "#ffd54f", text: "#b45309" },
  국어: { bg: "#f0e6ff", border: "#c9a8e8", text: "#6b21a8" },
  과학: { bg: "#e0f7f0", border: "#80cbc4", text: "#00695c" },
  사회: { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32" },
  default: { bg: "#fce4ec", border: "#f48fb1", text: "#880e4f" },
};

const COLORS = {
  root: { bg: "#fce4ec", border: "#f48fb1", text: "#880e4f" },
  concept: { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32" },
  bookmarked: { bg: "#fff9e6", border: "#ffd54f", text: "#f57f17" },
  uncat: { bg: "#f5f5f5", border: "#bdbdbd", text: "#616161" },
};

function findUnitById(unitId: string): CurriculumUnit | null {
  for (const units of Object.values(CURRICULUM_DATA)) {
    const found = units.find((u) => u.id === unitId);
    if (found) return found;
  }
  return null;
}

export function buildMindMapNodes(
  qaItems: QAItem[],
  currentUnit: CurriculumUnit | null,
  filter: { viewMode: string; selectedUnitId?: string }
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let filteredQAs = qaItems;
  if (filter.viewMode === "unit" && currentUnit) {
    filteredQAs = qaItems.filter((qa) => qa.unitId === currentUnit.id);
  } else if (filter.viewMode === "my-qa") {
    filteredQAs = qaItems.filter((qa) => qa.isBookmarked);
  }

  // Group QAs by unitId
  const unitMap = new Map<string, QAItem[]>();
  const uncatQAs: QAItem[] = [];

  filteredQAs.forEach((qa) => {
    if (qa.unitId) {
      if (!unitMap.has(qa.unitId)) unitMap.set(qa.unitId, []);
      unitMap.get(qa.unitId)!.push(qa);
    } else {
      uncatQAs.push(qa);
    }
  });

  // Always show current unit even if no QAs yet
  if (currentUnit && !unitMap.has(currentUnit.id)) {
    unitMap.set(currentUnit.id, []);
  }

  const totalGroups = unitMap.size + (uncatQAs.length > 0 ? 1 : 0);

  if (totalGroups === 0) return { nodes: [], edges: [] };

  // Root
  nodes.push({
    id: "root",
    type: "custom",
    position: { x: 0, y: 0 },
    data: { label: "📚 내 질문들", type: "root", colors: COLORS.root, count: filteredQAs.length },
  });

  const groupRadius = Math.max(380, totalGroups * 90);
  const groupAngleStep = (2 * Math.PI) / Math.max(totalGroups, 1);
  let groupIdx = 0;

  for (const [unitId, qas] of Array.from(unitMap.entries())) {
    const unit = findUnitById(unitId) ?? (currentUnit?.id === unitId ? currentUnit : null);
    if (!unit) continue;

    const sc = SUBJECT_COLORS[unit.subject] ?? SUBJECT_COLORS.default;
    const ga = groupIdx * groupAngleStep - Math.PI / 2;
    const gx = Math.cos(ga) * groupRadius;
    const gy = Math.sin(ga) * groupRadius;
    const gid = `unit-${unitId}`;

    nodes.push({
      id: gid,
      type: "custom",
      position: { x: gx, y: gy },
      data: {
        label: unit.category ? `📂 ${unit.category} · ${unit.unit}` : `📖 ${unit.unit}`,
        sublabel: unit.subject,
        type: "unit",
        unit,
        colors: sc,
        qaCount: qas.length,
        isCurrentUnit: currentUnit?.id === unitId,
      },
    });

    edges.push({
      id: `e-root-${gid}`,
      source: "root",
      target: gid,
      type: "smoothstep",
      animated: currentUnit?.id === unitId,
      style: { stroke: sc.border, strokeWidth: 2, strokeDasharray: currentUnit?.id === unitId ? undefined : "6,3" },
    });

    // Concept nodes (always for current unit, otherwise only if ≤2 groups)
    if (unit.id === currentUnit?.id || unitMap.size <= 2) {
      unit.keyConcepts.slice(0, 4).forEach((concept, ci) => {
        const ca = ga + ((ci - 1.5) * Math.PI) / 6;
        const cid = `concept-${unitId}-${ci}`;
        nodes.push({
          id: cid,
          type: "custom",
          position: { x: gx + Math.cos(ca) * 170, y: gy + Math.sin(ca) * 130 },
          data: { label: concept, type: "concept", colors: COLORS.concept },
        });
        edges.push({
          id: `e-${gid}-${cid}`,
          source: gid,
          target: cid,
          style: { stroke: "#a5d6a7", strokeWidth: 1.5 },
        });
      });
    }

    // QA nodes fanned out from unit group
    if (qas.length > 0) {
      const qaSpread = Math.min(Math.PI * 1.2, qas.length * 0.4);
      const qaAngleStep = qas.length > 1 ? qaSpread / (qas.length - 1) : 0;
      const qaStartAngle = ga - qaSpread / 2;
      const qaRadius = Math.max(200, qas.length * 38);

      qas.forEach((qa, qi) => {
        const qAngle = qaStartAngle + qi * qaAngleStep;
        const qaId = `qa-${qa.id}`;
        const colors = qa.isBookmarked ? COLORS.bookmarked : sc;

        nodes.push({
          id: qaId,
          type: "custom",
          position: { x: gx + Math.cos(qAngle) * qaRadius, y: gy + Math.sin(qAngle) * qaRadius },
          data: {
            label: qa.question.length > 28 ? qa.question.slice(0, 28) + "…" : qa.question,
            type: "qa",
            qa,
            colors,
            isBookmarked: qa.isBookmarked,
          },
        });

        edges.push({
          id: `e-${gid}-${qaId}`,
          source: gid,
          target: qaId,
          type: "smoothstep",
          style: { stroke: sc.border, strokeWidth: 1.5 },
        });

        qa.relatedIds.forEach((relId) => {
          const relNodeId = `qa-${relId}`;
          const eid = `e-rel-${qa.id}-${relId}`;
          const exists = edges.find((e) => e.id === eid || e.id === `e-rel-${relId}-${qa.id}`);
          if (!exists && filteredQAs.find((q) => q.id === relId)) {
            edges.push({
              id: eid,
              source: qaId,
              target: relNodeId,
              type: "smoothstep",
              style: { stroke: "#f48fb1", strokeWidth: 1, strokeDasharray: "4,4" },
            });
          }
        });
      });
    }

    groupIdx++;
  }

  // Uncategorized
  if (uncatQAs.length > 0) {
    const ua = groupIdx * groupAngleStep - Math.PI / 2;
    const ux = Math.cos(ua) * groupRadius;
    const uy = Math.sin(ua) * groupRadius;
    const uid = "unit-uncat";

    nodes.push({
      id: uid,
      type: "custom",
      position: { x: ux, y: uy },
      data: { label: "📝 기타 질문", type: "unit", colors: COLORS.uncat, qaCount: uncatQAs.length },
    });
    edges.push({
      id: `e-root-${uid}`,
      source: "root",
      target: uid,
      style: { stroke: "#bdbdbd", strokeWidth: 1.5, strokeDasharray: "4,4" },
    });

    const spread = Math.min(Math.PI * 1.2, uncatQAs.length * 0.4);
    const step = uncatQAs.length > 1 ? spread / (uncatQAs.length - 1) : 0;
    uncatQAs.forEach((qa, qi) => {
      const qAngle = ua - spread / 2 + qi * step;
      const qaId = `qa-${qa.id}`;
      const colors = qa.isBookmarked ? COLORS.bookmarked : COLORS.uncat;
      nodes.push({
        id: qaId,
        type: "custom",
        position: { x: ux + Math.cos(qAngle) * 170, y: uy + Math.sin(qAngle) * 130 },
        data: { label: qa.question.length > 28 ? qa.question.slice(0, 28) + "…" : qa.question, type: "qa", qa, colors, isBookmarked: qa.isBookmarked },
      });
      edges.push({ id: `e-${uid}-${qaId}`, source: uid, target: qaId, style: { stroke: "#bdbdbd", strokeWidth: 1.5 } });
    });
  }

  return { nodes, edges };
}
