import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SideDrawer = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  position = 'right',
  width = '300px' 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const drawerStyles = {
    position: 'fixed',
    top: 0,
    [position]: 0,
    width: width,
    height: '100vh',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-out',
    transform: isOpen ? 'translateX(0)' : `translateX(${position === 'left' ? '-100%' : '100%'})`,
    zIndex: 1000,
  };

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out',
    zIndex: 999,
  };

  const drawer = (
    <>
      <div style={overlayStyles} onClick={onClose} />
      <div style={drawerStyles}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
              <X size={24} />
            </button>
          </div>
          <div className="overflow-y-auto h-full pb-20">
            {children}
          </div>
        </div>
      </div>
    </>
  );

  return mounted ? createPortal(drawer, document.body) : null;
};

export default SideDrawer;
