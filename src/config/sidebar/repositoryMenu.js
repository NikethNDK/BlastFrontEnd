import { FaDatabase } from 'react-icons/fa';
import { FcBiotech, FcBiohazard } from 'react-icons/fc';

export const repositoryMenuConfig = {
  brand: 'DNA Repository',
  homePath: '/',
  showUserBlock: true,
  notifications: { enabled: false },
  sections: [
    {
      title: 'Navigation',
      items: [
        { path: '/dna', icon: FcBiotech, label: 'Overview' },
        { path: '/add_dna', icon: FcBiohazard, label: 'New Submission' },
        { path: '/add_blast', icon: FaDatabase, label: 'Blast', iconColorClass: 'color-primary' },
      ],
    },
  ],
};
