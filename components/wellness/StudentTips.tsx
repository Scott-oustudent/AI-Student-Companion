
import React from 'react';

const videoLinks = [
  { id: 'BsLC5eIjcag', title: 'How To Manage Your Time As A Student' },
  { id: 'P6FORpg0KVo', title: 'How to Make Learning as Addictive as Social Media' },
  { id: 'kKvK2foOTJM', title: '6 secrets to learning faster' },
  { id: '6Rg0mBkVAeo', title: '5 simple tips will help you to stop the EXAM STRESS' },
  { id: 'Qvcx7Y4caQE', title: 'How to stop procrastination' },
  { id: '8ZhoeSaPF-k', title: 'How To Stay Motivated - The Locus Rule' },
];

const YouTubePlayer: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => (
  <div className="mb-6 bg-surface p-4 rounded-lg shadow-lg">
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-md"
      ></iframe>
    </div>
    <h3 className="text-md font-semibold mt-3 text-text_primary">{title}</h3>
  </div>
);

const StudentTips: React.FC = () => {
  return (
    <div>
      <p className="text-text_secondary mb-6 text-center">
        Watch these short videos for tips on improving your study habits, managing stress, and staying motivated.
      </p>
      <div className="space-y-6">
        {videoLinks.map(video => (
          <YouTubePlayer key={video.id} videoId={video.id} title={video.title} />
        ))}
      </div>
    </div>
  );
};

export default StudentTips;
