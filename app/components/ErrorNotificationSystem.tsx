import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'error', duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50">
        {notifications.map(({ id, message, type }) => (
          <div
            key={id}
            className={`mb-2 p-4 rounded-md shadow-md flex items-center justify-between ${
              type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            <span>{message}</span>
            <button
              onClick={() => removeNotification(id)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
