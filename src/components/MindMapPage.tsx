import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  NodeProps,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { QAItem, CurriculumUnit, FilterSettings } from "../types";
import { buildMindMapNodes } from "../utils/mindmapLayout";
import QADetailModal from "./QADetailModal";

interface Props {
  qaItems: QAItem[];
  currentUnit: CurriculumUnit | null;
  filter: FilterSettings;
}

function CustomNode({ data }: NodeProps) {
  const colors = data.colors || { bg: "#f0e6ff", border: "#c9a8e8", text: "#6b21a8" };

  const icons: Record<string, string> = {
    root: "📚",
    qa: data.isBookmarked ? "⭐" : "💬",
    unit: data.isCurrentUnit ? "📖" : "📂",
    concept: "✨",
  };

  return (
    <div
      className="px-4 py-3 rounded-2xl cursor-pointer transition-all"
      style={{
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        color: colors.text,
        minWidth: data.type === "root" ? 150 : data.type === "unit" ? 190 : data.type === "concept" ? 110 : 160,
        maxWidth: data.type === "qa" ? 250 : data.type === "unit" ? 230 : 190,
        boxShadow: data.isCurrentUnit
          ? `0 0 0 3px ${colors.border}, 0 4px 16px rgba(0,0,0,0.1)`
          : "0 2px 12px rgba(139, 92, 246, 0.1)",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{icons[data.type] || "💡"}</span>
        <div className="min-w-0">
          <p className="text-xs font-semibold leading-snug break-words whitespace-pre-line" style={{ color: colors.text }}>
            {data.label}
          </p>
          {data.type === "root" && data.count !== undefined && (
            <p className="text-xs opacity-60 mt-0.5">{data.count}개의 질문</p>
          )}
          {data.type === "unit" && (
            <p className="text-xs opacity-60 mt-0.5">
              {data.qaCount !== undefined ? `${data.qaCount}개 질문` : ""}
              {data.sublabel ? ` · ${data.sublabel}` : ""}
            </p>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

export default function MindMapPage({ qaItems, currentUnit, filter }: Props) {
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<CurriculumUnit | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Re-build map whenever source data changes
  useEffect(() => {
    const { nodes: n, edges: e } = buildMindMapNodes(qaItems, currentUnit, filter);
    setNodes(n);
    setEdges(e);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qaItems, currentUnit, filter]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.data.type === "qa" && node.data.qa) setSelectedQA(node.data.qa);
    else if (node.data.type === "unit" && node.data.unit) setSelectedUnit(node.data.unit);
  }, []);

  if (qaItems.length === 0 && !currentUnit) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-pastel-lavender/30 to-white px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-purple-700 mb-2">마인드맵이 비어 있어요</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            AI에게 질문을 하면<br />이 곳에 마인드맵이 그려져요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* Status bar */}
      <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap">
        <div className="px-3 py-1.5 rounded-xl bg-white shadow-soft text-xs font-medium text-purple-600">
          {filter.viewMode === "all" ? "전체" : filter.viewMode === "unit" ? "단원별" : "즐겨찾기"}
          {" · "}{qaItems.length}개
        </div>
        {currentUnit && (
          <div className="px-3 py-1.5 rounded-xl shadow-soft text-xs font-medium text-blue-600"
            style={{ background: "#e3f2fd" }}>
            현재: {currentUnit.category ? `${currentUnit.category} > ` : ""}{currentUnit.unit}
          </div>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        className="bg-gradient-to-br from-pastel-lavender/20 to-pastel-mint/20"
      >
        <Background color="#e8d5f5" gap={24} size={1} />
        <Controls className="!shadow-soft !rounded-2xl" style={{ bottom: 16, right: 16, left: "auto" }} />
        <MiniMap
          className="!rounded-2xl !shadow-soft"
          nodeColor={(n) => n.data?.colors?.bg || "#f0e6ff"}
          style={{ bottom: 16, left: 16 }}
        />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-10 bg-white rounded-2xl shadow-soft p-3 text-xs space-y-1.5">
        <p className="font-semibold text-gray-500 mb-1">범례</p>
        {[
          { color: "#f48fb1", label: "루트" },
          { color: "#c9a8e8", label: "단원 그룹" },
          { color: "#a5d6a7", label: "핵심 개념" },
          { color: "#ffd54f", label: "즐겨찾기" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-gray-500">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-100">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-pink-300" />
          <span className="text-gray-400">연관 질문</span>
        </div>
      </div>

      {selectedQA && <QADetailModal qa={selectedQA} onClose={() => setSelectedQA(null)} />}

      {selectedUnit && (
        <div className="absolute inset-0 z-20 flex items-end justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-float p-6 pb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-medium text-blue-400">
                  {selectedUnit.subject}{selectedUnit.category ? ` · ${selectedUnit.category}` : ""} · {selectedUnit.grade}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{selectedUnit.unit}</h3>
              </div>
              <button onClick={() => setSelectedUnit(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 active:scale-95 text-sm">
                ✕
              </button>
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">핵심 포인트</p>
              <div className="flex flex-wrap gap-2">
                {selectedUnit.keyPoints.map((p, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl text-xs font-medium" style={{ background: "#e3f2fd", color: "#1565c0" }}>{p}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">핵심 개념</p>
              <div className="flex flex-wrap gap-2">
                {selectedUnit.keyConcepts.map((c, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl text-xs font-medium" style={{ background: "#e8f5e9", color: "#2e7d32" }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
