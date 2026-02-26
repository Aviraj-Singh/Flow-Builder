import { createSlice } from '@reduxjs/toolkit';
import { applyNodeChanges, applyEdgeChanges, addEdge as rfAddEdge } from 'reactflow';

const initialNodes = [
  {
    id: 'start',
    type: 'flowNode',
    position: { x: 100, y: 180 },
    data: { prompt: 'Start Node', description: 'Entry point of the flow' },
  },
  {
    id: 'process',
    type: 'flowNode',
    position: { x: 460, y: 80 },
    data: { prompt: 'Process Node', description: 'Process the input data' },
  },
  {
    id: 'end',
    type: 'flowNode',
    position: { x: 800, y: 180 },
    data: { prompt: 'End Node', description: 'Final step of the flow' },
  },
];

const initialEdges = [
  {
    id: 'start-process',
    source: 'start',
    target: 'process',
    label: 'always',
    type: 'smoothstep',
    animated: true,
    data: { condition: 'always' },
    style: { stroke: '#6366f1', strokeWidth: 2 },
    labelStyle: { fill: '#a5b4fc', fontWeight: 500, fontSize: 11 },
    labelBgStyle: { fill: '#1a1d27', stroke: '#2a2d3a' },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 6,
    markerEnd: { type: 'arrowclosed', color: '#6366f1' },
  },
  {
    id: 'process-end',
    source: 'process',
    target: 'end',
    label: 'success',
    type: 'smoothstep',
    animated: true,
    data: { condition: 'success' },
    style: { stroke: '#6366f1', strokeWidth: 2 },
    labelStyle: { fill: '#a5b4fc', fontWeight: 500, fontSize: 11 },
    labelBgStyle: { fill: '#1a1d27', stroke: '#2a2d3a' },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 6,
    markerEnd: { type: 'arrowclosed', color: '#6366f1' },
  },
];

export const createEdgeStyle = (condition = '') => ({
  type: 'smoothstep',
  animated: true,
  label: condition,
  data: { condition },
  style: { stroke: '#6366f1', strokeWidth: 2 },
  labelStyle: { fill: '#a5b4fc', fontWeight: 500, fontSize: 11 },
  labelBgStyle: { fill: '#1a1d27', stroke: '#2a2d3a' },
  labelBgPadding: [6, 4],
  labelBgBorderRadius: 6,
  markerEnd: { type: 'arrowclosed', color: '#6366f1' },
});

const genNodeId = () => 'node_' + Math.random().toString(36).slice(2, 8);
const genEdgeId = (source, target) => `${source}-${target}-${Date.now()}`;

const flowSlice = createSlice({
  name: 'flow',
  initialState: {
    nodes: initialNodes,
    edges: initialEdges,
    startNodeId: 'start',
    selectedNodeId: null,
  },
  reducers: {
    // React Flow callbacks
    onNodesChange(state, action) {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    onEdgesChange(state, action) {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    onConnect(state, action) {
      const connection = action.payload;
      const edge = {
        ...connection,
        id: genEdgeId(connection.source, connection.target),
        ...createEdgeStyle(''),
      };
      state.edges = rfAddEdge(edge, state.edges);
    },

    // Node CRUD
    addNode(state) {
      const id = genNodeId();
      state.nodes.push({
        id,
        type: 'flowNode',
        position: { x: 300 + Math.random() * 80 - 40, y: 200 + Math.random() * 80 - 40 },
        data: { prompt: 'New Node', description: '' },
      });
      state.selectedNodeId = id;
    },
    deleteNode(state, action) {
      const id = action.payload;
      state.nodes = state.nodes.filter((n) => n.id !== id);
      state.edges = state.edges.filter((e) => e.source !== id && e.target !== id);
      if (state.selectedNodeId === id) state.selectedNodeId = null;
      if (state.startNodeId === id) state.startNodeId = '';
    },
    updateNodeData(state, action) {
      const { id, data } = action.payload;
      const node = state.nodes.find((n) => n.id === id);
      if (node) {
        node.data = { ...node.data, ...data };
      }
    },
    renameNodeId(state, action) {
      const { oldId, newId } = action.payload;
      const trimmed = newId.trim();
      if (!trimmed) return;
      if (trimmed !== oldId && state.nodes.some((n) => n.id === trimmed)) return;

      // Update the node ID
      const node = state.nodes.find((n) => n.id === oldId);
      if (node) node.id = trimmed;

      // Update all edge source/target references
      state.edges.forEach((e) => {
        if (e.source === oldId) e.source = trimmed;
        if (e.target === oldId) e.target = trimmed;
      });

      // Update start node reference
      if (state.startNodeId === oldId) state.startNodeId = trimmed;
      if (state.selectedNodeId === oldId) state.selectedNodeId = trimmed;
    },

    // Selection
    setSelectedNode(state, action) {
      state.selectedNodeId = action.payload;
    },

    // Start node
    setStartNodeId(state, action) {
      state.startNodeId = action.payload;
    },

    // Edge CRUD from sidebar
    addEdgeFromSidebar(state, action) {
      const { sourceId, targetId, condition } = action.payload;
      if (!targetId) return;
      const id = genEdgeId(sourceId, targetId);
      state.edges.push({
        id,
        source: sourceId,
        target: targetId,
        ...createEdgeStyle(condition || ''),
      });
    },
    updateEdgeCondition(state, action) {
      const { edgeId, condition } = action.payload;
      const edge = state.edges.find((e) => e.id === edgeId);
      if (edge) {
        edge.data = { ...edge.data, condition };
        edge.label = condition;
      }
    },
    updateEdgeTarget(state, action) {
      const { edgeId, newTarget } = action.payload;
      const edge = state.edges.find((e) => e.id === edgeId);
      if (edge) {
        edge.target = newTarget;
      }
    },
    removeEdge(state, action) {
      state.edges = state.edges.filter((e) => e.id !== action.payload);
    },

    // Edge parameters
    addEdgeParam(state, action) {
      const { edgeId } = action.payload;
      const edge = state.edges.find((e) => e.id === edgeId);
      if (edge) {
        if (!edge.data.parameters) edge.data.parameters = {};
        edge.data.parameters[''] = '';
      }
    },
    updateEdgeParam(state, action) {
      const { edgeId, oldKey, newKey, newVal } = action.payload;
      const edge = state.edges.find((e) => e.id === edgeId);
      if (edge && edge.data.parameters) {
        if (oldKey !== newKey) delete edge.data.parameters[oldKey];
        edge.data.parameters[newKey] = newVal;
      }
    },
    removeEdgeParam(state, action) {
      const { edgeId, key } = action.payload;
      const edge = state.edges.find((e) => e.id === edgeId);
      if (edge && edge.data.parameters) {
        delete edge.data.parameters[key];
        if (Object.keys(edge.data.parameters).length === 0) {
          delete edge.data.parameters;
        }
      }
    },

    // Import
    importFlow(state, action) {
      const { nodes, edges, startNodeId } = action.payload;
      state.nodes = nodes;
      state.edges = edges;
      state.startNodeId = startNodeId;
      state.selectedNodeId = null;
    },
  },
});

export const {
  onNodesChange,
  onEdgesChange,
  onConnect,
  addNode,
  deleteNode,
  updateNodeData,
  renameNodeId,
  setSelectedNode,
  setStartNodeId,
  addEdgeFromSidebar,
  updateEdgeCondition,
  updateEdgeTarget,
  removeEdge,
  addEdgeParam,
  updateEdgeParam,
  removeEdgeParam,
  importFlow,
} = flowSlice.actions;

export default flowSlice.reducer;
