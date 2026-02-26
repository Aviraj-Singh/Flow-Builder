import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteNode,
  updateNodeData,
  renameNodeId,
  setStartNodeId,
  addEdgeFromSidebar,
  updateEdgeCondition,
  updateEdgeTarget,
  removeEdge,
  addEdgeParam,
  updateEdgeParam,
  removeEdgeParam,
} from '../store/flowSlice';
import {
  selectNodes,
  selectEdges,
  selectSelectedNode,
  selectSelectedNodeId,
  selectStartNodeId,
  selectErrors,
} from '../store/selectors';

export default function Sidebar() {
  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const edges = useSelector(selectEdges);
  const selectedNode = useSelector(selectSelectedNode);
  const selectedId = useSelector(selectSelectedNodeId);
  const startNodeId = useSelector(selectStartNodeId);
  const errors = useSelector(selectErrors);

  const nodeErrors = selectedId ? errors[selectedId] || [] : [];
  const outgoingEdges = edges.filter((e) => e.source === selectedId);

  return (
    <div
      style={{
        width: 320,
        borderLeft: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {selectedNode ? (
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Edit Node</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {startNodeId !== selectedId && (
                  <SmallBtn color="var(--success)" onClick={() => dispatch(setStartNodeId(selectedId))}>
                    Set Start
                  </SmallBtn>
                )}
                <SmallBtn color="var(--error)" onClick={() => dispatch(deleteNode(selectedId))}>
                  Delete
                </SmallBtn>
              </div>
            </div>

            {nodeErrors.length > 0 && (
              <div style={{ marginBottom: 14, padding: '8px 12px', borderRadius: 8, background: 'var(--error-bg)', border: '1px solid var(--error-border)' }}>
                {nodeErrors.map((err, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--error-light)', lineHeight: 1.5 }}>• {err}</div>
                ))}
              </div>
            )}

            <Label>Node ID</Label>
            <Input
              value={selectedNode.id}
              onChange={(e) =>
                dispatch(renameNodeId({ oldId: selectedNode.id, newId: e.target.value }))
              }
              placeholder="Unique node ID"
            />

            <Label style={{ marginTop: 12 }}>Name</Label>
            <Input
              value={selectedNode.data.prompt}
              onChange={(e) =>
                dispatch(updateNodeData({ id: selectedId, data: { prompt: e.target.value } }))
              }
              placeholder="Node name"
            />

            <Label style={{ marginTop: 12 }}>Description</Label>
            <textarea
              value={selectedNode.data.description}
              onChange={(e) =>
                dispatch(updateNodeData({ id: selectedId, data: { description: e.target.value } }))
              }
              placeholder="Node description (required)"
              style={{ ...inputStyle, height: 64, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ padding: '14px 20px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Outgoing Edges</span>
              <SmallBtn
                color="var(--accent)"
                onClick={() =>
                  dispatch(addEdgeFromSidebar({ sourceId: selectedId, targetId: '', condition: '' }))
                }
              >
                + Edge
              </SmallBtn>
            </div>

            {outgoingEdges.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', padding: 16 }}>
                No outgoing edges yet. Add one or drag from the purple output handle on the canvas.
              </div>
            )}

            {outgoingEdges.map((edge, idx) => (
              <EdgeCard
                key={edge.id}
                edge={edge}
                index={idx}
                nodes={nodes}
                selectedId={selectedId}
                dispatch={dispatch}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 32, textAlign: 'center', color: 'var(--text-dim)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>
            ☰
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>No node selected</div>
          <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
            Click a node on the canvas to edit it. Drag from the right handle to connect nodes.
          </div>
        </div>
      )}

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-input)' }}>
        <Label style={{ marginBottom: 6 }}>Start Node</Label>
        <select
          value={startNodeId}
          onChange={(e) => dispatch(setStartNodeId(e.target.value))}
          style={{ ...inputStyle, appearance: 'auto' }}
        >
          <option value="">Select start node…</option>
          {nodes.map((n) => (
            <option key={n.id} value={n.id}>
              {n.data.prompt} ({n.id})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function EdgeCard({ edge, index, nodes, selectedId, dispatch }) {
  const params = edge.data?.parameters;

  return (
    <div style={{ padding: 12, marginBottom: 10, borderRadius: 10, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', animation: 'slideIn 0.15s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>Edge {index + 1}</span>
        <button onClick={() => dispatch(removeEdge(edge.id))} style={closeBtnStyle}>×</button>
      </div>

      <Label>Target Node</Label>
      <select
        value={edge.target}
        onChange={(e) => dispatch(updateEdgeTarget({ edgeId: edge.id, newTarget: e.target.value }))}
        style={{ ...inputStyle, appearance: 'auto' }}
      >
        <option value="">Select target…</option>
        {nodes
          .filter((n) => n.id !== selectedId)
          .map((n) => (
            <option key={n.id} value={n.id}>
              {n.data.prompt} ({n.id})
            </option>
          ))}
      </select>

      <Label style={{ marginTop: 8 }}>Condition</Label>
      <Input
        value={edge.data?.condition || ''}
        onChange={(e) => dispatch(updateEdgeCondition({ edgeId: edge.id, condition: e.target.value }))}
        placeholder='e.g., success, age > 18'
      />

      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Parameters
          </span>
          <button
            onClick={() => dispatch(addEdgeParam({ edgeId: edge.id }))}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}
          >
            + Add
          </button>
        </div>

        {params &&
          Object.entries(params).map(([key, val], pi) => (
            <div key={pi} style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'center' }}>
              <input
                value={key}
                onChange={(e) =>
                  dispatch(updateEdgeParam({ edgeId: edge.id, oldKey: key, newKey: e.target.value, newVal: val }))
                }
                placeholder="key"
                style={{ ...inputStyle, flex: 1, fontSize: 11, padding: '4px 8px' }}
              />
              <input
                value={val}
                onChange={(e) =>
                  dispatch(updateEdgeParam({ edgeId: edge.id, oldKey: key, newKey: key, newVal: e.target.value }))
                }
                placeholder="value"
                style={{ ...inputStyle, flex: 1, fontSize: 11, padding: '4px 8px' }}
              />
              <button
                onClick={() => dispatch(removeEdgeParam({ edgeId: edge.id, key }))}
                style={closeBtnStyle}
              >
                ×
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

function Label({ children, style }) {
  return (
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em', ...style }}>
      {children}
    </label>
  );
}

function Input({ style, ...props }) {
  return <input style={{ ...inputStyle, ...style }} {...props} />;
}

function SmallBtn({ children, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: 'none', background: color, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
    >
      {children}
    </button>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--error)',
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  padding: 0,
};
