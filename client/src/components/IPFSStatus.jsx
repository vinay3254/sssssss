import React, { useState, useEffect } from 'react';

const IPFSStatus = () => {
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const hash = localStorage.getItem('lastIPFSHash');
    if (hash) {
      setStatus('saved');
    }
  }, []);

  const copyHashToClipboard = () => {
    const hash = localStorage.getItem('lastIPFSHash');
    if (hash) {
      navigator.clipboard.writeText(hash);
      setStatus('copied');
      setTimeout(() => setStatus('saved'), 2000);
    }
  };

  if (status === 'idle') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium">Saved to IPFS</span>
        <button
          onClick={copyHashToClipboard}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors ml-2"
        >
          {status === 'copied' ? 'Copied!' : 'Copy Hash'}
        </button>
      </div>
    </div>
  );
};

export default IPFSStatus;
