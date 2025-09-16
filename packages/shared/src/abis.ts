// MockERC20 ABI
export const MOCK_TOKEN_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
] as const;

// DepositEscrow ABI
export const DEPOSIT_ESCROW_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "cohortId", type: "bytes32" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "cohortId", type: "bytes32" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "cohortId", type: "bytes32" }],
    name: "selfRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "cohortId", type: "bytes32" },
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "bps", type: "uint256" },
    ],
    name: "slash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "cohortId", type: "bytes32" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "getStake",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bool", name: "settled", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "cohortId",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "cohortId",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Refund",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "cohortId",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "slashAmount",
        type: "uint256",
      },
    ],
    name: "Slash",
    type: "event",
  },
] as const;

// AssignmentRegistry ABI
export const ASSIGNMENT_REGISTRY_ABI = [
  "function submit(bytes32 cohortId, uint256 assignmentId, bytes32 cidHash, string[] calldata links)",
  "function getSubmission(bytes32 cohortId, uint256 assignmentId, address student) view returns (tuple(bytes32 cidHash, uint40 submittedAt, string[] links, bool isLate))",
  "function isSubmissionLate(bytes32 cohortId, uint256 assignmentId, address student) view returns (bool)",
  "event AssignmentSubmitted(bytes32 indexed cohortId, uint256 indexed assignmentId, address indexed student, bytes32 cidHash, string[] links)",
] as const;

// CohortManager ABI
export const COHORT_MANAGER_ABI = [
  "function createCohort(bytes32 cohortId, string calldata name, string calldata track, uint256 depositAmount, uint256 startAt, uint256 endAt, uint256 minPassRate)",
  "function createTeam(bytes32 teamId, bytes32 cohortId, string calldata name)",
  "function addTeamMember(bytes32 teamId, address member)",
  "function getCohort(bytes32 cohortId) view returns (tuple(bytes32 id, string name, string track, uint256 depositAmount, uint256 startAt, uint256 endAt, uint256 minPassRate, bool isActive))",
  "function getTeam(bytes32 teamId) view returns (tuple(bytes32 id, bytes32 cohortId, string name, address leader, address[] members, bool depositCompleted))",
  "function isTeamMember(bytes32 teamId, address member) view returns (bool)",
] as const;

// BayCertificate ABI
export const BAY_CERTIFICATE_ABI = [
  "function mint(address to, uint256 tokenId, string memory uri, bytes32 cohortId)",
  "function batchMint(address[] calldata recipients, uint256[] calldata tokenIds, string[] calldata uris, bytes32 cohortId)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function locked(uint256 tokenId) view returns (bool)",
  "event CertificateMinted(address indexed to, uint256 indexed tokenId, string uri, bytes32 indexed cohortId)",
] as const;
