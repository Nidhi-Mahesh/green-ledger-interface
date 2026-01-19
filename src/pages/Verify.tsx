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
  Clock,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { shortenHash } from "@/utils/fakeBlockchain";
import { useGlobalStore, Project } from "@/context/GlobalStore";
import { generateAgentOutputs, calculateConsensus, generateDeterministicHash } from "@/utils/consensusLogic";

const Verify = () => {
  const { state, dispatch } = useGlobalStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayResult, setReplayResult] = useState<{ match: boolean; computedHash: string } | null>(null);
  const { toast } = useToast();

  // All projects from global store
  const projects = state.projects;

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
    });
  };

  const handleRunVerification = async (project: Project) => {
    setIsReplaying(true);

    try {
      // Call backend API to trigger the agent pipeline
      const response = await fetch(`http://localhost:3001/api/verify/${project.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: project.type === 'Reforestation' ? 'Reforestation' : 'AWD', // Use project type
          area: project.claimedReduction, // Use claimed reduction as area estimate
          projectName: project.name,
          location: project.location,
          projectType: project.type,
          description: project.description,
          claimedReduction: project.claimedReduction,
          submittedDate: project.submittedDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Backend verification failed');
      }

      const result = await response.json();
      console.log('Backend pipeline started:', result);

      toast({
        title: "Pipeline Started",
        description: "Check your backend terminal for real-time agent logs!",
      });

      // Wait for pipeline to complete with simulated progress updates
      // This matches the ~10s duration of the backend pipeline

      // Stage 1: Baseline (starts immediately)
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Baseline Agent Active",
        description: "Calculating emission reductions against regional baselines...",
      });

      // Stage 2: Satellite
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Satellite Analysis",
        description: "Processing spectral imagery and NDVI vegetation indices...",
      });

      // Stage 3: Consensus
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Consensus Engine",
        description: "Aggregating agent scores and minting to blockchain...",
      });

      // Finalization
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate frontend results for UI display
      const agentResults = generateAgentOutputs(project);
      const consensus = calculateConsensus(agentResults);
      const attestationHash = generateDeterministicHash(project, agentResults, consensus);

      const updatedProject: Project = {
        ...project,
        status: consensus.status,
        agentResults,
        consensusData: {
          weightedConfidence: consensus.weightedConfidence,
          maxAnomaly: consensus.maxAnomaly,
          finalVerifiedTons: consensus.finalVerifiedTons,
          reductionReason: consensus.reductionReason,
        },
        attestationHash,
        mintTxHash: (consensus.status !== "frozen" && consensus.status !== "rejected") ? `0xmint_${attestationHash.slice(14)}` : null,
        availableSupply: consensus.finalVerifiedTons,
      };

      dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
      dispatch({
        type: "ADD_AUDIT_EVENT",
        payload: {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          projectId: project.id,
          projectName: project.name,
          attestationHash,
          actionType: "verification",
          details: `Multi-agent verification completed for "${project.name}". Status: ${consensus.status}. Verified Tons: ${consensus.finalVerifiedTons}`,
        },
      });

      setSelectedProject(updatedProject);
      setIsReplaying(false);

      toast({
        title: "Verification Complete",
        description: `Project ${project.name} has been processed with status: ${consensus.status}`,
      });
    } catch (error) {
      console.error('Verification error:', error);
      setIsReplaying(false);
      toast({
        title: "Verification Failed",
        description: "Could not connect to backend. Make sure the server is running on port 3001.",
        variant: "destructive",
      });
    }
  };

  const handleReplayConsensus = (project: Project) => {
    if (!project.agentResults) return;

    setIsReplaying(true);
    setReplayResult(null);

    // Deterministic replay
    setTimeout(() => {
      const agentResults = generateAgentOutputs(project);
      const consensus = calculateConsensus(agentResults);
      const computedHash = generateDeterministicHash(project, agentResults, consensus);

      const isMatch = computedHash === project.attestationHash;

      setReplayResult({
        match: isMatch,
        computedHash,
      });
      setIsReplaying(false);

      if (isMatch) {
        toast({
          title: "Hash Verified",
          description: "Deterministic replay matches the stored attestation hash.",
        });
      } else {
        toast({
          title: "Verification Warning",
          description: "Replayed hash does not match! Potential state inconsistency detected.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "verified":
      case "tradable":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
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
      case "verifying":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Verifying
          </Badge>
        );
      case "unverified":
        return (
          <Badge className="bg-muted text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Unverified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getOnChainStateBadge = (project: Project) => {
    if (project.status === "unverified" || project.status === "verifying") {
      return <Badge variant="outline" className="border-warning text-warning">On-Chain: Pending</Badge>;
    }
    if (project.status === "frozen" || project.status === "rejected") {
      return <Badge variant="outline" className="border-destructive text-destructive">On-Chain: Frozen</Badge>;
    }
    return <Badge variant="outline" className="border-success text-success">On-Chain: Minted</Badge>;
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
                className={`p-4 cursor-pointer hover:shadow-md transition-all ${selectedProject?.id === project.id ? "ring-2 ring-primary" : ""
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
                    <span className="font-medium text-foreground">{project.consensusData?.finalVerifiedTons || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className={`font-medium ${(project.consensusData?.weightedConfidence || 0) >= 70 ? "text-success" : "text-destructive"}`}>
                      {(project.consensusData?.weightedConfidence || 0).toFixed(1)}%
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
                      <p className="text-sm text-muted-foreground">by Project Owner</p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(selectedProject.status)}
                      {getOnChainStateBadge(selectedProject)}
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
                      <span className="font-medium text-success">{selectedProject.consensusData?.finalVerifiedTons || 0} tons</span>
                    </div>
                  </div>
                </Card>

                {/* Multi-agent Results */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Multi-agent Deterministic Verification
                    <Badge variant="outline" className="ml-2 text-xs">Immutable Record</Badge>
                  </h3>

                  {selectedProject.status === "unverified" ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">This project has not yet been processed by the automated consensus engine.</p>
                      <Button onClick={() => handleRunVerification(selectedProject)} disabled={isReplaying}>
                        {isReplaying ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Run Multi-agent Consensus
                      </Button>
                    </div>
                  ) : (
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
                          {selectedProject.agentResults?.map((agent, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-3 px-3 text-foreground font-medium">{agent.agentName}</td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Progress value={agent.confidenceScore} className="w-16 h-2" />
                                  <span className={agent.confidenceScore >= 85 ? "text-success" : agent.confidenceScore >= 70 ? "text-warning" : "text-destructive"}>
                                    {agent.confidenceScore.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <span className={agent.anomalyScore <= 10 ? "text-success" : agent.anomalyScore <= 25 ? "text-warning" : "text-destructive"}>
                                  {agent.anomalyScore.toFixed(1)}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right text-foreground">{agent.estimatedVerifiedTons}</td>
                              <td className="py-3 px-3 text-right text-muted-foreground">{(agent.weight * 100).toFixed(0)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>

                {/* Consensus Calculation Logic */}
                {selectedProject.consensusData && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Consensus Calculation Logic
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">1</div>
                          <span className="font-medium text-foreground">Aggregate Weighted Confidence</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${selectedProject.consensusData.weightedConfidence >= 85 ? "text-success" : selectedProject.consensusData.weightedConfidence >= 70 ? "text-warning" : "text-destructive"}`}>
                            {selectedProject.consensusData.weightedConfidence.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">2</div>
                          <span className="font-medium text-foreground">Maximum Anomaly Score</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${selectedProject.consensusData.maxAnomaly <= 10 ? "text-success" : selectedProject.consensusData.maxAnomaly <= 25 ? "text-warning" : "text-destructive"}`}>
                            {selectedProject.consensusData.maxAnomaly.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">3</div>
                          <span className="font-medium text-foreground">Final Deterministic Decision</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${selectedProject.status === "verified" || selectedProject.status === "tradable" ? "text-success" : selectedProject.status === "approved-reduced" ? "text-warning" : "text-destructive"}`}>
                            {selectedProject.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Deterministic Replay */}
                {selectedProject.status !== "unverified" && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Auditable Replay Engine
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Re-run the consensus calculation to verify the attestation hash matches.
                      This ensures zero human discretion was applied to the verification outcome.
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
                          Verifying...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Re-run Deterministic Consensus
                        </>
                      )}
                    </Button>
                    {replayResult && (
                      <div className={`p-4 rounded-lg ${replayResult.match ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {replayResult.match ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-success" />
                              <span className="font-semibold text-success">Verification Integrity Confirmed</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                              <span className="font-semibold text-destructive">Integrity Check Failed</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground break-all">
                          Computed: {replayResult.computedHash}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Blockchain Reference */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Simulated Blockchain Enforcement Layer
                    <Badge variant="outline" className="ml-2 text-xs">Immutable</Badge>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-sm text-muted-foreground">Attestation Hash:</span>
                      <button
                        onClick={() => copyToClipboard(selectedProject.attestationHash || "0x-pending")}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono"
                      >
                        <span>{selectedProject.attestationHash ? shortenHash(selectedProject.attestationHash, 12) : "0x-pending"}</span>
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {selectedProject.mintTxHash && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Simulated Mint Tx:</span>
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
                      <span className="text-sm text-muted-foreground">Execution State:</span>
                      {getOnChainStateBadge(selectedProject)}
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a Project to Audit</h3>
                <p className="text-muted-foreground">
                  View multi-agent verification details and re-run deterministic consensus.
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
