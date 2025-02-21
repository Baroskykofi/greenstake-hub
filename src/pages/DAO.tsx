
import React from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, MINIMAL_ABI } from '@/lib/web3/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatEther } from 'viem';
import { toast } from 'sonner';
import { sepolia } from 'wagmi/chains';

interface Member {
  stakedAmount: bigint;
  isMember: boolean;
}

interface ProjectRequest {
  projectId: bigint;
  projectOwner: string;
  name: string;
  description: string;
  yesVotes: bigint;
  noVotes: bigint;
  isApproved: boolean;
  isProcessed: boolean;
}

const DAO = () => {
  const { address } = useAccount();

  // Read minimum stake amount
  const { data: minimumStake } = useReadContract({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'minStakeAmount',
  }) as { data: bigint };

  // Check if user is a member
  const { data: memberData } = useReadContract({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'members',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: !!address,
    },
  }) as { data: Member };

  // Get project requests
  const { data: projectRequests } = useReadContract({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'projectRequests',
    args: [0n],
  }) as { data: ProjectRequest };

  // Contract write operations
  const { writeContract: joinDAO, isPending: isJoining } = useWriteContract();
  const { writeContract: voteOnProject, isPending: isVoting } = useWriteContract();

  const handleJoinDAO = async () => {
    if (!minimumStake || !address) return;
    try {
      joinDAO({
        address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
        abi: MINIMAL_ABI.DAO,
        functionName: 'joinDAO',
        value: minimumStake,
        chain: sepolia,
        account: address,
      });
      toast.success('Transaction submitted');
    } catch (error) {
      console.error('Error joining DAO:', error);
      toast.error('Failed to join DAO');
    }
  };

  const handleVote = async (projectId: bigint, support: boolean) => {
    if (!address) return;
    try {
      voteOnProject({
        address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
        abi: MINIMAL_ABI.DAO,
        functionName: 'voteOnProject',
        args: [projectId, support],
        chain: sepolia,
        account: address,
      });
      toast.success('Vote submitted');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Connect Wallet</h1>
          <p className="text-xl text-gray-600">Please connect your wallet to access the DAO</p>
        </div>
      </div>
    );
  }

  const isMember = memberData?.isMember;
  const minStakeAmount = minimumStake ? formatEther(minimumStake) : '0';

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
                  <p className="font-medium">{minStakeAmount} ETH</p>
                </div>
              </div>

              {!isMember && (
                <Button
                  onClick={handleJoinDAO}
                  disabled={isJoining}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isJoining ? 'Joining...' : 'Join DAO'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {isMember && projectRequests && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Active Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{projectRequests.name}</h3>
                    <div className="flex space-x-4">
                      <span className="text-green-600">Yes: {projectRequests.yesVotes.toString()}</span>
                      <span className="text-red-600">No: {projectRequests.noVotes.toString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{projectRequests.description}</p>
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => handleVote(0n, true)}
                      disabled={isVoting}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      Vote Yes
                    </Button>
                    <Button
                      onClick={() => handleVote(0n, false)}
                      disabled={isVoting}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      Vote No
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DAO;
