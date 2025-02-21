
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = "f38cc9e8dab5eea55dfedc91042ba694";

export const config = getDefaultConfig({
  appName: 'GreenStake',
  projectId: projectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
});

export const chains = [sepolia];
