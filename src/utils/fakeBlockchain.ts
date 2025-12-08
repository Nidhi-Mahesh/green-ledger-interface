// Fake blockchain helper module for MVP
// Generates realistic-looking transaction hashes

export const generateTxHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const generateAttestationHash = (): string => {
  return generateTxHash();
};

export const generateBurnHash = (): string => {
  return generateTxHash();
};

export const shortenHash = (hash: string, chars: number = 6): string => {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
};

export interface BlockchainTransaction {
  hash: string;
  type: 'purchase' | 'mint' | 'transfer' | 'retirement';
  timestamp: Date;
  from?: string;
  to?: string;
  amount?: number;
  projectId?: string;
}

export const createTransaction = (
  type: BlockchainTransaction['type'],
  details?: Partial<BlockchainTransaction>
): BlockchainTransaction => {
  return {
    hash: generateTxHash(),
    type,
    timestamp: new Date(),
    ...details,
  };
};

// Fake wallet addresses
export const generateWalletAddress = (): string => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

// ============================================
// SMART CONTRACTS
// ============================================

export interface SmartContract {
  address: string;
  name: string;
  description: string;
  version: string;
  deployedAt: Date;
  functions: ContractFunction[];
}

export interface ContractFunction {
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

// 1. CarbonCreditToken (ERC-1155) - Tokenized carbon credits
export const CarbonCreditTokenContract: SmartContract = {
  address: '0x7a3B9c4D8E1F2a5B6C7D8E9F0A1B2C3D4E5F6A7B',
  name: 'CarbonCreditToken',
  description: 'ERC-1155 multi-token contract for minting, transferring, and managing tokenized carbon credits. Each token ID represents a unique verified project, and token amounts represent tons of CO2 equivalent.',
  version: '1.0.0',
  deployedAt: new Date('2024-01-15'),
  functions: [
    {
      name: 'mint',
      description: 'Mint new carbon credit tokens for a verified project',
      inputs: ['address to', 'uint256 projectId', 'uint256 amount', 'bytes data'],
      outputs: ['bool success'],
    },
    {
      name: 'burn',
      description: 'Permanently retire carbon credits (burn tokens)',
      inputs: ['address from', 'uint256 projectId', 'uint256 amount'],
      outputs: ['bool success', 'bytes32 retirementCertificate'],
    },
    {
      name: 'balanceOf',
      description: 'Get carbon credit balance for an address and project',
      inputs: ['address account', 'uint256 projectId'],
      outputs: ['uint256 balance'],
    },
    {
      name: 'safeTransferFrom',
      description: 'Transfer carbon credits between addresses',
      inputs: ['address from', 'address to', 'uint256 projectId', 'uint256 amount', 'bytes data'],
      outputs: ['bool success'],
    },
  ],
};

// 2. CarbonMarketplace - Decentralized trading of carbon credits
export const CarbonMarketplaceContract: SmartContract = {
  address: '0x2B4C6D8E0F1A3B5C7D9E1F3A5B7C9D1E3F5A7B9C',
  name: 'CarbonMarketplace',
  description: 'Decentralized marketplace for listing, buying, and selling carbon credit tokens. Supports fixed-price listings and auction-style sales with automatic escrow.',
  version: '1.0.0',
  deployedAt: new Date('2024-01-20'),
  functions: [
    {
      name: 'createListing',
      description: 'List carbon credits for sale at a fixed price',
      inputs: ['uint256 projectId', 'uint256 amount', 'uint256 pricePerToken'],
      outputs: ['uint256 listingId'],
    },
    {
      name: 'purchaseCredits',
      description: 'Buy carbon credits from an active listing',
      inputs: ['uint256 listingId', 'uint256 amount'],
      outputs: ['bool success', 'bytes32 txHash'],
    },
    {
      name: 'cancelListing',
      description: 'Cancel an active listing and return credits to seller',
      inputs: ['uint256 listingId'],
      outputs: ['bool success'],
    },
    {
      name: 'getListingDetails',
      description: 'Get details of a marketplace listing',
      inputs: ['uint256 listingId'],
      outputs: ['address seller', 'uint256 projectId', 'uint256 amount', 'uint256 price', 'bool active'],
    },
  ],
};

// 3. ProjectRegistry - On-chain project verification and attestation
export const ProjectRegistryContract: SmartContract = {
  address: '0x9C1D3E5F7A9B1D3E5F7A9B1D3E5F7A9B1D3E5F7A',
  name: 'ProjectRegistry',
  description: 'Stores verified carbon offset project metadata and verification attestations on-chain. Links off-chain documents to immutable blockchain records.',
  version: '1.0.0',
  deployedAt: new Date('2024-01-10'),
  functions: [
    {
      name: 'registerProject',
      description: 'Register a new carbon offset project',
      inputs: ['string name', 'string location', 'string projectType', 'bytes32 documentHash'],
      outputs: ['uint256 projectId'],
    },
    {
      name: 'verifyProject',
      description: 'Submit verification attestation for a project (verifiers only)',
      inputs: ['uint256 projectId', 'bool approved', 'uint256 creditsAwarded', 'string comments'],
      outputs: ['bytes32 attestationHash'],
    },
    {
      name: 'getProjectStatus',
      description: 'Get verification status of a project',
      inputs: ['uint256 projectId'],
      outputs: ['uint8 status', 'address verifier', 'uint256 verifiedAt'],
    },
    {
      name: 'getAttestation',
      description: 'Get verification attestation details',
      inputs: ['uint256 projectId'],
      outputs: ['bytes32 attestationHash', 'uint256 creditsAwarded', 'string comments'],
    },
  ],
};

// All deployed contracts
export const DEPLOYED_CONTRACTS = [
  CarbonCreditTokenContract,
  CarbonMarketplaceContract,
  ProjectRegistryContract,
];
