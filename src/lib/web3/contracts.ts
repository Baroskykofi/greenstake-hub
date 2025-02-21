
export const CONTRACT_ADDRESSES = {
  PROJECT_LISTING: '0x1955E7bFed7499c0a71394976Beb8d8AC33ABcd7',
  DAO: '0xA5124D1c1f6e06F6956f77DE2917983D93840993',
  DONATE: '0x4C597Bc2CC4ca87efC738EFDeFD487E27833df4a'
};

export const MINIMAL_ABI = {
  DAO: [
    "function joinDAO() payable",
    "function minStakeAmount() view returns (uint256)",
    "function members(address) view returns (tuple(uint256 stakedAmount, bool isMember))",
    "function projectRequests(uint256) view returns (tuple(uint256 projectId, address projectOwner, string name, string description, uint256 yesVotes, uint256 noVotes, bool isApproved, bool isProcessed))",
    "function voteOnProject(uint256 projectId, bool vote)",
    "function hasVoted(uint256, address) view returns (bool)",
    "event NewMember(address indexed member, uint256 stakedAmount)",
    "event Voted(address indexed voter, uint256 indexed projectId, bool support)"
  ],
  Donate: [
    "function donateToProject(uint256 projectId) payable",
    "function totalDonationsPerProject(uint256) view returns (uint256)",
    "function donorDonations(address, uint256) view returns (tuple(address donor, uint256 amount, uint256 projectId, uint256 timestamp))",
    "event Donation(address indexed donor, uint256 indexed projectId, uint256 amount)"
  ],
  ProjectListing: [
    "function listProject(string name, string description) payable",
    "function projects(uint256) view returns (tuple(uint256 id, string name, string description, address owner, uint256 subscriptionEndTime, bool isListed, uint256 totalDonations))",
    "function subscriptionFee() view returns (uint256)",
    "function projectCounter() view returns (uint256)",
    "event ProjectListed(uint256 indexed projectId, address indexed owner, string name)"
  ]
};

export const getContract = (
  address: string,
  abi: any[],
  signer: any
) => {
  return new signer.Contract(address, abi);
};
