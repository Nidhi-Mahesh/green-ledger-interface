// Scripted Q/A responses for AssistBot

export interface ChatResponse {
  keywords: string[];
  response: string;
}

export const chatResponses: ChatResponse[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello! I'm AssistBot, your guide to CarbonChain. I can help you understand how to buy credits, submit projects, retire credits, and more. What would you like to know?"
  },
  {
    keywords: ['how', 'use', 'website', 'work', 'start', 'begin'],
    response: "Welcome to CarbonChain! Here's how to get started: 1) Create an account and select your role (Project Owner, Verifier, or Buyer/Seller). 2) If you're a buyer, browse the Marketplace to purchase carbon credits. 3) If you're a project owner, submit your carbon offset project for verification. 4) Track all your activities on your Dashboard!"
  },
  {
    keywords: ['buy', 'purchase', 'credit', 'marketplace'],
    response: "To buy carbon credits: 1) Go to the Marketplace page. 2) Browse available listings - you can filter by project type, location, and price. 3) Click on a listing to see project details and verification info. 4) Click 'Buy Credits' and connect your wallet. 5) Complete the transaction to receive tokenized carbon credits. Each token represents 1 ton of CO₂ equivalent!"
  },
  {
    keywords: ['submit', 'project', 'register', 'owner'],
    response: "To submit a carbon offset project: 1) Sign up as a Project Owner. 2) Go to 'My Projects' in your dashboard. 3) Click 'Register New Project' and fill in details like project name, location, type, and expected CO₂ reductions. 4) Upload supporting documents (PDFs, images). 5) Submit for verification. A verified third-party will review your submission!"
  },
  {
    keywords: ['retire', 'burn', 'offset', 'permanent'],
    response: "Retiring credits permanently removes them from circulation to offset your carbon footprint. To retire: 1) Go to the Retirement page. 2) Select credits from your portfolio. 3) Specify the amount to retire. 4) Confirm the retirement - this creates an immutable blockchain record. 5) Download your retirement certificate as proof of your environmental contribution!"
  },
  {
    keywords: ['verify', 'verification', 'verifier', 'approve'],
    response: "Verification ensures carbon credits are legitimate. Verified third-party auditors review project documentation, validate CO₂ reduction claims, and approve or reject submissions. Once approved, credits can be minted as tokens. This process maintains trust and transparency in the carbon credit market."
  },
  {
    keywords: ['blockchain', 'token', 'tokenization', 'mint'],
    response: "Blockchain tokenization converts verified carbon credits into digital tokens. Each token represents 1 ton of CO₂ equivalent and is recorded on the blockchain for transparency. Benefits include: immutable records, easy trading, transparent ownership history, and proof of retirement. All transactions are traceable with unique transaction hashes!"
  },
  {
    keywords: ['wallet', 'connect', 'crypto'],
    response: "To use CarbonChain's trading features, you'll need to connect a blockchain wallet. Go to your Profile settings, click 'Connect Wallet', and follow the prompts. For the MVP, we're using testnet - no real cryptocurrency required! Your wallet stores your carbon credit tokens securely."
  },
  {
    keywords: ['dashboard', 'activity', 'balance'],
    response: "Your Dashboard shows: 1) Active carbon credits in your portfolio. 2) Total portfolio value. 3) Recent transactions and activities. 4) Pending verifications or trade offers. 5) Quick action buttons based on your role. It's your central hub for managing all CarbonChain activities!"
  },
  {
    keywords: ['audit', 'history', 'transaction', 'log'],
    response: "The Audit page provides a comprehensive log of all carbon credit transactions. You can search by project, user, or transaction type. View the complete lifecycle of credits from issuance to retirement. All records are immutable and stored on the blockchain for full transparency."
  },
  {
    keywords: ['help', 'support', 'contact'],
    response: "I'm here to help! You can ask me about: buying credits, submitting projects, retiring credits, verification process, blockchain tokenization, or how to use any feature. For technical support, visit your Profile and check the Help section."
  },
  {
    keywords: ['price', 'cost', 'fee'],
    response: "Carbon credit prices vary based on project type, location, and verification status. You can see current prices on the Marketplace. Transaction fees are minimal and displayed before you confirm any purchase. Premium verified projects from recognized standards may command higher prices."
  }
];

export const getDefaultResponse = (): string => {
  return "I'm not sure I understood that. You can ask me about: How to use this website, buying carbon credits, submitting projects, retiring credits, verification process, or blockchain tokenization. How can I help you today?";
};

export const findResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  for (const item of chatResponses) {
    if (item.keywords.some(keyword => lowercaseInput.includes(keyword))) {
      return item.response;
    }
  }
  
  return getDefaultResponse();
};
