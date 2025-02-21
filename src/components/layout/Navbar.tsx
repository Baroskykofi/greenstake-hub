
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { Home, PlusCircle, Users, Wallet } from 'lucide-react';

const Navbar = () => {
  const { account, connectWallet } = useWeb3();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary hover:opacity-80 transition-opacity">
              GreenStake
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link
              to="/list-project"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/list-project') ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <PlusCircle size={20} />
              <span>List Project</span>
            </Link>

            <Link
              to="/dao"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dao') ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              <span>DAO</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {account ? (
              <div className="flex items-center px-4 py-2 rounded-lg bg-primary/10 text-primary">
                <Wallet size={20} className="mr-2" />
                <span className="font-medium">{truncateAddress(account)}</span>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white"
              >
                <Wallet size={20} />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
