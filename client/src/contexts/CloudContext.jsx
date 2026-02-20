import React, { createContext, useContext } from 'react';

const CloudContext = createContext();

export const useCloud = () => {
  const context = useContext(CloudContext);
  if (!context) {
    throw new Error('useCloud must be used within a CloudProvider');
  }
  return context;
};

export const CloudProvider = ({ children }) => {
  const value = {
    // Mock cloud features
  };

  return (
    <CloudContext.Provider value={value}>
      {children}
    </CloudContext.Provider>
  );
};