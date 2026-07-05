import { FaTable, FaUserPlus, FaChartBar, FaUsers, FaRedo } from 'react-icons/fa';

export const adminMenuConfig = {
  brand: 'Admin',
  homePath: '/',
  showUserBlock: false,
  notifications: { enabled: false },
  sections: [
    {
      title: 'Navigation',
      items: [
        { path: '/master_table', icon: FaTable, label: 'Master Table', iconColor: '#8b5cf6' },
        { path: '/register', icon: FaUserPlus, label: 'Employee Registration', iconColor: '#10b981' },
        { path: '/admin/project_manage', icon: FaChartBar, label: 'Project Management', iconColor: '#3b82f6' },
        { path: '/employee_manage', icon: FaUsers, label: 'Employee Project Management', iconColor: '#f59e0b' },
        { path: '/password_reset', icon: FaRedo, label: 'Password Reset', iconColor: '#ef4444' },
      ],
    },
  ],
};
