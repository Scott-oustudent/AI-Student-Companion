
import React from 'react';
import { Section } from '../App';
import { BookOpenIcon, HeartIcon, UsersIcon } from './icons/Icons';

interface BottomNavProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: 'tools', label: 'Tools', icon: BookOpenIcon },
    { id: 'wellness', label: 'Wellness', icon: HeartIcon },
    { id: 'community', label: 'Community', icon: UsersIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 shadow-lg flex justify-around p-2 z-20">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveSection(item.id as Section)}
          className={`flex flex-col items-center justify-center w-24 p-2 rounded-lg transition-colors duration-200 ${
            activeSection === item.id ? 'bg-primary/20 text-primary-light' : 'text-text_secondary hover:bg-gray-700'
          }`}
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
