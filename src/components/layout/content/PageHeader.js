import React from 'react';

const PageHeader = ({ title, actions, meta, children }) => (
  <div className="lims-page-header">
    <h1 className="lims-page-title">{title}</h1>
    {(meta || actions) && (
      <div className="lims-page-header-end">
        {meta && <div className="lims-page-header-meta">{meta}</div>}
        {actions && <div className="lims-page-header-actions">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

export default PageHeader;
