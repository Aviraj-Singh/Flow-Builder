import React from 'react';
import { useSelector } from 'react-redux';
import { selectToast } from '../store/selectors';

export default function Toast() {
  const toast = useSelector(selectToast);

  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        padding: '10px 24px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        background: toast.type === 'error' ? 'var(--error)' : 'var(--success)',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {toast.msg}
    </div>
  );
}
