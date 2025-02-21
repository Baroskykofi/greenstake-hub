
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Users, Coins } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-green-600">GreenStake</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A decentralized platform for funding and supporting sustainable projects through community governance
            </p>
            <Button
              onClick={() => navigate('/projects')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full"
            >
              Explore Projects <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Transparent</h3>
              <p className="text-gray-600">
                All transactions are recorded on the blockchain, ensuring complete transparency and security
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Governed</h3>
              <p className="text-gray-600">
                Join our DAO to participate in project approvals and platform governance
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Funding</h3>
              <p className="text-gray-600">
                Support projects directly with cryptocurrency and track your contributions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of changemakers and start supporting sustainable projects today
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/list-project')}
              className="bg-green-600 hover:bg-green-700"
            >
              List Your Project
            </Button>
            <Button
              onClick={() => navigate('/projects')}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              Browse Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
