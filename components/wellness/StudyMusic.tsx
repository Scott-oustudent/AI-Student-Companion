
import React from 'react';

const StudyMusic: React.FC = () => {
  return (
    <div className="bg-surface p-4 rounded-lg shadow-lg">
      <p className="text-text_secondary mb-4">
        Here's a playlist curated to help you focus and get into a productive study flow.
      </p>
      <iframe 
        id='AmazonMusicEmbedB0FBNQSC5D' 
        src='https://music.amazon.co.uk/embed/B0FBNQSC5D/?id=3ZoAqrgLJx&marketplaceId=A1F83G8C2ARO7P&musicTerritory=GB' 
        width='100%' 
        height='352px' 
        frameBorder='0' 
        style={{ borderRadius: '20px', maxWidth: '100%' }}>
      </iframe>
    </div>
  );
};

export default StudyMusic;
