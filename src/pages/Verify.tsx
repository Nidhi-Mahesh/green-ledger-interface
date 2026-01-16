import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  MapPin,
  Calendar,
  CheckCircle,
  Lock,
  Copy,
  ExternalLink,
  Bot,
  Satellite,
  AlertTriangle,
  Calculator,
  Shield,
  RefreshCw,
  Eye,
  Hash,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { shortenHash, generateAttestationHash } from "@/utils/fakeBlockchain";

// Project data structure for verifier view
interface VerifierProject {
  id: number;
  name: string;
  owner: string;
  type: string;
  location: string;
  claimedReduction: number;
  submittedDate: string;
  status: "approved" | "approved-reduced" | "frozen";
  verifiedTons: number;
  weightedConfidence: number;
  attestationHash: string;
  mintTxHash: string | null;
  onChainState: "minted" | "frozen" | "pending";
  agentResults: {
    agentName: string;
    confidenceScore: number;
    anomalyScore: number;
    estimatedTons: number;
    weight: number;
  }[];
  consensusSteps: {
    step: string;
    value: string;
    formula?: string;
  }[];
}

const Verify = () => {
  const [selectedProject, setSelectedProject] = useState<VerifierProject | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayResult, setReplayResult] = useState<{ match: boolean; computedHash: string } | null>(null);
  const { toast } = useToast();

  // All projects visible to verifier (read-only audit view)
  const projects: VerifierProject[] = [
    {
      id: 1,
      name: "Solar Farm Alpha",
      owner: "GreenTech Solutions",
      type: "Solar Energy",
      location: "California, USA",
      claimedReduction: 500,
      submittedDate: "2024-01-15",
      status: "approved",
      verifiedTons: 496,
      weightedConfidence: 93.7,
      attestationHash: "0x7a3f8e2c4b9d1a6f5e8c7b4a9d2e1f3c8b7a6d5e4c3b2a1f9e8d7c6b5a4392bc",
      mintTxHash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
      onChainState: "minted",
      agentResults: [
        { agentName: "Baseline Agent", confidenceScore: 94.2, anomalyScore: 2.1, estimatedTons: 498, weight: 0.35 },
        { agentName: "Satellite Agent", confidenceScore: 91.8, anomalyScore: 3.5, estimatedTons: 492, weight: 0.40 },
        { agentName: "Anomaly Detection Agent", confidenceScore: 96.5, anomalyScore: 1.2, estimatedTons: 500, weight: 0.25 },
      ],
      consensusSteps: [
        { step: "Weighted Confidence", value: "93.7%", formula: "(94.2×0.35) + (91.8×0.40) + (96.5×0.25)" },
        { step: "Weighted Tons", value: "496", formula: "(498×0.35) + (492×0.40) + (500×0.25)" },
        { step: "Anomaly Threshold Check", value: "PASS", formula: "max(2.1, 3.5, 1.2) < 10%" },
        { step: "Confidence Threshold Check", value: "PASS", formula: "93.7% > 70%" },
        { step: "Final Decision", value: "APPROVED", formula: "All checks passed" },
      ],
    },
    {
      id: 2,
      name: "Reforestation Project Zeta",
      owner: "EcoForest Initiative",
      type: "Reforestation",
      location: "Oregon, USA",
      claimedReduction: 300,
      submittedDate: "2024-01-20",
      status: "approved-reduced",
      verifiedTons: 238,
      weightedConfidence: 76.4,
      attestationHash: "0x9c8b7a6d5e4f3c2b1a9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c3b2a1f9e8d743de",
      mintTxHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      onChainState: "minted",
      agentResults: [
        { agentName: "Baseline Agent", confidenceScore: 78.3, anomalyScore: 12.5, estimatedTons: 245, weight: 0.35 },
        { agentName: "Satellite Agent", confidenceScore: 72.1, anomalyScore: 15.8, estimatedTons: 228, weight: 0.40 },
        { agentName: "Anomaly Detection Agent", confidenceScore: 81.2, anomalyScore: 9.3, estimatedTons: 256, weight: 0.25 },
      ],
      consensusSteps: [
        { step: "Weighted Confidence", value: "76.4%", formula: "(78.3×0.35) + (72.1×0.40) + (81.2×0.25)" },
        { step: "Weighted Tons", value: "238", formula: "(245×0.35) + (228×0.40) + (256×0.25)" },
        { step: "Anomaly Threshold Check", value: "WARNING", formula: "max(12.5, 15.8, 9.3) > 10%" },
        { step: "Confidence Threshold Check", value: "PASS", formula: "76.4% > 70%" },
        { step: "Final Decision", value: "APPROVED WITH REDUCTION", formula: "High anomaly score triggered reduction" },
      ],
    },
    {
      id: 3,
      name: "Mangrove Conservation Beta",
      owner: "Ocean Conservation Fund",
      type: "Marine Conservation",
      location: "Thailand",
      claimedReduction: 450,
      submittedDate: "2024-02-01",
      status: "frozen",
      verifiedTons: 0,
      weightedConfidence: 44.1,
      attestationHash: "0xfrz4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
      mintTxHash: null,
      onChainState: "frozen",
      agentResults: [
        { agentName: "Baseline Agent", confidenceScore: 45.2, anomalyScore: 42.8, estimatedTons: 180, weight: 0.35 },
        { agentName: "Satellite Agent", confidenceScore: 38.7, anomalyScore: 55.3, estimatedTons: 145, weight: 0.40 },
        { agentName: "Anomaly Detection Agent", confidenceScore: 52.1, anomalyScore: 38.9, estimatedTons: 195, weight: 0.25 },
      ],
      consensusSteps: [
        { step: "Weighted Confidence", value: "44.1%", formula: "(45.2×0.35) + (38.7×0.40) + (52.1×0.25)" },
        { step: "Weighted Tons", value: "166", formula: "(180×0.35) + (145×0.40) + (195×0.25)" },
        { step: "Anomaly Threshold Check", value: "CRITICAL FAIL", formula: "max(42.8, 55.3, 38.9) > 30%" },
        { step: "Confidence Threshold Check", value: "FAIL", formula: "44.1% < 70%" },
        { step: "Final Decision", value: "FROZEN", formula: "Critical anomalies detected, governance review required" },
      ],
    },
  ];

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
    });
  };

  const handleReplayConsensus = (project: VerifierProject) => {
    setIsReplaying(true);
    setReplayResult(null);

    // Simulate deterministic replay
    setTimeout(() => {
      // For demo, we'll show a match
      const computedHash = project.attestationHash; // In reality, would recompute
      setReplayResult({
        match: true,
        computedHash,
      });
      setIsReplaying(false);
    }, 2000);
  };

  const getStatusBadge = (status: VerifierProject["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "approved-reduced":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Approved with Reduction
          </Badge>
        );
      case "frozen":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            <Lock className="w-3 h-3 mr-1" />
            Frozen
          </Badge>
        );
      default:
        return null;
    }
  };

  const getOnChainStateBadge = (state: VerifierProject["onChainState"]) => {
    switch (state) {
      case "minted":
        return <Badge variant="outline" className="border-success text-success">On-Chain: Minted</Badge>;
      case "frozen":
        return <Badge variant="outline" className="border-destructive text-destructive">On-Chain: Frozen</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-warning text-warning">On-Chain: Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole="verifier" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verification Audit Interface
          </h1>
          <p className="text-muted-foreground">
            Read-only access to verification records and deterministic replay capabilities
          </p>
        </div>

        {/* Important Notice */}
        <Card className="p-4 mb-6 border-muted bg-muted/20">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Audit-Only Access</h3>
              <p className="text-sm text-muted-foreground">
                This interface provides read-only access to verification records. All verification decisions are made automatically 
                by the AI agent consortium and recorded immutably on-chain. No manual approvals, rejections, or edits are possible.
                Use the deterministic replay feature to verify attestation integrity.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Project Overview</h2>
            {projects.map((project) => (
              <Card
                key={project.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                  selectedProject?.id === project.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-sm">
                    {project.name}
                  </h3>
                  {getStatusBadge(project.status)}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verified Tons:</span>
                    <span className="font-medium text-foreground">{project.verifiedTons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className={`font-medium ${project.weightedConfidence >= 70 ? "text-success" : "text-destructive"}`}>
                      {project.weightedConfidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Verification Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedProject ? (
              <>
                {/* Project Header */}
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">
                        {selectedProject.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">by {selectedProject.owner}</p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(selectedProject.status)}
                      {getOnChainStateBadge(selectedProject.onChainState)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedProject.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedProject.submittedDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Claimed: </span>
                      <span className="font-medium">{selectedProject.claimedReduction} tons</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verified: </span>
                      <span className="font-medium text-success">{selectedProject.verifiedTons} tons</span>
                    </div>
                  </div>
                </Card>

                {/* AI Agent Breakdown */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Individual Agent Outputs
                    <Badge variant="outline" className="ml-2 text-xs">Read-only</Badge>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Agent</th>
                          <th className="text-right py-2 px-3 text-muted-foreground font-medium">Confidence</th>
                          <th className="text-right py-2 px-3 text-muted-foreground font-medium">Anomaly</th>
                          <th className="text-right py-2 px-3 text-muted-foreground font-medium">Est. Tons</th>
                          <th className="text-right py-2 px-3 text-muted-foreground font-medium">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.agentResults.map((agent, idx) => (
                          <tr key={idx} className="border-b border-border/50">
                            <td className="py-3 px-3 text-foreground font-medium">{agent.agentName}</td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Progress value={agent.confidenceScore} className="w-16 h-2" />
                                <span className={agent.confidenceScore >= 70 ? "text-success" : "text-destructive"}>
                                  {agent.confidenceScore.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className={agent.anomalyScore <= 10 ? "text-success" : agent.anomalyScore <= 30 ? "text-warning" : "text-destructive"}>
                                {agent.anomalyScore.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right text-foreground">{agent.estimatedTons}</td>
                            <td className="py-3 px-3 text-right text-muted-foreground">{(agent.weight * 100).toFixed(0)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Consensus Calculation Steps */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Consensus Calculation Steps
                  </h3>
                  <div className="space-y-3">
                    {selectedProject.consensusSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {idx + 1}
                          </div>
                          <span className="font-medium text-foreground">{step.step}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            step.value.includes("PASS") || step.value === "APPROVED" ? "text-success" :
                            step.value.includes("WARNING") || step.value.includes("REDUCTION") ? "text-warning" :
                            step.value.includes("FAIL") || step.value === "FROZEN" ? "text-destructive" : "text-foreground"
                          }`}>
                            {step.value}
                          </div>
                          {step.formula && (
                            <div className="text-xs text-muted-foreground font-mono">{step.formula}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Deterministic Replay */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Deterministic Replay
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Re-run the consensus calculation to verify the attestation hash matches the on-chain record.
                    This ensures the verification was computed correctly and has not been tampered with.
                  </p>
                  <Button
                    onClick={() => handleReplayConsensus(selectedProject)}
                    disabled={isReplaying}
                    variant="outline"
                    className="mb-4"
                  >
                    {isReplaying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Re-computing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-run Consensus
                      </>
                    )}
                  </Button>
                  {replayResult && (
                    <div className={`p-4 rounded-lg ${replayResult.match ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {replayResult.match ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-success" />
                            <span className="font-semibold text-success">Hash Match Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                            <span className="font-semibold text-destructive">Hash Mismatch Detected</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs font-mono text-muted-foreground break-all">
                        Computed: {replayResult.computedHash}
                      </div>
                    </div>
                  )}
                </Card>

                {/* Blockchain Reference */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Blockchain Reference
                    <Badge variant="outline" className="ml-2 text-xs">Immutable</Badge>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">Attestation Hash:</span>
                      <button
                        onClick={() => copyToClipboard(selectedProject.attestationHash)}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono"
                      >
                        <span>{shortenHash(selectedProject.attestationHash, 12)}</span>
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {selectedProject.mintTxHash && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Mint Transaction:</span>
                        <button
                          onClick={() => copyToClipboard(selectedProject.mintTxHash!)}
                          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono"
                        >
                          <span>{shortenHash(selectedProject.mintTxHash, 12)}</span>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">On-Chain State:</span>
                      {getOnChainStateBadge(selectedProject.onChainState)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/tx/${selectedProject.mintTxHash || selectedProject.attestationHash}`, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Block Explorer
                    </Button>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a Project to Audit</h3>
                <p className="text-muted-foreground">
                  Choose a project from the list to view its verification details, agent outputs, and blockchain records.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
