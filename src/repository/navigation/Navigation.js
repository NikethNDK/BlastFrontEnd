import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaArrowLeft,
  FaHome
} from 'react-icons/fa';
import { FcBiotech, FcBiohazard } from "react-icons/fc";
import "./Navigation.css";
import "../../App.css";

const UserAvatarIcon = FaUserCircle;

const Navigation = ({ 
  userDetails = { name: 'User Name', lab: 'Lab Assistant', designation: 'Researcher' }
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate()

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    window.location.href = "/";
    // Add any logout logic here
    console.log('Logout clicked');
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
          <div className="d-flex align-items-center justify-content-between w-100">
            {!collapsed && (
              <div className="blast-sidebar-brand">
                <div className="blast-sidebar-logo">
                  <button className="blast-sidebar-logo" onClick={() => navigate("/")}>
                                    <FaHome />
                                  </button>
                </div>
                <span>DNA Repository</span>
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
        
        {/* Menu (Navigation) */}
        <div className="blast-sidebar-menu-wrapper">
          <div className="blast-sidebar-section">
            {!collapsed && <div className="blast-sidebar-section-title">Navigation</div>}
            <nav className="blast-sidebar-menu">
              <NavLink
                to="/dna"
                className={({ isActive }) => 
                  `blast-sidebar-item ${isActive ? 'active' : ''}`
                }
                title="Home"
              >
                <FcBiotech className="blast-sidebar-item-icon" />
                {!collapsed && (
                  <span className="blast-sidebar-item-text">Home</span>
                )}
              </NavLink>
              
              <NavLink
                to="/add_dna"
                className={({ isActive }) => 
                  `blast-sidebar-item ${isActive ? 'active' : ''}`
                }
                title="New Submission"
              >
                <FcBiohazard className="blast-sidebar-item-icon" />
                {!collapsed && (
                  <span className="blast-sidebar-item-text">New Submission</span>
                )}
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Footer - Logout Button */}
        <div className="blast-sidebar-footer">
          <button 
            className="blast-sidebar-logout"
            onClick={handleLogout}
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

export default Navigation;