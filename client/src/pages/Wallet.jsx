import React from 'react';

const Wallet = () => {
  return (
    <div className="p-6">
      <div className="panel max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--accent-gold)' }}>Wallet</h2>
        <p className="muted mt-2">View balance, transactions and payment options.</p>
        <div className="mt-4">
          <p className="text-sm">(Placeholder) Wallet details / transactions will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
