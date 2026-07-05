import React, { useEffect, useRef } from 'react';
import Header from '../Lab1/homeLab/Header';
import '../../styles/layout/app-shell.css';

const SIDEBAR_MIN_PX = 200;

/**
 * Shared application shell: scrollable header + sidebar + main content.
 * Pass `sidebar` for authenticated layouts; omit for auth-only pages (login).
 */
const AppShell = ({ children, sidebar, auth = false }) => {
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header || auth) {
      return undefined;
    }

    const updateSidebarBounds = () => {
      const headerBottom = header.getBoundingClientRect().bottom;
      const available = Math.max(
        SIDEBAR_MIN_PX,
        window.innerHeight - Math.max(0, headerBottom)
      );

      document.documentElement.style.setProperty(
        '--lims-sidebar-max-height',
        `${available}px`
      );
      document.documentElement.classList.toggle(
        'lims-header-hidden',
        headerBottom <= 0
      );
    };

    updateSidebarBounds();

    window.addEventListener('scroll', updateSidebarBounds, { passive: true });
    window.addEventListener('resize', updateSidebarBounds);

    const resizeObserver = new ResizeObserver(updateSidebarBounds);
    resizeObserver.observe(header);

    return () => {
      window.removeEventListener('scroll', updateSidebarBounds);
      window.removeEventListener('resize', updateSidebarBounds);
      resizeObserver.disconnect();
      document.documentElement.style.removeProperty('--lims-sidebar-max-height');
      document.documentElement.classList.remove('lims-header-hidden');
    };
  }, [auth]);

  return (
    <div className={`lims-app lab-app${auth ? ' lims-app--auth' : ''}`}>
      <header className="lims-header" ref={headerRef}>
        <Header />
      </header>

      {sidebar ? (
        <div className="lims-body lab-body-container">
          {sidebar}
          <main className="lims-main lab-main-content">
            <div className="lims-content lab-content-container">{children}</div>
          </main>
        </div>
      ) : (
        <main className="lims-auth-content">{children}</main>
      )}
    </div>
  );
};

export default AppShell;
