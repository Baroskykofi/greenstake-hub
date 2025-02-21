
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  connectWallet: async () => {},
  provider: null,
  signer: null,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask to use this dApp');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      const signer = provider.getSigner();

      setAccount(accounts[0]);
      setChainId(network.chainId);
      setProvider(provider);
      setSigner(signer);
      
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ account, chainId, connectWallet, provider, signer }}>
      {children}
    </Web3Context.Provider>
  );
};
