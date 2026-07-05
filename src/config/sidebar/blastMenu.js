import { FaDatabase } from 'react-icons/fa';

export const blastMenuConfig = {
  brand: 'DNA Blast',
  homePath: '/',
  showUserBlock: true,
  notifications: { enabled: false },
  sections: [
    {
      title: 'Navigation',
      items: [
        {
          path: '/dna',
          icon: FaDatabase,
          label: 'Repository',
          iconColorClass: 'color-primary',
        },
      ],
    },
  ],
};
