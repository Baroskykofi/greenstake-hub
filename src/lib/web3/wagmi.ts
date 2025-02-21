
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const projectId = "f38cc9e8dab5eea55dfedc91042ba694";

const { wallets } = getDefaultWallets({
  appName: 'GreenStake',
  projectId,
});

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: wallets,
});

export const chains = [sepolia];
