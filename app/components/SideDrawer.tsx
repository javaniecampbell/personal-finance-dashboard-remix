import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SideDrawer = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Delay to allow for closing animation
  };

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        ></div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-200">
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
};

export default SideDrawer;
