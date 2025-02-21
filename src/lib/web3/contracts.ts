
import { ethers } from 'ethers';

export const CONTRACT_ADDRESSES = {
  PROJECT_LISTING: '0x1955E7bFed7499c0a71394976Beb8d8AC33ABcd7',
  DAO: '0xA5124D1c1f6e06F6956f77DE2917983D93840993',
  DONATE: '0x4C597Bc2CC4ca87efC738EFDeFD487E27833df4a'
};

// ABI definitions would go here - for now using minimal interfaces
export const MINIMAL_ABI = {
  ProjectListing: [
    "function listProject(string name, string description) payable",
    "function getProject(uint256 projectId) view returns (tuple(string name, string description, address owner, uint256 endTime, uint256 totalDonations, bool isListed))",
    "function getAllProjects() view returns (tuple(string name, string description, address owner, uint256 endTime, uint256 totalDonations, bool isListed)[])",
    "function subscriptionFee() view returns (uint256)"
  ],
  DAO: [
    "function joinDAO() payable",
    "function voteOnProject(uint256 projectId, bool support)",
    "function isMember(address account) view returns (bool)",
    "function getMinimumStake() view returns (uint256)",
    "function getProjectVotes(uint256 projectId) view returns (uint256 yes, uint256 no)"
  ],
  Donate: [
    "function donateToProject(uint256 projectId) payable",
    "function getProjectDonations(uint256 projectId) view returns (uint256)"
  ]
};

export const getContract = (
  address: string,
  abi: any[],
  signer: ethers.Signer | ethers.providers.Provider
) => {
  return new ethers.Contract(address, abi, signer);
};
