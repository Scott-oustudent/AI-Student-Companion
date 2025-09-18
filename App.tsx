
import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import ToolsHome from './components/tools/ToolsHome';
import WellnessHome from './components/wellness/WellnessHome';
import CommunityHome from './components/community/CommunityHome';
import { BookOpenIcon, HeartIcon, UsersIcon, SparklesIcon } from './components/icons/Icons';

export type Section = 'tools' | 'wellness' | 'community';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('tools');

  const renderSection = () => {
    switch (activeSection) {
      case 'tools':
        return <ToolsHome />;
      case 'wellness':
        return <WellnessHome />;
      case 'community':
        return <CommunityHome />;
      default:
        return <ToolsHome />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text_primary font-sans flex flex-col">
      <header className="bg-surface p-4 shadow-lg sticky top-0 z-10 flex items-center justify-center">
        <SparklesIcon className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold ml-2">AI Student Companion</h1>
      </header>
      
      <main className="flex-grow p-4 pb-24 overflow-y-auto">
        {renderSection()}
      </main>
      
      <BottomNav activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  );
};

export default App;
