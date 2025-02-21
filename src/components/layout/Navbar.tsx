
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Users } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-green-600 hover:opacity-80 transition-opacity">
              GreenStake
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/projects"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/projects') ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <Home size={20} />
              <span>Projects</span>
            </Link>

            <Link
              to="/list-project"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/list-project') ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <PlusCircle size={20} />
              <span>List Project</span>
            </Link>

            <Link
              to="/dao"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dao') ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              <span>DAO</span>
            </Link>
          </div>

          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
