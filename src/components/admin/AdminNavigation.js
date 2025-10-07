import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft,
  FaSignOutAlt,
  FaChartBar,
  FaUserPlus,
  FaRedo,
  FaUsers,
  FaTable,
  FaCog
} from 'react-icons/fa';
import TN_Transparent_Logo from "../../assets/TN_Transparent_Logo.png";
import AIWC_Transparent_Logo from "../../assets/AIWC_Transparent_Logo.png";
import AIWC_DNA_sequencing from "../../assets/AIWC_DNA_sequencing.png";
import AIWC_LIMS from "../../assets/AIWC_LIMS.png";
import AWIC_INTRANET from "../../assets/AIWC_INTRANET.png";
import "../../blast/BlastSidebar.css";
import Header from "../Lab1/homeLab/Header";

const AdminNavigation = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = '/Logout';
  };

  return (
    <div style={{ backgroundColor: "#f2f5e6" }}>
      <header className="headerr">
        <Header />
      </header>

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
                  < FaCog style={{ marginRight: '8px', marginLeft: "8px", color: '#4b5563' }} />
                  <span>Admin</span>
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
                  to="/admin/project_manage"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Project Master"
                >
                  <FaChartBar className="blast-sidebar-item-icon" style={{ color: '#3b82f6' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Project Master</span>
                  )}
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Employee Registration"
                >
                  <FaUserPlus className="blast-sidebar-item-icon" style={{ color: '#10b981' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Employee Registration</span>
                  )}
                </NavLink>

                <NavLink
                  to="/password_reset"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Password Reset"
                >
                  <FaRedo className="blast-sidebar-item-icon" style={{ color: '#ef4444' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Password Reset</span>
                  )}
                </NavLink>

                <NavLink
                  to="/employee_manage"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Employee Master"
                >
                  <FaUsers className="blast-sidebar-item-icon" style={{ color: '#f59e0b' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Employee Master</span>
                  )}
                </NavLink>

                <NavLink
                  to="/master_table"
                  className={({ isActive }) => 
                    `blast-sidebar-item ${isActive ? 'active' : ''}`
                  }
                  title="Master Table"
                >
                  <FaTable className="blast-sidebar-item-icon" style={{ color: '#8b5cf6' }} />
                  {!collapsed && (
                    <span className="blast-sidebar-item-text">Master Table</span>
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

export default AdminNavigation;