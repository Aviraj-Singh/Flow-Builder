import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import FlowNode from './FlowNode';
import {
  onNodesChange,
  onEdgesChange,
  onConnect,
  setSelectedNode,
  deleteNode,
} from '../store/flowSlice';
import { selectNodes, selectEdges, selectSelectedNodeId } from '../store/selectors';

export default function FlowCanvas() {
  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const selectedNodeId = useSelector(selectSelectedNodeId);

  const nodeTypes = useMemo(() => ({ flowNode: FlowNode }), []);

  const handleNodesChange = useCallback(
    (changes) => dispatch(onNodesChange(changes)),
    [dispatch]
  );

  const handleEdgesChange = useCallback(
    (changes) => dispatch(onEdgesChange(changes)),
    [dispatch]
  );

  const handleConnect = useCallback(
    (connection) => dispatch(onConnect(connection)),
    [dispatch]
  );

  const handleNodeClick = useCallback(
    (_event, node) => dispatch(setSelectedNode(node.id)),
    [dispatch]
  );

  const handlePaneClick = useCallback(
    () => dispatch(setSelectedNode(null)),
    [dispatch]
  );

  useEffect(() => {
    const handler = (e) => {
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedNodeId &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
      ) {
        e.preventDefault();
        dispatch(deleteNode(selectedNodeId));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId, dispatch]);

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '6 4' }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
          markerEnd: { type: 'arrowclosed', color: '#6366f1' },
        }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--bg-primary)' }}
      >
        <Background
          variant="dots"
          gap={24}
          size={1}
          color="#1e2130"
        />
        <Controls
          showInteractive={false}
          position="bottom-left"
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === selectedNodeId) return '#6366f1';
            return '#2a2d3a';
          }}
          maskColor="rgba(15, 17, 23, 0.7)"
          style={{ borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}
