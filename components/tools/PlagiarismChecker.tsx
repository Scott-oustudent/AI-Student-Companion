
import React, { useState } from 'react';
import { checkPlagiarism } from '../../services/geminiService';

const PlagiarismChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) {
      setResult('Please enter some text to check.');
      return;
    }
    setIsLoading(true);
    setResult('');
    const response = await checkPlagiarism(text);
    setResult(response);
    setIsLoading(false);
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <textarea
        className="w-full h-48 p-3 bg-gray-900 border border-gray-600 rounded-md text-text_primary focus:ring-2 focus:ring-primary focus:outline-none"
        placeholder="Paste your text here to check for plagiarism..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={handleCheck}
        disabled={isLoading}
        className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Checking...' : 'Check Text'}
      </button>
      {result && (
        <div className="mt-6 p-4 bg-gray-900 border border-gray-600 rounded-md">
          <h4 className="font-bold text-lg mb-2 text-primary-light">Analysis Result:</h4>
          <pre className="whitespace-pre-wrap font-sans text-text_secondary">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default PlagiarismChecker;
