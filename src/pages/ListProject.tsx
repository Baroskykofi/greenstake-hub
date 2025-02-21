
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { CONTRACT_ADDRESSES, MINIMAL_ABI, getContract } from '@/lib/web3/contracts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ethers } from 'ethers';
import { toast } from 'sonner';

const ListProject = () => {
  const { provider, signer, account } = useWeb3();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subscriptionFee, setSubscriptionFee] = useState<string>('0');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const fetchSubscriptionFee = async () => {
      if (!provider) return;

      try {
        const contract = getContract(
          CONTRACT_ADDRESSES.PROJECT_LISTING,
          MINIMAL_ABI.ProjectListing,
          provider
        );
        const fee = await contract.subscriptionFee();
        setSubscriptionFee(fee.toString());
      } catch (error) {
        console.error('Error fetching subscription fee:', error);
        toast.error('Failed to fetch subscription fee');
      }
    };

    fetchSubscriptionFee();
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const contract = getContract(
        CONTRACT_ADDRESSES.PROJECT_LISTING,
        MINIMAL_ABI.ProjectListing,
        signer
      );

      const tx = await contract.listProject(
        formData.name,
        formData.description,
        { value: subscriptionFee }
      );
      
      toast.success('Project listing transaction submitted');
      await tx.wait();
      
      toast.success('Project listed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error listing project:', error);
      toast.error('Failed to list project');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Connect Wallet</h1>
          <p className="text-xl text-gray-600">Please connect your wallet to list a project</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">List Your Project</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Project Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Project Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Subscription Fee: {ethers.utils.formatEther(subscriptionFee)} ETH
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Listing Project...' : 'List Project'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListProject;
