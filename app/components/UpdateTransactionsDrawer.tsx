import React, { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import SideDrawer from '~/components/SideDrawer';

const UpdateTransactionsDrawer = ({ isOpen, onClose }) => {
  const fetcher = useFetcher();
  const [progress, setProgress] = useState(0);

  const handleUpdateTransactions = () => {
    fetcher.submit(
      { _action: "updateTransactionsBudgets" },
      { method: "post" }
    );
    
    // Simulating progress for UX
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(Math.min(currentProgress, 90)); // Cap at 90% until we get the real result
      if (currentProgress >= 90) clearInterval(interval);
    }, 500);
  };

  React.useEffect(() => {
    if (fetcher.data) {
      setProgress(100);
    }
  }, [fetcher.data]);

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title="Update Transactions">
      <div className="p-4">
        <p className="mb-4">This process will update all transactions without a budget, associating them with the appropriate budget based on their category.</p>
        
        {!fetcher.data && fetcher.state !== 'submitting' && (
          <button 
            onClick={handleUpdateTransactions}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Start Update Process
          </button>
        )}

        {(fetcher.state === 'submitting' || progress > 0) && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center">{progress}% Complete</p>
          </div>
        )}

        {fetcher.data && (
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">Update Complete</h3>
            <p>Updated {fetcher.data.updatedTransactions} out of {fetcher.data.totalTransactions} transactions.</p>
          </div>
        )}
      </div>
    </SideDrawer>
  );
};

export default UpdateTransactionsDrawer;
