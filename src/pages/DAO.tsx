
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { CONTRACT_ADDRESSES, MINIMAL_ABI, getContract } from '@/lib/web3/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ethers } from 'ethers';
import { toast } from 'sonner';

interface ProjectVotes {
  projectId: number;
  yesVotes: number;
  noVotes: number;
}

const DAO = () => {
  const { provider, signer, account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [minimumStake, setMinimumStake] = useState<string>('0');
  const [isMember, setIsMember] = useState(false);
  const [projectVotes, setProjectVotes] = useState<ProjectVotes[]>([]);

  const fetchDAOData = async () => {
    if (!provider || !account) return;

    try {
      const contract = getContract(
        CONTRACT_ADDRESSES.DAO,
        MINIMAL_ABI.DAO,
        provider
      );

      // Fetch minimum stake
      const stake = await contract.getMinimumStake();
      setMinimumStake(stake.toString());

      // Check if connected wallet is a member
      const memberStatus = await contract.isMember(account);
      setIsMember(memberStatus);

      // For this example, we'll check votes for the first 5 projects
      // In a production environment, you'd want to get the actual list of projects
      const votes = await Promise.all(
        Array(5).fill(0).map(async (_, index) => {
          try {
            const [yes, no] = await contract.getProjectVotes(index);
            return {
              projectId: index,
              yesVotes: yes.toNumber(),
              noVotes: no.toNumber()
            };
          } catch (error) {
            return null;
          }
        })
      );

      setProjectVotes(votes.filter(v => v !== null));
    } catch (error) {
      console.error('Error fetching DAO data:', error);
      toast.error('Failed to fetch DAO data');
    }
  };

  useEffect(() => {
    fetchDAOData();
  }, [provider, account]);

  const handleJoinDAO = async () => {
    if (!signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    setJoinLoading(true);
    try {
      const contract = getContract(
        CONTRACT_ADDRESSES.DAO,
        MINIMAL_ABI.DAO,
        signer
      );

      const tx = await contract.joinDAO({ value: minimumStake });
      await tx.wait();
      
      toast.success('Successfully joined the DAO!');
      setIsMember(true);
    } catch (error) {
      console.error('Error joining DAO:', error);
      toast.error('Failed to join DAO');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleVote = async (projectId: number, support: boolean) => {
    if (!signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const contract = getContract(
        CONTRACT_ADDRESSES.DAO,
        MINIMAL_ABI.DAO,
        signer
      );

      const tx = await contract.voteOnProject(projectId, support);
      await tx.wait();
      
      toast.success('Vote recorded successfully!');
      fetchDAOData(); // Refresh votes
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Connect Wallet</h1>
          <p className="text-xl text-gray-600">Please connect your wallet to access the DAO</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">DAO Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={isMember ? "default" : "secondary"}>
                    {isMember ? "Member" : "Not a Member"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Minimum Stake</p>
                  <p className="font-medium">{ethers.utils.formatEther(minimumStake)} ETH</p>
                </div>
              </div>

              {!isMember && (
                <Button
                  onClick={handleJoinDAO}
                  disabled={joinLoading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {joinLoading ? 'Joining...' : 'Join DAO'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {isMember && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Active Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectVotes.length === 0 ? (
                  <p className="text-center text-gray-600">No active proposals</p>
                ) : (
                  projectVotes.map((vote) => (
                    <div key={vote.projectId} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Project #{vote.projectId}</h3>
                        <div className="flex space-x-4">
                          <span className="text-green-600">Yes: {vote.yesVotes}</span>
                          <span className="text-red-600">No: {vote.noVotes}</span>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Button
                          onClick={() => handleVote(vote.projectId, true)}
                          disabled={loading}
                          className="flex-1 bg-green-500 hover:bg-green-600"
                        >
                          Vote Yes
                        </Button>
                        <Button
                          onClick={() => handleVote(vote.projectId, false)}
                          disabled={loading}
                          className="flex-1 bg-red-500 hover:bg-red-600"
                        >
                          Vote No
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DAO;
