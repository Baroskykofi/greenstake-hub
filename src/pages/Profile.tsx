
import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, MINIMAL_ABI } from '@/lib/web3/contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatEther } from 'viem';

interface DonationActivity {
  donor: string;
  amount: bigint;
  projectId: bigint;
  timestamp: bigint;
}

const Profile = () => {
  const { address } = useAccount();

  // Get user's DAO membership status
  const { data: memberData } = useReadContract({
    address: CONTRACT_ADDRESSES.DAO as `0x${string}`,
    abi: MINIMAL_ABI.DAO,
    functionName: 'members',
    args: [address || '0x0000000000000000000000000000000000000000'],
    query: {
      enabled: !!address,
    },
  });

  // Get user's donation history
  const { data: donationHistory } = useReadContract({
    address: CONTRACT_ADDRESSES.Donate as `0x${string}`,
    abi: MINIMAL_ABI.Donate,
    functionName: 'donorDonations',
    args: [address || '0x0000000000000000000000000000000000000000', 0n],
    query: {
      enabled: !!address,
    },
  }) as { data: DonationActivity };

  if (!address) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Connect Wallet</h1>
          <p className="text-xl text-gray-600">Please connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Wallet Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Connected Address</p>
                <p className="font-medium break-all">{address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">DAO Status</p>
                <Badge variant={memberData?.isMember ? "default" : "secondary"}>
                  {memberData?.isMember ? "DAO Member" : "Not a DAO Member"}
                </Badge>
                {memberData?.isMember && (
                  <p className="mt-2">
                    Staked Amount: {memberData?.stakedAmount ? formatEther(memberData.stakedAmount) : '0'} ETH
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Donation History</CardTitle>
          </CardHeader>
          <CardContent>
            {donationHistory ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Project #{donationHistory.projectId.toString()}</p>
                      <p className="text-sm text-gray-600">
                        Amount: {formatEther(donationHistory.amount)} ETH
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(Number(donationHistory.timestamp) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No donation history found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
