import React, { useState } from 'react';
import PlagiarismChecker from './PlagiarismChecker';
import ReferencingWizard from './ReferencingWizard';
import EssayGenerator from './EssayGenerator';
import FlashcardGenerator from './FlashcardGenerator';
import Scheduler from './Scheduler';
import PomodoroTimer from './PomodoroTimer';
import { ChevronLeftIcon } from '../icons/Icons';


type Tool = 'scheduler' | 'pomodoro' | 'plagiarism' | 'referencing' | 'essay' | 'flashcards';

const ToolCard: React.FC<{ title: string; description: string; onClick: () => void }> = ({ title, description, onClick }) => (
  <button onClick={onClick} className="bg-surface p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 text-left w-full">
    <h3 className="text-lg font-bold text-primary-light">{title}</h3>
    <p className="text-sm text-text_secondary mt-1">{description}</p>
  </button>
);

const ToolsHome: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const tools: { id: Tool; title: string; description: string; component: React.FC }[] = [
    { id: 'scheduler', title: 'Student Scheduler', description: 'Organize deadlines, exams, and lectures.', component: Scheduler },
    { id: 'pomodoro', title: 'Pomodoro Timer', description: 'Boost focus with customizable work sessions.', component: PomodoroTimer },
    { id: 'plagiarism', title: 'Plagiarism Checker', description: 'Check your work for academic integrity.', component: PlagiarismChecker },
    { id: 'referencing', title: 'Referencing & Citation Wizard', description: 'Generate citations in various styles.', component: ReferencingWizard },
    { id: 'essay', title: 'AI Assisted Report & Essay Generator', description: 'Get help with structure and formatting.', component: EssayGenerator },
    { id: 'flashcards', title: 'AI Flashcard Generator', description: 'Create study flashcards from any subject.', component: FlashcardGenerator },
  ];

  const renderContent = () => {
    if (activeTool) {
      const tool = tools.find(t => t.id === activeTool);
      const Component = tool?.component;
      if (!Component) return null;
      
      return (
        <div>
          <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 mb-4 text-primary-light hover:text-primary transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
            Back to Tools
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">{tool.title}</h2>
          <Component />
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Student Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map(tool => (
            <ToolCard key={tool.id} title={tool.title} description={tool.description} onClick={() => setActiveTool(tool.id)} />
          ))}
        </div>
      </div>
    );
  };

  return <div className="animate-fade-in">{renderContent()}</div>;
};

export default ToolsHome;