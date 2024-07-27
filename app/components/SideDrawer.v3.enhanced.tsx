import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
// Let's enhance our Side Drawer component to support multi-page navigation within the drawer itself. This will allow for more complex interactions and nested content within the drawer.
const SideDrawer = ({ isOpen, onClose, initialContent, title: initialTitle }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [pageStack, setPageStack] = useState([{ content: initialContent, title: initialTitle }]);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      setPageStack([{ content: initialContent, title: initialTitle }]);
    }
  }, [isOpen, initialContent, initialTitle]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setPageStack([{ content: initialContent, title: initialTitle }]);
    }, 300); // Delay to allow for closing animation
  };

  const pushPage = (newContent, newTitle) => {
    setPageStack(prevStack => [...prevStack, { content: newContent, title: newTitle }]);
  };

  const popPage = () => {
    if (pageStack.length > 1) {
      setPageStack(prevStack => prevStack.slice(0, -1));
    } else {
      handleClose();
    }
  };

  const currentPage = pageStack[pageStack.length - 1];

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
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              {pageStack.length > 1 && (
                <button onClick={popPage} className="mr-2 p-1 rounded-full hover:bg-gray-200">
                  <ChevronLeft size={24} />
                </button>
              )}
              <h2 className="text-xl font-semibold">{currentPage.title}</h2>
            </div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-200">
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {React.cloneElement(currentPage.content, { pushPage, popPage })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
