import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Leaf,
  AlertTriangle,
  Shield,
  Lock,
  Copy,
  ExternalLink,
  Wallet,
  TrendingUp,
  Flame,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shortenHash, generateBurnHash, generateTxHash } from "@/utils/fakeBlockchain";

// Credit listing type
interface CreditListing {
  id: number;
  projectName: string;
  location: string;
  type: string;
  availableTons: number;
  confidenceScore: number;
  anomalyScore: number;
  state: "tradable" | "frozen";
  attestationHash: string;
  evidenceHash: string;
}

// Portfolio credit type
interface PortfolioCredit {
  projectId: number;
  projectName: string;
  tons: number;
  confidenceScore: number;
  lockedCollateral: number;
  retired: boolean;
  retirementHash?: string;
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<CreditListing | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number[]>([10]);
  const [showRetirementModal, setShowRetirementModal] = useState(false);
  const [retireAmount, setRetireAmount] = useState<number[]>([10]);
  const [selectedRetireProject, setSelectedRetireProject] = useState<PortfolioCredit | null>(null);
  const { toast } = useToast();

  // Verified credit listings
  const listings: CreditListing[] = [
    {
      id: 1,
      projectName: "Solar Farm Alpha",
      location: "California, USA",
      type: "Solar Energy",
      availableTons: 496,
      confidenceScore: 93.7,
      anomalyScore: 3.5,
      state: "tradable",
      attestationHash: "0x7a3f8e2c4b9d1a6f5e8c7b4a9d2e1f3c8b7a6d5e4c3b2a1f9e8d7c6b5a4392bc",
      evidenceHash: "0xevd8e2c4b9d1a6f5e8c7b4a9d2e1f3c8b7a6d5e4c3b2a1f9e8d7c6b5a43def1",
    },
    {
      id: 2,
      projectName: "Wind Energy Delta",
      location: "Texas, USA",
      type: "Wind Energy",
      availableTons: 752,
      confidenceScore: 88.5,
      anomalyScore: 5.2,
      state: "tradable",
      attestationHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      evidenceHash: "0xevd2d7f8a9b3c6d5e1f4a2b8c7d6e5f3a9b8c7d6e5f4a3b2c1d9e8f7a6b5712c",
    },
    {
      id: 3,
      projectName: "Reforestation Project Zeta",
      location: "Oregon, USA",
      type: "Reforestation",
      availableTons: 238,
      confidenceScore: 76.4,
      anomalyScore: 15.8,
      state: "tradable",
      attestationHash: "0x9c8b7a6d5e4f3c2b1a9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c3b2a1f9e8d743de",
      evidenceHash: "0xevd9c8b7a6d5e4f3c2b1a9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c3b2a1f9def23",
    },
    {
      id: 4,
      projectName: "Mangrove Conservation Beta",
      location: "Thailand",
      type: "Marine Conservation",
      availableTons: 0,
      confidenceScore: 44.1,
      anomalyScore: 55.3,
      state: "frozen",
      attestationHash: "0xfrz4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
      evidenceHash: "0xevd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1bab42",
    },
    {
      id: 5,
      projectName: "Hydroelectric Gamma",
      location: "Norway",
      type: "Hydroelectric",
      availableTons: 580,
      confidenceScore: 91.2,
      anomalyScore: 4.1,
      state: "tradable",
      attestationHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
      evidenceHash: "0xevd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2bcd45",
    },
  ];

  // User's portfolio
  const [portfolio, setPortfolio] = useState<PortfolioCredit[]>([
    { projectId: 1, projectName: "Solar Farm Alpha", tons: 50, confidenceScore: 93.7, lockedCollateral: 50, retired: false },
    { projectId: 3, projectName: "Reforestation Project Zeta", tons: 25, confidenceScore: 76.4, lockedCollateral: 75, retired: false },
    { projectId: 2, projectName: "Wind Energy Delta", tons: 100, confidenceScore: 88.5, lockedCollateral: 85, retired: false },
  ]);

  // Calculate collateral based on confidence
  const calculateCollateral = (tons: number, confidence: number): number => {
    // Lower confidence = higher collateral requirement
    const riskMultiplier = Math.max(1, (100 - confidence) / 20 + 1);
    return Math.round(tons * riskMultiplier);
  };

