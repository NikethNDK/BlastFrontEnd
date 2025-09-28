import React from 'react';
import { 
  FaBox, 
  FaUpload, 
  FaDownload, 
  FaUndo, 
  FaFlask, 
  FaDna, 
  FaMicroscope,
  FaChartBar,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import './StatsDashboard.css';

const StatsDashboard = ({ 
  stats = {},
  loading = false 
}) => {
  const defaultStats = {
    totalItems: 0,
    receivedItems: 0,
    issuedItems: 0,
    returnedItems: 0,
    lowStockItems: 0,
    dnaSequences: 0,
    equipmentCount: 0,
    pendingRequests: 0
  };

  const statsData = { ...defaultStats, ...stats };

  const statCards = [
    {
      key: 'totalItems',
      label: 'Total Items',
      value: statsData.totalItems,
      icon: FaBox,
      color: 'primary',
      trend: '+12%',
      trendUp: true
    },
    {
      key: 'receivedItems',
      label: 'Received Today',
      value: statsData.receivedItems,
      icon: FaUpload,
      color: 'secondary',
      trend: '+8%',
      trendUp: true
    },
    {
      key: 'issuedItems',
      label: 'Issued Today',
      value: statsData.issuedItems,
      icon: FaDownload,
      color: 'accent',
      trend: '+5%',
      trendUp: true
    },
    {
      key: 'returnedItems',
      label: 'Returned Today',
      value: statsData.returnedItems,
      icon: FaUndo,
      color: 'info',
      trend: '+3%',
      trendUp: true
    },
    {
      key: 'lowStockItems',
      label: 'Low Stock Items',
      value: statsData.lowStockItems,
      icon: FaExclamationTriangle,
      color: 'warning',
      trend: '-2%',
      trendUp: false
    },
    {
      key: 'dnaSequences',
      label: 'DNA Sequences',
      value: statsData.dnaSequences,
      icon: FaDna,
      color: 'success',
      trend: '+15%',
      trendUp: true
    },
    {
      key: 'equipmentCount',
      label: 'Equipment',
      value: statsData.equipmentCount,
      icon: FaMicroscope,
      color: 'primary',
      trend: '+2%',
      trendUp: true
    },
    {
      key: 'pendingRequests',
      label: 'Pending Requests',
      value: statsData.pendingRequests,
      icon: FaChartBar,
      color: 'error',
      trend: '-5%',
      trendUp: false
    }
  ];

  if (loading) {
    return (
      <div className="lab-stats-dashboard">
        <div className="lab-stats-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="lab-stat-card lab-stat-card-loading">
              <div className="lab-stat-card-skeleton">
                <div className="lab-stat-card-skeleton-icon"></div>
                <div className="lab-stat-card-skeleton-content">
                  <div className="lab-stat-card-skeleton-value"></div>
                  <div className="lab-stat-card-skeleton-label"></div>
                  <div className="lab-stat-card-skeleton-trend"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lab-stats-dashboard lab-fade-in">
      <div className="lab-stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.key} className="lab-stat-card lab-scale-in">
              <div className="lab-stat-card-icon lab-stat-card-icon-{stat.color}">
                <Icon />
              </div>
              <div className="lab-stat-card-content">
                <div className="lab-stat-card-value">
                  {stat.value.toLocaleString()}
                </div>
                <div className="lab-stat-card-label">
                  {stat.label}
                </div>
                <div className={`lab-stat-card-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}`}>
                  <span className="lab-stat-card-trend-icon">
                    {stat.trendUp ? '↗' : '↘'}
                  </span>
                  <span className="lab-stat-card-trend-text">
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsDashboard;
