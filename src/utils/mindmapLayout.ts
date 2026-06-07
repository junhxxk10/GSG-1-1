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

// Horizontal tree layout constants
const UNIT_X = 480;
const QA_X = 900;
const CONCEPT_X = 710;
const UNIT_GAP_Y = 260;
const QA_GAP_Y = 95;
const CONCEPT_GAP_Y = 58;

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

  // Compute vertical center positions for each group
  // Each group's height = max of (UNIT_GAP_Y, qas.length * QA_GAP_Y + 60)
  const groupEntries = Array.from(unitMap.entries());
  const groupHeights = groupEntries.map(([, qas]) =>
    Math.max(UNIT_GAP_Y, qas.length * QA_GAP_Y + 60)
  );
  if (uncatQAs.length > 0) {
    groupHeights.push(Math.max(UNIT_GAP_Y, uncatQAs.length * QA_GAP_Y + 60));
  }

  const totalHeight = groupHeights.reduce((a, b) => a + b, 0);
  let currentY = -totalHeight / 2;
  const groupCenterYs: number[] = groupHeights.map((h) => {
    const cy = currentY + h / 2;
    currentY += h;
    return cy;
  });

  // Root node — vertically centered
  nodes.push({
    id: "root",
    type: "custom",
    position: { x: 0, y: 0 },
    data: { label: "📚 내 질문들", type: "root", colors: COLORS.root, count: filteredQAs.length },
  });

  // Unit group nodes
  groupEntries.forEach(([unitId, qas], groupIdx) => {
    const unit = findUnitById(unitId) ?? (currentUnit?.id === unitId ? currentUnit : null);
    if (!unit) return;

    const sc = SUBJECT_COLORS[unit.subject] ?? SUBJECT_COLORS.default;
    const unitY = groupCenterYs[groupIdx];
    const gid = `unit-${unitId}`;

    nodes.push({
      id: gid,
      type: "custom",
      position: { x: UNIT_X, y: unitY },
      data: {
        label: unit.category ? `${unit.category}\n${unit.unit}` : `📖 ${unit.unit}`,
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
      style: {
        stroke: sc.border,
        strokeWidth: currentUnit?.id === unitId ? 3 : 2,
        strokeDasharray: currentUnit?.id === unitId ? undefined : "6,3",
      },
    });

    // Concept nodes (only for current unit or when ≤2 total groups)
    if (unit.id === currentUnit?.id || unitMap.size <= 2) {
      unit.keyConcepts.slice(0, 4).forEach((concept, ci) => {
        const cid = `concept-${unitId}-${ci}`;
        const conceptY = unitY + (ci - 1.5) * CONCEPT_GAP_Y;
        nodes.push({
          id: cid,
          type: "custom",
          position: { x: CONCEPT_X, y: conceptY },
          data: { label: concept, type: "concept", colors: COLORS.concept },
        });
        edges.push({
          id: `e-${gid}-${cid}`,
          source: gid,
          target: cid,
          type: "smoothstep",
          style: { stroke: "#a5d6a7", strokeWidth: 1.5 },
        });
      });
    }

    // QA nodes — spread vertically around the unit's y center
    if (qas.length > 0) {
      const qaStartY = unitY - ((qas.length - 1) / 2) * QA_GAP_Y;
      qas.forEach((qa, qi) => {
        const qaId = `qa-${qa.id}`;
        const colors = qa.isBookmarked ? COLORS.bookmarked : sc;
        nodes.push({
          id: qaId,
          type: "custom",
          position: { x: QA_X, y: qaStartY + qi * QA_GAP_Y },
          data: {
            label: qa.question.length > 32 ? qa.question.slice(0, 32) + "…" : qa.question,
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
  });

  // Uncategorized group
  if (uncatQAs.length > 0) {
    const uid = "unit-uncat";
    const uncatY = groupCenterYs[groupCenterYs.length - 1];

    nodes.push({
      id: uid,
      type: "custom",
      position: { x: UNIT_X, y: uncatY },
      data: { label: "📝 기타 질문", type: "unit", colors: COLORS.uncat, qaCount: uncatQAs.length },
    });
    edges.push({
      id: `e-root-${uid}`,
      source: "root",
      target: uid,
      type: "smoothstep",
      style: { stroke: "#bdbdbd", strokeWidth: 1.5, strokeDasharray: "4,4" },
    });

    const qaStartY = uncatY - ((uncatQAs.length - 1) / 2) * QA_GAP_Y;
    uncatQAs.forEach((qa, qi) => {
      const qaId = `qa-${qa.id}`;
      const colors = qa.isBookmarked ? COLORS.bookmarked : COLORS.uncat;
      nodes.push({
        id: qaId,
        type: "custom",
        position: { x: QA_X, y: qaStartY + qi * QA_GAP_Y },
        data: {
          label: qa.question.length > 32 ? qa.question.slice(0, 32) + "…" : qa.question,
          type: "qa",
          qa,
          colors,
          isBookmarked: qa.isBookmarked,
        },
      });
      edges.push({
        id: `e-${uid}-${qaId}`,
        source: uid,
        target: qaId,
        type: "smoothstep",
        style: { stroke: "#bdbdbd", strokeWidth: 1.5 },
      });
    });
  }

  return { nodes, edges };
}
