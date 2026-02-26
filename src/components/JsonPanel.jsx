import React from 'react';
import { useSelector } from 'react-redux';
import { selectJsonString, selectHasErrors } from '../store/selectors';

export default function JsonPanel() {
  const jsonStr = useSelector(selectJsonString);
  const hasErrors = useSelector(selectHasErrors);

  return (
    <div
      style={{
        width: 340,
        borderLeft: '1px solid var(--border)',
        background: 'var(--bg-input)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
          JSON Preview
        </span>
        {hasErrors ? (
          <span style={{ fontSize: 11, color: 'var(--error-light)', fontWeight: 600 }}>⚠ Errors</span>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>✓ Valid</span>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 18px' }}>
        <JsonHighlight json={jsonStr} />
      </div>
    </div>
  );
}

function JsonHighlight({ json }) {
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const highlighted = escaped
    .replace(/"([^"]+)"(?=\s*:)/g, '<span style="color:#f4a03b">"$1"</span>')
    .replace(/:\s*"([^"]*)"/g, ': <span style="color:#98c379">"$1"</span>')
    .replace(/:\s*(\d+)/g, ': <span style="color:#d19a66">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span style="color:#c678dd">$1</span>');

  return (
    <pre
      style={{
        margin: 0,
        fontSize: 12,
        lineHeight: 1.6,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
