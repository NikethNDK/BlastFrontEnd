import React from 'react';

const PageBody = ({ children, className = '' }) => (
  <div className={`lims-page-body${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);

export default PageBody;
