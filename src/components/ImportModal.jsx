import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { importFlow, createEdgeStyle } from '../store/flowSlice';
import { setShowImport, showToast, clearToast } from '../store/uiSlice';

export default function ImportModal() {
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const handleClose = () => dispatch(setShowImport(false));

  const handleImport = () => {
    try {
      const data = JSON.parse(text);
      if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error('Invalid schema: missing "nodes" array');
      }

      const rfNodes = data.nodes.map((n, i) => ({
        id: n.id || `node_${i}`,
        type: 'flowNode',
        position: { x: 100 + (i % 4) * 240, y: 100 + Math.floor(i / 4) * 160 },
        data: {
          prompt: n.prompt || n.id || 'Node',
          description: n.description || '',
        },
      }));

      const rfEdges = [];
      data.nodes.forEach((n) => {
        (n.edges || []).forEach((e) => {
          rfEdges.push({
            id: `${n.id}-${e.to_node_id}-${Date.now()}-${Math.random()}`,
            source: n.id,
            target: e.to_node_id,
            ...createEdgeStyle(e.condition || ''),
            data: {
              condition: e.condition || '',
              ...(e.parameters && Object.keys(e.parameters).length > 0
                ? { parameters: e.parameters }
                : {}),
            },
          });
        });
      });

      dispatch(importFlow({
        nodes: rfNodes,
        edges: rfEdges,
        startNodeId: data.start_node_id || rfNodes[0]?.id || '',
      }));
      dispatch(setShowImport(false));
      dispatch(showToast({ msg: 'Flow imported successfully!', type: 'success' }));
      setTimeout(() => dispatch(clearToast()), 2500);
    } catch (err) {
      dispatch(showToast({ msg: 'Invalid JSON: ' + err.message, type: 'error' }));
      setTimeout(() => dispatch(clearToast()), 2500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 16,
          padding: 28,
          width: 520,
          maxHeight: '80vh',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>Import Flow JSON</h3>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
          Paste your flow JSON schema below to reconstruct the flow on canvas.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'{"start_node_id": "...", "nodes": [...]}'}
          style={{
            width: '100%',
            height: 220,
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            color: 'var(--text-primary)',
            padding: 14,
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
          <button onClick={handleClose} style={cancelStyle}>Cancel</button>
          <button onClick={handleImport} style={submitStyle}>Import</button>
        </div>
      </div>
    </div>
  );
}

const cancelStyle = {
  padding: '9px 20px',
  borderRadius: 8,
  border: '1px solid var(--border-subtle)',
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'inherit',
};

const submitStyle = {
  padding: '9px 20px',
  borderRadius: 8,
  border: 'none',
  background: 'var(--accent)',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'inherit',
};
