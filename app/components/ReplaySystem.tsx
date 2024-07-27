import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const ReplayContext = createContext();

export const useReplay = () => {
  const context = useContext(ReplayContext);
  if (!context) {
    throw new Error("useReplay must be used within a ReplayProvider");
  }
  return context;
};

export const ReplayProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentReplay, setCurrentReplay] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem("replayEvents");
    if (storedEvents !== null && storedEvents !== undefined) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const saveEvents = useCallback((newEvents) => {
    setEvents(newEvents);
    localStorage.setItem("replayEvents", JSON.stringify(newEvents));
  }, []);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    saveEvents([]);
  }, [saveEvents]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  const recordEvent = useCallback(
    (event) => {
      if (isRecording) {
        const newEvent = {
          ...event,
          timestamp: Date.now(),
        };
        saveEvents((prevEvents) => [...prevEvents, newEvent]);
      }
    },
    [isRecording, saveEvents]
  );

  const startReplay = useCallback(
    (replayId) => {
      const replay = events.find((event) => event.id === replayId);
      if (replay) {
        setIsReplaying(true);
        setCurrentReplay(replay);
      }
    },
    [events]
  );

  const stopReplay = useCallback(() => {
    setIsReplaying(false);
    setCurrentReplay(null);
  }, []);

  return (
    <ReplayContext.Provider
      value={{
        events,
        isRecording,
        isReplaying,
        currentReplay,
        startRecording,
        stopRecording,
        recordEvent,
        startReplay,
        stopReplay,
      }}
    >
      {children}
    </ReplayContext.Provider>
  );
};
