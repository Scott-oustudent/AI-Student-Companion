
import React, { useState } from 'react';
import { generateEssayStructure } from '../../services/geminiService';

const EssayGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'Essay' | 'Report'>('Essay');
  const [structure, setStructure] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true);
    setStructure('');
    const response = await generateEssayStructure(topic, type);
    setStructure(response);
    setIsLoading(false);
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <form onSubmit={handleGenerate}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text_secondary mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Impact of Renewable Energy"
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-primary focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text_secondary mb-1">Document Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'Essay' | 'Report')}
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-primary focus:outline-none"
          >
            <option>Essay</option>
            <option>Report</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-600"
        >
          {isLoading ? 'Generating...' : 'Generate Structure'}
        </button>
      </form>

      {structure && (
        <div className="mt-6 p-4 bg-gray-900 border border-gray-600 rounded-md">
          <h4 className="font-bold text-lg mb-2 text-primary-light">Suggested Structure:</h4>
          <pre className="whitespace-pre-wrap font-sans text-text_secondary">{structure}</pre>
        </div>
      )}
    </div>
  );
};

export default EssayGenerator;
