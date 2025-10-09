import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaSignOutAlt,
  FaChartBar,
  FaBell,
  FaRedo,
  FaSyncAlt,
  FaUserTie
} from 'react-icons/fa';
import "../../blast/BlastSidebar.css";
import Header from "../Lab1/homeLab/Header";

const ManagerNavigation = ({ 
  children,
  userDetails = { name: "", lab: "", designation: "" }
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div style={{ backgroundColor: "#f2f5e6" }}>
      {/* <header className="headerr"> */}
        <Header />
      {/* </header> */}

      <div style={{ display: "flex" }}>
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
                  <FaUserTie style={{ marginRight: '8px', marginLeft: "8px", color: '#4b5563' }} />
                  <span>Manager</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Menu (Navigation) */}
          <div className="blast-sidebar-menu-wrapper">
            <div className="blast-sidebar-section">
              {!collapsed && <div className="blast-sidebar-section-title">Navigation</div>}

              <nav className="blast-sidebar-menu">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Dashboard"
                >
                  <FaChartBar className="blast-sidebar-item-icon" style={{ color: '#3b82f6' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Dashboard</span>
                  )}
                </NavLink>

                <NavLink
                  to="/notification"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Request Notification"
                >
                  <FaBell className="blast-sidebar-item-icon" style={{ color: '#f59e0b' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Request Notification</span>
                  )}
                </NavLink>

                <NavLink
                  to="/change_password"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Change Password"
                >
                  <FaRedo className="blast-sidebar-item-icon" style={{ color: '#ef4444' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Change Password</span>
                  )}
                </NavLink>

                <NavLink
                  to="/returnNoti"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Return Notification"
                >
                  <FaSyncAlt className="blast-sidebar-item-icon" style={{ color: '#06b6d4' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Return Notification</span>
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

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ManagerNavigation;