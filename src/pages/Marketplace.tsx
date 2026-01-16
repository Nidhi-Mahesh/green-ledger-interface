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
  Wallet,
  TrendingUp,
  Flame,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shortenHash, generateBurnHash } from "@/utils/fakeBlockchain";
import { useGlobalStore } from "@/context/GlobalStore";

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

const Marketplace = () => {
  const { state, dispatch } = useGlobalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number[]>([10]);
  const [showRetirementModal, setShowRetirementModal] = useState(false);
  const [retireAmount, setRetireAmount] = useState<number[]>([10]);
  const { toast } = useToast();

  // Filter verified projects for the marketplace
  const listings = state.projects.filter(p =>
    (p.status === "verified" || p.status === "tradable" || p.status === "approved-reduced") &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const portfolio = state.portfolio;

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({ title: "Copied!", description: "Hash copied to clipboard" });
  };

  const handleBuyCredits = () => {
    if (!selectedListing) return;

    dispatch({
      type: "BUY_CREDITS",
      payload: {
        projectId: selectedListing.id,
        amount: tradeAmount[0]
      }
    });

    dispatch({
      type: "ADD_AUDIT_EVENT",
      payload: {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        projectId: selectedListing.id,
        projectName: selectedListing.name,
        attestationHash: selectedListing.attestationHash,
        actionType: "trade",
        details: `Purchased ${tradeAmount[0]} credits from "${selectedListing.name}".`,
      },
    });

    toast({
      title: "Credits Purchased",
      description: `Successfully acquired ${tradeAmount[0]} carbon credits.`,
    });

    setSelectedListing(null);
  };

  const handleRetireCredits = () => {
    const burnHash = generateBurnHash();

    dispatch({
      type: "RETIRE_CREDITS",
      payload: { amount: retireAmount[0] }
    });

    dispatch({
      type: "ADD_AUDIT_EVENT",
      payload: {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        projectId: "multiple",
        projectName: "Portfolio Retirement",
        attestationHash: burnHash,
        actionType: "retirement",
        details: `Retired ${retireAmount[0]} carbon credits from personal portfolio.`,
      },
    });

    toast({
      title: "Credits Retired Successfully",
      description: `${retireAmount[0]} carbon credits have been permanently retired (burned) on-chain.`,
    });

    setShowRetirementModal(false);
    setRetireAmount([10]);
  };

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
                All credits are verified by our deterministic multi-agent consortium. Collateral requirements are automatically calculated
                based on confidence scores. Lower confidence credits require higher collateral to mitigate risk.
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
            <div className="text-2xl font-bold text-foreground">{portfolio.creditsOwned}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">System Trust Index</span>
            </div>
            <div className="text-2xl font-bold text-foreground">94.2%</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Locked Collateral</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{Math.round(portfolio.creditsOwned * 1.2)}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Verified Assets</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{state.projects.filter(p => p.status === 'verified' || p.status === 'tradable' || p.status === 'approved-reduced').length}</div>
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
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="solar">Solar Energy</SelectItem>
                    <SelectItem value="wind">Wind Energy</SelectItem>
                    <SelectItem value="reforestation">Reforestation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Listings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-muted-foreground font-medium">Project</th>
                      <th className="text-right py-3 px-3 text-muted-foreground font-medium">Available Tons</th>
                      <th className="text-right py-3 px-3 text-muted-foreground font-medium">Confidence</th>
                      <th className="text-right py-3 px-3 text-muted-foreground font-medium">Anomaly</th>
                      <th className="text-center py-3 px-3 text-muted-foreground font-medium">Status</th>
                      <th className="text-center py-3 px-3 text-muted-foreground font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.length > 0 ? (
                      listings.map((listing) => (
                        <tr key={listing.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-3">
                            <div className="font-medium text-foreground">{listing.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {listing.location}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right text-foreground font-medium">
                            {listing.availableSupply.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className={getRiskLevel(listing.consensusData?.weightedConfidence || 0).color}>
                              {(listing.consensusData?.weightedConfidence || 0).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className={(listing.consensusData?.maxAnomaly || 0) <= 10 ? "text-success" : (listing.consensusData?.maxAnomaly || 0) <= 30 ? "text-warning" : "text-destructive"}>
                              {(listing.consensusData?.maxAnomaly || 0).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {listing.status === "verified" || listing.status === "tradable" ? (
                              <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>
                            ) : (
                              <Badge className="bg-warning/10 text-warning border-warning/20">Reduced</Badge>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedListing(listing)}
                              disabled={listing.availableSupply === 0}
                            >
                              Trade
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground font-mono">
                          NO VERIFIED CREDITS TARGETED FOR MARKETPLACE YET.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Credit Detail View */}
            {selectedListing && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedListing.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedListing.type} • {selectedListing.location}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedListing(null)}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Credit Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      Credit Information
                      <Badge variant="outline" className="text-xs">Immutable Record</Badge>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Available Supply:</span>
                        <span className="font-medium text-foreground">{selectedListing.availableSupply}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Confidence Score:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedListing.consensusData?.weightedConfidence || 0} className="w-16 h-2" />
                          <span className={getRiskLevel(selectedListing.consensusData?.weightedConfidence || 0).color}>
                            {(selectedListing.consensusData?.weightedConfidence || 0).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Max Anomaly Detected:</span>
                        <span className={(selectedListing.consensusData?.maxAnomaly || 0) <= 10 ? "text-success" : "text-warning"}>
                          {(selectedListing.consensusData?.maxAnomaly || 0).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-muted-foreground">Attestation Hash:</span>
                        <button
                          onClick={() => copyToClipboard(selectedListing.attestationHash)}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 font-mono text-xs"
                        >
                          {shortenHash(selectedListing.attestationHash, 12)}
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
                        <Label className="text-sm">Credits to Acquire: {tradeAmount[0]}</Label>
                        <Slider
                          value={tradeAmount}
                          onValueChange={setTradeAmount}
                          max={Math.min(100, selectedListing.availableSupply)}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <Card className="p-4 bg-muted/30 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Required Collateral:</span>
                          <span className="font-semibold text-foreground">
                            {calculateCollateral(tradeAmount[0], selectedListing.consensusData?.weightedConfidence || 0)} units
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risk Level:</span>
                          <span className={`font-medium ${getRiskLevel(selectedListing.consensusData?.weightedConfidence || 0).color}`}>
                            {getRiskLevel(selectedListing.consensusData?.weightedConfidence || 0).level}
                          </span>
                        </div>
                      </Card>
                      <Button onClick={handleBuyCredits} className="w-full bg-gradient-primary">
                        <Wallet className="w-4 h-4 mr-2" />
                        Execute Trade
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Portfolio & Retirement */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">My Portfolio</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Total Offset Capacity</div>
                  <div className="text-3xl font-bold text-foreground">{portfolio.creditsOwned} <span className="text-sm font-normal text-muted-foreground">tons</span></div>
                </div>

                <Button
                  className="w-full"
                  disabled={portfolio.creditsOwned === 0}
                  onClick={() => setShowRetirementModal(true)}
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Retire Credits
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Retiring credits removes them from circulation and creates an immutable burn record.
                </p>
              </div>
            </Card>

            {/* Retirement Modal (inline for simplicity in this view) */}
            {showRetirementModal && (
              <Card className="p-6 border-2 border-destructive/30 bg-destructive/5">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-destructive" />
                  Burn Verification
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Amount to Retire: {retireAmount[0]} tons</Label>
                    <Slider
                      value={retireAmount}
                      onValueChange={setRetireAmount}
                      max={portfolio.creditsOwned}
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
                      Confirm Burn
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRetirementModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Audit Log Hint */}
            <Card className="p-4 text-center bg-muted/10">
              <Info className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                All trades and retirements are logged in the global audit trail with deterministic hashes.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
