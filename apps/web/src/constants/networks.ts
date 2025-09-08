export type Network = {
  id: string;
  type: string;
  name: string;
  logo: string;
};

export const NETWORKS: Network[] = [
  {
    id: 'mitosis',
    type: 'evm',
    name: 'Mitosis',
    logo: '/assets/icons/mitosis.png',
  },
];
