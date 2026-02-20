import React, { useState, useContext } from 'react';
import { PresentationContext } from '../contexts/PresentationContext';
import ipfsService from '../services/ipfsService';

const CloudSync = ({ onClose }) => {
  const { currentPresentation, setCurrentPresentation } = useContext(PresentationContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');

  const handleSaveToIPFS = async () => {
    if (!currentPresentation) {
      setMessage('No presentation to save');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const result = await ipfsService.savePresentation(currentPresentation);
      setMessage('Saved to IPFS successfully!');
      setIpfsHash(result.ipfsHash);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFromIPFS = async () => {
    if (!ipfsHash.trim()) {
      setMessage('Please enter an IPFS hash');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const result = await ipfsService.loadPresentation(ipfsHash.trim());
      if (result.success) {
        setCurrentPresentation(result.data);
        setMessage('Presentation loaded successfully!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">IPFS Cloud Sync</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">✕</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <button 
              onClick={handleSaveToIPFS}
              disabled={loading || !currentPresentation}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save to IPFS'}
            </button>
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Enter IPFS hash to load"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              className="w-full p-2 border rounded mb-2 dark:bg-neutral-800 dark:border-neutral-700"
            />
            <button 
              onClick={handleLoadFromIPFS}
              disabled={loading}
              className="btn-secondary w-full disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load from IPFS'}
            </button>
          </div>
          
          {message && (
            <div className={`p-3 rounded text-sm ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            }`}>
              {message}
            </div>
          )}
          
          <button onClick={onClose} className="btn-secondary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudSync;