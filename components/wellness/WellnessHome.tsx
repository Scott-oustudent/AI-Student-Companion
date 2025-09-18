
import React, { useState } from 'react';
import StudyMusic from './StudyMusic';
import StudentTips from './StudentTips';
import Meditation from './Meditation';
import { ChevronLeftIcon } from '../icons/Icons';

type WellnessPage = 'music' | 'tips' | 'meditation';

const WellnessCard: React.FC<{ title: string; description: string; onClick: () => void }> = ({ title, description, onClick }) => (
    <button onClick={onClick} className="bg-surface p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-200 text-left w-full">
      <h3 className="text-lg font-bold text-secondary">{title}</h3>
      <p className="text-sm text-text_secondary mt-1">{description}</p>
    </button>
);

const WellnessHome: React.FC = () => {
    const [activePage, setActivePage] = useState<WellnessPage | null>(null);

    const pages = [
        { id: 'music', title: 'Study Music', description: 'Focus-enhancing playlists to help you concentrate.', component: StudyMusic },
        { id: 'tips', title: 'Student Tips', description: 'Helpful videos on time management, learning, and more.', component: StudentTips },
        { id: 'meditation', title: 'Meditation', description: 'Guided audio to relax and de-stress.', component: Meditation },
    ];

    if (activePage) {
        const page = pages.find(p => p.id === activePage);
        const Component = page?.component;
        if (!Component) return null;

        return (
            <div className="animate-fade-in">
                 <button onClick={() => setActivePage(null)} className="flex items-center gap-2 mb-4 text-secondary hover:text-pink-400 transition-colors">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Back to Wellness
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">{page.title}</h2>
                <Component />
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
             <h2 className="text-2xl font-bold mb-6 text-center">Student Wellness</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages.map(page => (
                    <WellnessCard key={page.id} title={page.title} description={page.description} onClick={() => setActivePage(page.id as WellnessPage)} />
                ))}
            </div>
        </div>
    );
};

export default WellnessHome;
