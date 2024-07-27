import React, { useState } from 'react';
import { useReplay } from './ReplaySystem';
import { ReplayControls, ReplayList } from './ReplayComponents';

const ReplayDemo = () => {
  const [count, setCount] = useState(0);
  const { recordEvent, isReplaying, currentReplay } = useReplay();

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    recordEvent({ type: 'INCREMENT', payload: newCount });
  };

  const handleDecrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    recordEvent({ type: 'DECREMENT', payload: newCount });
  };

  React.useEffect(() => {
    if (isReplaying && currentReplay) {
      // Simulate replaying the events
      const timer = setTimeout(() => {
        if (currentReplay.type === 'INCREMENT') {
          setCount(currentReplay.payload);
        } else if (currentReplay.type === 'DECREMENT') {
          setCount(currentReplay.payload);
        }
      }, 1000); // Delay to simulate event replay

      return () => clearTimeout(timer);
    }
  }, [isReplaying, currentReplay]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Replay Demo</h1>
      <div className="mb-4">
        <p className="text-xl">Count: {count}</p>
        <div className="mt-2 space-x-2">
          <button
            onClick={handleIncrement}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Increment
          </button>
          <button
            onClick={handleDecrement}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Decrement
          </button>
        </div>
      </div>
      <ReplayControls />
      <ReplayList />
    </div>
  );
};

export default ReplayDemo;
