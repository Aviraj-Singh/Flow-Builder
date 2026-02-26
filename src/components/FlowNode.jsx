import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useSelector } from 'react-redux';
import { selectStartNodeId, selectErrors, selectSelectedNodeId } from '../store/selectors';

function FlowNode({ id, data }) {
  const startNodeId = useSelector(selectStartNodeId);
  const selectedNodeId = useSelector(selectSelectedNodeId);
  const errors = useSelector(selectErrors);

  const isStart = id === startNodeId;
  const isSelected = id === selectedNodeId;
  const hasError = !!errors[id];

  return (
    <div
      style={{
        width: 180,
        height: 72,
        borderRadius: 14,
        background: isSelected ? '#1e2130' : '#181b24',
        border: `2px solid ${
          hasError
            ? 'var(--error)'
            : isStart
            ? 'var(--success)'
            : isSelected
            ? 'var(--accent)'
            : 'var(--border-subtle)'
        }`,
        boxShadow: isSelected
          ? '0 0 0 3px var(--accent-glow)'
          : hasError
          ? '0 0 0 3px rgba(220,38,38,0.15)'
          : '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 14px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'grab',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {isStart && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: 12,
            padding: '2px 8px',
            borderRadius: 6,
            background: 'var(--success)',
            color: '#fff',
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Start
        </div>
      )}

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {data.prompt || id}
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          marginTop: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {id}
      </div>

      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--error)',
          }}
        />
      )}

      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 12,
          height: 12,
          background: 'var(--border-subtle)',
          border: '2px solid var(--bg-primary)',
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 12,
          height: 12,
          background: 'var(--accent)',
          border: '2px solid var(--bg-primary)',
        }}
      />
    </div>
  );
}

export default memo(FlowNode);
