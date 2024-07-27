// app/hooks/useReplay.js
import { useState, useCallback } from 'react';

export const useReplay = () => {
  const [events, setEvents] = useState([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentReplayEvent, setCurrentReplayEvent] = useState(null);

  const recordEvent = useCallback((event) => {
    setEvents(prevEvents => [...prevEvents, { ...event, timestamp: new Date().toISOString() }]);
  }, []);

  const startReplay = useCallback(async (onReplayEvent) => {
    setIsReplaying(true);
    for (const event of events) {
      if (!isReplaying) break;
      setCurrentReplayEvent(event);
      await onReplayEvent(event);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating event processing time
    }
    setIsReplaying(false);
    setCurrentReplayEvent(null);
  }, [events, isReplaying]);

  const stopReplay = useCallback(() => {
    setIsReplaying(false);
    setCurrentReplayEvent(null);
  }, []);

  return {
    events,
    isReplaying,
    currentReplayEvent,
    recordEvent,
    startReplay,
    stopReplay
  };
};
