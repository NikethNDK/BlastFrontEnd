import React from 'react';

const ContentCard = ({ children, flush = false, className = '' }) => (
  <div className={`lims-content-card${flush ? ' lims-content-card--flush' : ''}${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);

export default ContentCard;