  const getRiskLevel = (confidence: number): { level: string; color: string } => {
    if (confidence >= 85) return { level: "Low Risk", color: "text-success" };
    if (confidence >= 70) return { level: "Medium Risk", color: "text-warning" };
    return { level: "High Risk", color: "text-destructive" };
  };

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({ title: "Copied!", description: "Hash copied to clipboard" });
  };

  const handleSimulateTrade = () => {
    if (!selectedListing) return;
    
    const collateral = calculateCollateral(tradeAmount[0], selectedListing.confidenceScore);
    toast({
      title: "Trade Simulation Complete",
      description: `${tradeAmount[0]} credits would require ${collateral} units of collateral based on ${selectedListing.confidenceScore.toFixed(1)}% confidence.`,
    });
  };

  const handleRetireCredits = () => {
    if (!selectedRetireProject) return;

    const burnHash = generateBurnHash();
    
    setPortfolio(prev => prev.map(p => 
      p.projectId === selectedRetireProject.projectId
        ? { ...p, tons: p.tons - retireAmount[0], retired: p.tons - retireAmount[0] === 0, retirementHash: burnHash }
        : p
    ));

    toast({
      title: "Credits Retired Successfully",
      description: `${retireAmount[0]} carbon credits have been permanently retired (burned) on-chain.`,
    });

    setShowRetirementModal(false);
    setSelectedRetireProject(null);
    setRetireAmount([10]);
  };

  // Portfolio stats
  const totalCredits = portfolio.reduce((sum, p) => sum + p.tons, 0);
  const avgConfidence = portfolio.length > 0 
    ? portfolio.reduce((sum, p) => sum + p.confidenceScore * p.tons, 0) / totalCredits 
    : 0;
  const totalCollateral = portfolio.reduce((sum, p) => sum + p.lockedCollateral, 0);
  const retiredCredits = portfolio.filter(p => p.retired).reduce((sum, p) => sum + p.tons, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole="buyer-seller" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Buyer/Seller Dashboard
          </h1>
          <p className="text-muted-foreground">
            Trade verified carbon credits with risk-aware collateral requirements
          </p>
        </div>

        {/* Important Notice */}
        <Card className="p-4 mb-6 border-primary/30 bg-primary/5">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Verification-Enforced Trading</h3>
              <p className="text-sm text-muted-foreground">
                All credits are verified by our AI agent consortium. Collateral requirements are automatically calculated 
                based on confidence scores. Lower confidence credits require higher collateral to mitigate risk.
                Frozen credits cannot be traded until governance review is complete.
              </p>
            </div>
          </div>
        </Card>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Credits Owned</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{totalCredits}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Avg. Confidence</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{avgConfidence.toFixed(1)}%</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Locked Collateral</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{totalCollateral}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Retired Credits</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{retiredCredits}</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Verified Credits Marketplace */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Verified Credits Marketplace</h2>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="tradable">Tradable Only</SelectItem>
                    <SelectItem value="frozen">Frozen Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Listings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-muted-foreground font-medium">Project</th>
                      <th className="text-right py-3 px-3 text-muted-foreground font-medium">Verified Tons</th>
                      <th className="text-right py-3 px-3 text-muted-foreground font-medium">Confidence</th>
                      <th className="text-right py-3 px-3 text-muted-foreground font-medium">Anomaly</th>
                      <th className="text-center py-3 px-3 text-muted-foreground font-medium">State</th>
                      <th className="text-center py-3 px-3 text-muted-foreground font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-3">
                          <div className="font-medium text-foreground">{listing.projectName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {listing.location}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-foreground font-medium">
                          {listing.availableTons.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={getRiskLevel(listing.confidenceScore).color}>
                            {listing.confidenceScore.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={listing.anomalyScore <= 10 ? "text-success" : listing.anomalyScore <= 30 ? "text-warning" : "text-destructive"}>
                            {listing.anomalyScore.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {listing.state === "tradable" ? (
                            <Badge className="bg-success/10 text-success border-success/20">Tradable</Badge>
                          ) : (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                              <Lock className="w-3 h-3 mr-1" />
                              Frozen
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedListing(listing)}
                            disabled={listing.state === "frozen"}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Credit Detail View */}
            {selectedListing && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedListing.projectName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedListing.type} • {selectedListing.location}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedListing(null)}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Credit Info (Read-only) */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      Credit Information
                      <Badge variant="outline" className="text-xs">Read-only</Badge>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Verified Tons:</span>
                        <span className="font-medium text-foreground">{selectedListing.availableTons}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Confidence Score:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedListing.confidenceScore} className="w-16 h-2" />
                          <span className={getRiskLevel(selectedListing.confidenceScore).color}>
                            {selectedListing.confidenceScore.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Anomaly Score:</span>
                        <span className={selectedListing.anomalyScore <= 10 ? "text-success" : "text-warning"}>
                          {selectedListing.anomalyScore.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Attestation:</span>
                        <button
                          onClick={() => copyToClipboard(selectedListing.attestationHash)}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 font-mono text-xs"
                        >
                          {shortenHash(selectedListing.attestationHash, 8)}
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Evidence (IPFS):</span>
                        <button
                          onClick={() => copyToClipboard(selectedListing.evidenceHash)}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 font-mono text-xs"
                        >
                          {shortenHash(selectedListing.evidenceHash, 8)}
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Blockchain State:</span>
                        <Badge className="bg-success/10 text-success border-success/20">On-Chain: Active</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Trade Simulation Panel */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Trade Simulation</h4>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Credits to Trade: {tradeAmount[0]}</Label>
                        <Slider
                          value={tradeAmount}
                          onValueChange={setTradeAmount}
                          max={Math.min(100, selectedListing.availableTons)}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <Card className="p-4 bg-muted/30 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Required Collateral:</span>
                          <span className="font-semibold text-foreground">
                            {calculateCollateral(tradeAmount[0], selectedListing.confidenceScore)} units
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risk Level:</span>
                          <span className={`font-medium ${getRiskLevel(selectedListing.confidenceScore).color}`}>
                            {getRiskLevel(selectedListing.confidenceScore).level}
                          </span>
                        </div>
                      </Card>
                      {selectedListing.confidenceScore < 80 && (
                        <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                            <p className="text-xs text-warning">
                              Lower confidence credits require higher collateral. This credit has {selectedListing.confidenceScore.toFixed(1)}% confidence, 
                              resulting in {((calculateCollateral(tradeAmount[0], selectedListing.confidenceScore) / tradeAmount[0] - 1) * 100).toFixed(0)}% 
                              additional collateral requirement.
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                        <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                          Collateral protects against verification uncertainty. Higher confidence scores indicate more reliable 
                          verification, requiring less collateral. Collateral is released upon credit retirement or sale.
                        </p>
                      </div>
                      <Button onClick={handleSimulateTrade} className="w-full bg-gradient-primary">
                        <Wallet className="w-4 h-4 mr-2" />
                        Simulate Trade
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Portfolio & Retirement */}
          <div className="space-y-6">
            {/* My Portfolio */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">My Portfolio</h3>
              <div className="space-y-3">
                {portfolio.filter(p => p.tons > 0).map((credit) => (
                  <div key={credit.projectId} className="p-3 rounded-lg border border-border hover:bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-foreground text-sm">{credit.projectName}</span>
                      <Badge variant="outline" className="text-xs">{credit.tons} tons</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Confidence: {credit.confidenceScore.toFixed(1)}%</span>
                      <span className="text-muted-foreground">Collateral: {credit.lockedCollateral}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setSelectedRetireProject(credit);
                        setRetireAmount([Math.min(10, credit.tons)]);
                        setShowRetirementModal(true);
                      }}
                    >
                      <Flame className="w-3 h-3 mr-1" />
                      Retire Credits
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Retirement Modal */}
            {showRetirementModal && selectedRetireProject && (
              <Card className="p-6 border-2 border-destructive/30">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-destructive" />
                  Retire Carbon Credits
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Retiring credits permanently burns them on-chain. This action is irreversible and removes the credits from circulation.
                </p>
                <div className="space-y-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="font-medium text-foreground">{selectedRetireProject.projectName}</div>
                    <div className="text-sm text-muted-foreground">Available: {selectedRetireProject.tons} tons</div>
                  </div>
                  <div>
                    <Label className="text-sm">Credits to Retire: {retireAmount[0]}</Label>
                    <Slider
                      value={retireAmount}
                      onValueChange={setRetireAmount}
                      max={selectedRetireProject.tons}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRetireCredits}
                      className="flex-1 bg-destructive hover:bg-destructive/90"
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      Confirm Retirement
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRetirementModal(false);
                        setSelectedRetireProject(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Retired Credits Log */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Retired Credits
              </h3>
              {portfolio.filter(p => p.retirementHash).length > 0 ? (
                <div className="space-y-3">
                  {portfolio.filter(p => p.retirementHash).map((credit) => (
                    <div key={credit.projectId} className="p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="font-medium text-foreground text-sm">{credit.projectName}</div>
                      <div className="text-xs text-muted-foreground mt-1">Retirement Hash:</div>
                      <button
                        onClick={() => copyToClipboard(credit.retirementHash!)}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-mono mt-1"
                      >
                        {shortenHash(credit.retirementHash!, 10)}
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No retired credits yet. Retire credits to permanently offset your carbon footprint.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
