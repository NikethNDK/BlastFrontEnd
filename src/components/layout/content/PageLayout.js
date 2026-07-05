import React from 'react';

const PageLayout = ({ children, fullWidth = true }) => (
  <div className={`lims-page-layout${fullWidth ? '' : ' lims-page-layout--constrained'}`}>
    {children}
  </div>
);

export default PageLayout;
