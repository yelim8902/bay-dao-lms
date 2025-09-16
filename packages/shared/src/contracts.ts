// Bay LMS Contract Addresses (Sepolia)
export const CONTRACTS = {
  MOCK_TOKEN: "0xC5573f5c73AE55520bd8f245B74FcfcFBF2cF229",
  COHORT_MANAGER: "0xBdF40195cA36fe5De069eEE47E771E33d966e037",
  DEPOSIT_ESCROW: "0x34709262fc0AE346a420d892Db7Da4C52935aC99",
  ASSIGNMENT_REGISTRY: "0x76Be44EcFDf1886eF9aAadbc181e3348436D22ad",
  VERIFIER_GATEWAY: "0x32C48Af25fB4C4C6Fa56E542333B5f7D77EC35cF",
  BAY_CERTIFICATE: "0x169dDa5Dee64Ba4CA51dFdadB0D720580C98424D",
} as const;

// EAS (Ethereum Attestation Service) Addresses
export const EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
export const SCHEMA_REGISTRY = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";

// Network Configuration
export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia
  name: "Sepolia",
  rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY",
  blockExplorer: "https://sepolia.etherscan.io",
} as const;
