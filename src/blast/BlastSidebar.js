import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaBars,
  FaTimes,
  FaDatabase,
  FaUserCircle,
  FaSignOutAlt,
  FaArrowLeft
} from 'react-icons/fa';
import './BlastSidebar.css';

const UserAvatarIcon = FaUserCircle; 

const BlastSidebar = ({ 
  userDetails = { name: 'User Name', lab: 'Lab Assistant', designation: 'Researcher' },
  onLogout = '/',
  repositoryPath = '/dna' // Allow customization of repository path
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="blast-sidebar-overlay d-lg-none"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`blast-sidebar ${collapsed ? 'collapsed' : ''}`}>
        
        {/* Header and Toggle */}
        <div className="blast-sidebar-header">
          <div className="d-flex align-items-center justify-content-between">
            {!collapsed && (
              <div className="blast-sidebar-brand">
                <button className="blast-sidebar-logo" onClick={() => navigate("/")}>
                  <FaArrowLeft />
                </button>
                <span>DNA Blast</span>
              </div>
            )}
            {/* <button 
              className="blast-sidebar-toggle"
              onClick={toggleSidebar}
            >
              {collapsed ? <FaBars /> : <FaTimes />}
            </button> */}
          </div>
        </div>

        {/* User Info Section */}
        <div className="blast-sidebar-top-meta">
          {!collapsed && (
            <div className="blast-sidebar-user">
              <div className="blast-sidebar-user-avatar">
                <UserAvatarIcon />
              </div>
              <div className="blast-sidebar-user-info">
                <div className="blast-sidebar-user-name">{userDetails.name}</div>
                <div className="blast-sidebar-user-role">{userDetails.designation}</div>
                <div className="blast-sidebar-user-lab">{userDetails.lab}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Menu (Navigation) - Only Repository */}
        <div className="blast-sidebar-menu-wrapper">
          <div className="blast-sidebar-section">
            {!collapsed && <div className="blast-sidebar-section-title">Navigation</div>}
            <nav className="blast-sidebar-menu">
              <NavLink
                to={repositoryPath}
                className={({ isActive }) => 
                  `blast-sidebar-item ${isActive ? 'active' : ''}`
                }
                title="Repository"
              >
                <FaDatabase className="blast-sidebar-item-icon color-primary" />
                {!collapsed && (
                  <span className="blast-sidebar-item-text">Repository</span>
                )}
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Footer - Logout Button */}
        <div className="blast-sidebar-footer">
          <button 
            className="blast-sidebar-logout"
            onClick={onLogout}
            title="Logout"
          >
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default BlastSidebar;