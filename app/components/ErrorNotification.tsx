import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

type NotificationContextType = {
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: number) => {
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
              type === 'error' ? 'bg-red-500 text-white' :
              type === 'success' ? 'bg-green-500 text-white' :
              type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
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
