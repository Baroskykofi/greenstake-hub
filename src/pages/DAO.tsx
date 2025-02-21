
import React, { useState } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESSES, MINIMAL_ABI } from '@/lib/web3/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ethers } from 'ethers';
import { toast } from 'sonner';

interface ProjectVotes {
  projectId: number;
  projectOwner: string;
  name: string;
  description: string;
  yesVotes: number;
  noVotes: number;
  isApproved: boolean;
  isProcessed: boolean;
}

const DAO = () => {
  const { address: account } = useAccount();
  const [loading, setLoading] = useState(false);

  // Read minimum stake amount
  const { data: minimumStake } = useContractRead({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'minStakeAmount',
  });

  // Check if user is a member
  const { data: memberData } = useContractRead({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'members',
    args: [account || ethers.constants.AddressZero],
    enabled: !!account,
  });

  // Get project requests
  const { data: projectRequests } = useContractRead({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'projectRequests',
    args: [0], // Start with first project
  });

  // Join DAO transaction
  const { write: joinDAO, data: joinTxData } = useContractWrite({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'joinDAO',
  });

  const { isLoading: isJoinLoading } = useWaitForTransaction({
    hash: joinTxData?.hash,
    onSuccess() {
      toast.success('Successfully joined the DAO!');
    },
    onError() {
      toast.error('Failed to join DAO');
    },
  });

  // Vote on project transaction
  const { write: voteOnProject, data: voteTxData } = useContractWrite({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'voteOnProject',
  });

  const { isLoading: isVoteLoading } = useWaitForTransaction({
    hash: voteTxData?.hash,
    onSuccess() {
      toast.success('Vote recorded successfully!');
    },
    onError() {
      toast.error('Failed to record vote');
    },
  });

  const handleJoinDAO = async () => {
    if (!minimumStake) return;
    try {
      joinDAO({ value: minimumStake });
    } catch (error) {
      console.error('Error joining DAO:', error);
      toast.error('Failed to join DAO');
    }
  };

  const handleVote = async (projectId: number, support: boolean) => {
    try {
      voteOnProject({ args: [projectId, support] });
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
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

  const isMember = memberData?.isMember;
  const minStakeAmount = minimumStake ? ethers.utils.formatEther(minimumStake) : '0';

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
                  disabled={isJoinLoading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isJoinLoading ? 'Joining...' : 'Join DAO'}
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
                      onClick={() => handleVote(0, true)}
                      disabled={isVoteLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      Vote Yes
                    </Button>
                    <Button
                      onClick={() => handleVote(0, false)}
                      disabled={isVoteLoading}
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
