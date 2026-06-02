import { QAItem, CurriculumUnit } from "../types";
import { Node, Edge } from "reactflow";

const NODE_COLORS = {
  qa: { bg: "#f0e6ff", border: "#c9a8e8", text: "#6b21a8" },
  unit: { bg: "#e3f2fd", border: "#90caf9", text: "#1565c0" },
  concept: { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32" },
  root: { bg: "#fce4ec", border: "#f48fb1", text: "#880e4f" },
  bookmarked: { bg: "#fff9e6", border: "#ffd54f", text: "#f57f17" },
};

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
  } else if (filter.viewMode === "unit" && filter.selectedUnitId) {
    filteredQAs = qaItems.filter((qa) => qa.unitId === filter.selectedUnitId);
  }

  if (filteredQAs.length === 0 && !currentUnit) {
    return { nodes: [], edges: [] };
  }

  // Root node
  const rootId = "root";
  nodes.push({
    id: rootId,
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      label: "📚 내 질문들",
      type: "root",
      colors: NODE_COLORS.root,
      count: filteredQAs.length,
    },
  });

  // Unit node if current unit exists
  if (currentUnit) {
    const unitId = `unit-${currentUnit.id}`;
    nodes.push({
      id: unitId,
      type: "custom",
      position: { x: -350, y: 0 },
      data: {
        label: `📖 ${currentUnit.unit}`,
        type: "unit",
        unit: currentUnit,
        colors: NODE_COLORS.unit,
      },
    });
    edges.push({
      id: `e-root-${unitId}`,
      source: rootId,
      target: unitId,
      type: "smoothstep",
      style: { stroke: "#90caf9", strokeWidth: 2, strokeDasharray: "5,5" },
      animated: true,
    });

    // Key concept nodes
    currentUnit.keyConcepts.slice(0, 4).forEach((concept, idx) => {
      const angle = (idx / 4) * Math.PI - Math.PI / 2;
      const conceptId = `concept-${idx}`;
      nodes.push({
        id: conceptId,
        type: "custom",
        position: {
          x: -350 + Math.cos(angle) * 200,
          y: Math.sin(angle) * 150,
        },
        data: {
          label: concept,
          type: "concept",
          colors: NODE_COLORS.concept,
        },
      });
      edges.push({
        id: `e-unit-${conceptId}`,
        source: unitId,
        target: conceptId,
        type: "smoothstep",
        style: { stroke: "#a5d6a7", strokeWidth: 1.5 },
      });
    });
  }

  // QA nodes in circular/radial layout
  const angleStep = (2 * Math.PI) / Math.max(filteredQAs.length, 1);
  const radius = Math.max(250, filteredQAs.length * 40);

  filteredQAs.forEach((qa, idx) => {
    const angle = idx * angleStep - Math.PI / 2;
    const r = radius + (idx % 2 === 0 ? 0 : 60);
    const qaId = `qa-${qa.id}`;
    const colors = qa.isBookmarked ? NODE_COLORS.bookmarked : NODE_COLORS.qa;

    nodes.push({
      id: qaId,
      type: "custom",
      position: {
        x: 200 + Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      },
      data: {
        label: qa.question.length > 30 ? qa.question.slice(0, 30) + "…" : qa.question,
        type: "qa",
        qa,
        colors,
        isBookmarked: qa.isBookmarked,
      },
    });

    edges.push({
      id: `e-root-${qaId}`,
      source: rootId,
      target: qaId,
      type: "smoothstep",
      style: { stroke: "#c9a8e8", strokeWidth: 2 },
    });

    // Related edges
    qa.relatedIds.forEach((relId) => {
      const relNodeId = `qa-${relId}`;
      const edgeId = `e-related-${qa.id}-${relId}`;
      const exists = edges.find(
        (e) => e.id === edgeId || e.id === `e-related-${relId}-${qa.id}`
      );
      if (!exists && filteredQAs.find((q) => q.id === relId)) {
        edges.push({
          id: edgeId,
          source: qaId,
          target: relNodeId,
          type: "smoothstep",
          style: { stroke: "#f48fb1", strokeWidth: 1.5, strokeDasharray: "4,4" },
          label: "연관",
          labelStyle: { fontSize: 10, fill: "#f48fb1" },
        });
      }
    });
  });

  return { nodes, edges };
}
