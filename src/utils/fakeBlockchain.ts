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
