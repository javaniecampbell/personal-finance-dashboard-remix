import React from 'react';
import { useReplay } from './ReplaySystem';
import { Play, Square, Disc } from 'lucide-react';

export const ReplayControls = () => {
  const { isRecording, isReplaying, startRecording, stopRecording, startReplay, stopReplay } = useReplay();

  return (
    <div className="flex space-x-2">
      {!isRecording && !isReplaying && (
        <button
          onClick={startRecording}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Disc className="mr-2" size={16} /> Start Recording
        </button>
      )}
      {isRecording && (
        <button
          onClick={stopRecording}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Square className="mr-2" size={16} /> Stop Recording
        </button>
      )}
      {!isRecording && !isReplaying && (
        <button
          onClick={() => startReplay()} // You might want to select a specific replay to start
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Play className="mr-2" size={16} /> Start Replay
        </button>
      )}
      {isReplaying && (
        <button
          onClick={stopReplay}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Square className="mr-2" size={16} /> Stop Replay
        </button>
      )}
    </div>
  );
};

export const ReplayList = () => {
  const { events, startReplay } = useReplay();

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Recorded Events</h2>
      <ul className="space-y-2">
        {events.map((event, index) => (
          <li key={index} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
              <span className="font-medium">{event.type}</span>
              <span className="text-gray-500 ml-2">{new Date(event.timestamp).toLocaleString()}</span>
            </div>
            <button
              onClick={() => startReplay(event.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Replay
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
