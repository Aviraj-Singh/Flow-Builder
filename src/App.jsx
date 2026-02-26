import React from 'react';
import { useSelector } from 'react-redux';
import Toolbar from './components/Toolbar';
import FlowCanvas from './components/FlowCanvas';
import Sidebar from './components/Sidebar';
import JsonPanel from './components/JsonPanel';
import ImportModal from './components/ImportModal';
import Toast from './components/Toast';
import { selectShowJson, selectShowImport } from './store/selectors';
import { selectErrors } from './store/selectors';

export default function App() {
  const showJson = useSelector(selectShowJson);
  const showImport = useSelector(selectShowImport);
  const errors = useSelector(selectErrors);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {showImport && <ImportModal />}

      <Toast />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Toolbar />

        {errors.__global && (
          <div
            style={{
              margin: '0 20px',
              marginTop: 10,
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              fontSize: 12,
              color: 'var(--error-light)',
            }}
          >
            {errors.__global.join('. ')}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <FlowCanvas />
          {showJson && <JsonPanel />}
        </div>
      </div>

      <Sidebar />
    </div>
  );
}
