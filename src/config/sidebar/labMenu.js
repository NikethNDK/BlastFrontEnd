import {
  FaHome,
  FaPlus,
  FaUpload,
  FaDownload,
  FaDatabase,
  FaUndo,
  FaFileAlt,
  FaCog,
} from 'react-icons/fa';

export const labMenuConfig = {
  brand: 'Lab Management',
  homePath: '/',
  showUserBlock: true,
  notifications: {
    enabled: true,
    role: 'lab_assistant',
    timeFormat: 'relative',
    inset: false,
  },
  sections: [
    {
      title: 'Inventory Management',
      items: [
        { path: '/master', icon: FaHome, label: 'Inventory View', iconColorClass: 'color-primary' },
        { path: '/received_product', icon: FaUpload, label: 'Add Received Item', iconColorClass: 'color-success' },
        { path: '/issued_product', icon: FaDownload, label: 'Add Issued Item', iconColorClass: 'color-danger' },
        { path: '/transferred', icon: FaUndo, label: 'Add Returned Item', iconColorClass: 'color-warning' },
      ],
    },
    {
      title: 'Data & Reports',
      items: [
        { path: '/returntable', icon: FaDatabase, label: 'Received Data', iconColorClass: 'color-info' },
        { path: '/issuetable', icon: FaFileAlt, label: 'Issued Data', iconColorClass: 'color-info' },
        { path: '/retrun', icon: FaUndo, label: 'Return Data', iconColorClass: 'color-info' },
        { path: '/add_product', icon: FaPlus, label: 'Add New Data', iconColorClass: 'color-info' },
      ],
    },
  ],
  accountSection: {
    title: 'Account',
    items: [
      { path: '/change_password', icon: FaCog, label: 'Change Password', iconColorClass: 'color-neutral' },
    ],
  },
};
