import React, { useRef } from 'react';
import Header from '../Lab1/homeLab/Header';
import { useAppHeader } from '../../hooks/useAppHeader';
import '../../styles/layout/app-shell.css';

/**
 * Shared application shell: collapsible header + sidebar + main content.
 * Pass `sidebar` for authenticated layouts; omit for auth-only pages (login).
 */
const AppShell = ({ children, sidebar, auth = false }) => {
  const shellRef = useRef(null);
  const headerRef = useRef(null);
  const mainRef = useRef(null);

  const isWorkspace = !auth && Boolean(sidebar);

  const { headerVisible } = useAppHeader({
    enabled: isWorkspace,
    headerRef,
    mainRef,
    shellRef,
  });

  const shellClassName = [
    'lims-app',
    'lab-app',
    auth ? 'lims-app--auth' : '',
    isWorkspace ? 'lims-app--workspace' : '',
    isWorkspace && !headerVisible ? 'lims-app--header-hidden' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={shellClassName} ref={shellRef}>
      <header
        className="lims-header"
        ref={headerRef}
        aria-hidden={isWorkspace && !headerVisible ? 'true' : undefined}
      >
        <Header />
      </header>

      {sidebar ? (
        <div className="lims-body lab-body-container">
          {sidebar}
          <main className="lims-main lab-main-content">
            <div className="lims-content lab-content-container">
              <div
                className="lims-content-scroll"
                ref={mainRef}
                tabIndex={-1}
              >
                {children}
              </div>
            </div>
          </main>
        </div>
      ) : (
        <main className="lims-auth-content">{children}</main>
      )}
    </div>
  );
};

export default AppShell;
