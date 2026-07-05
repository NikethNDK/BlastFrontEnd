import { FaHome, FaRedo, FaBell } from 'react-icons/fa';

export const researcherMenuConfig = {
  brand: 'Researcher',
  homePath: '/',
  showUserBlock: true,
  notifications: {
    enabled: true,
    role: 'researcher',
    timeFormat: 'full',
    inset: true,
  },
  sections: [
    {
      title: 'Navigation',
      items: [
        { path: '/masters', icon: FaHome, label: 'Inventory View', iconColor: '#10b981' },
        { path: '/addProductReq', icon: FaRedo, label: 'Request', iconColor: '#3b82f6' },
        {
          path: '/confirm-issue',
          icon: FaBell,
          label: 'Confirm Items',
          iconColor: '#f59e0b',
          badgeFromState: (state) => state.notifications?.researcher?.pendingConfirmations?.length || 0,
        },
        { path: '/change_password', icon: FaRedo, label: 'Change Password', iconColor: '#8b5cf6' },
      ],
    },
  ],
};
