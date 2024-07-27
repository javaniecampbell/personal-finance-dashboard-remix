import React, { useState } from 'react';
import { Link, useLocation } from '@remix-run/react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const NavItem = ({ item, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item.to;

  const hasChildren = item.children && item.children.length > 0;

  const toggleOpen = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-2 px-4 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'} cursor-pointer`}
        style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
        onClick={toggleOpen}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        ) : (
          <span className="w-4" /> // Placeholder for alignment
        )}
        <Link to={item.to} className="ml-2 flex-grow">
          {item.label}
        </Link>
      </div>
      {isOpen && hasChildren && (
        <div>
          {item.children.map((child) => (
            <NavItem key={child.to} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const NestedNavigation = ({ items }) => {
  return (
    <nav className="w-64 bg-white shadow-md">
      {items.map((item) => (
        <NavItem key={item.to} item={item} />
      ))}
    </nav>
  );
};

export default NestedNavigation;
