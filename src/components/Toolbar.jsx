import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNode } from '../store/flowSlice';
import { toggleJson, setShowImport, showToast, clearToast } from '../store/uiSlice';
import { selectJsonString, selectShowJson } from '../store/selectors';

export default function Toolbar() {
  const dispatch = useDispatch();
  const jsonStr = useSelector(selectJsonString);
  const showJson = useSelector(selectShowJson);

  const handleAdd = () => dispatch(addNode());
  const handleImport = () => dispatch(setShowImport(true));
  const handleToggleJson = () => dispatch(toggleJson());

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonStr);
    dispatch(showToast({ msg: 'JSON copied to clipboard!', type: 'success' }));
    setTimeout(() => dispatch(clearToast()), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'flow.json';
    a.click();
    URL.revokeObjectURL(a.href);
    dispatch(showToast({ msg: 'JSON downloaded!', type: 'success' }));
    setTimeout(() => dispatch(clearToast()), 2500);
  };

  return (
    <div
      style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            color: '#fff',
          }}
        >
          F
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Bolna Flow</span>
      </div>

      <Btn primary onClick={handleAdd}>
        <PlusIcon /> Add Node
      </Btn>
      <Btn onClick={handleImport}>Import</Btn>
      <Btn onClick={handleCopy}>Copy JSON</Btn>
      <Btn onClick={handleDownload}>Download</Btn>
      <Btn onClick={handleToggleJson} style={{ minWidth: 36, padding: '7px 10px' }} title="Toggle JSON">
        {showJson ? '{ }' : '{ }'}
      </Btn>
    </div>
  );
}

function Btn({ children, primary, onClick, style, ...rest }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 8,
        border: primary ? 'none' : '1px solid var(--border-subtle)',
        background: primary ? 'var(--accent)' : 'transparent',
        color: primary ? '#fff' : 'var(--text-primary)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.15s',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
