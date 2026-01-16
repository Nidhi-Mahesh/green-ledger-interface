import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  Download,
  ExternalLink,
  Lock,
  Bot,
  Satellite,
  AlertTriangle,
  Calculator,
  Shield,
  FileText,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  shortenHash,
  generateAttestationHash,
  generateTxHash,
} from "@/utils/fakeBlockchain";

// Verification step type
interface VerificationStep {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed";
  icon: React.ElementType;
}

// AI Agent result type
interface AgentResult {
  agentName: string;
  confidenceScore: number;
  anomalyScore: number;
  estimatedVerifiedTons: number;
  weight: number;
}

// Project type with full verification data
interface Project {
  id: number;
  name: string;
  type: string;
  location: string;
  claimedReduction: number;
  status: "draft" | "submitted" | "verifying" | "approved" | "approved-reduced" | "frozen" | "rejected";
  submittedDate: string;
  attestationHash: string | null;
  mintTxHash: string | null;
  verificationSteps: VerificationStep[];
  agentResults: AgentResult[] | null;
  consensusData: {
    weightedConfidence: number;
    finalVerifiedTons: number;
    reductionReason?: string;
  } | null;
  evidenceHash: string | null;
}

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  const [formLocked, setFormLocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    claimedReduction: "",
    description: "",
  });

  // Sample projects with full verification workflow data
  const [myProjects, setMyProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Solar Farm Alpha",
      type: "Solar Energy",
      location: "California, USA",
      claimedReduction: 500,
      status: "approved",
      submittedDate: "2024-01-15",
      attestationHash: "0x7a3f8e2c4b9d1a6f5e8c7b4a9d2e1f3c8b7a6d5e4c3b2a1f9e8d7c6b5a4392bc",
      mintTxHash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
      evidenceHash: "0xevd8e2c4b9d1a6f5e8c7b4a9d2e1f3c8b7a6d5e4c3b2a1f9e8d7c6b5a43def1",
      verificationSteps: [
        { id: "submitted", name: "Submitted", status: "completed", icon: FileText },
        { id: "baseline", name: "Baseline Agent Analysis", status: "completed", icon: Bot },
        { id: "satellite", name: "Satellite Agent Analysis", status: "completed", icon: Satellite },
        { id: "anomaly", name: "Anomaly Agent Analysis", status: "completed", icon: AlertTriangle },
        { id: "consensus", name: "Consensus Calculation", status: "completed", icon: Calculator },
        { id: "result", name: "Final Result", status: "completed", icon: Shield },
      ],
      agentResults: [
        { agentName: "Baseline Agent", confidenceScore: 94.2, anomalyScore: 2.1, estimatedVerifiedTons: 498, weight: 0.35 },
        { agentName: "Satellite Agent", confidenceScore: 91.8, anomalyScore: 3.5, estimatedVerifiedTons: 492, weight: 0.40 },
        { agentName: "Anomaly Detection Agent", confidenceScore: 96.5, anomalyScore: 1.2, estimatedVerifiedTons: 500, weight: 0.25 },
      ],
      consensusData: {
        weightedConfidence: 93.7,
        finalVerifiedTons: 496,
        reductionReason: undefined,
      },
    },
    {
      id: 2,
      name: "Wind Energy Delta",
      type: "Wind Energy",
      location: "Texas, USA",
      claimedReduction: 800,
      status: "verifying",
      submittedDate: "2024-02-10",
      attestationHash: null,
      mintTxHash: null,
      evidenceHash: "0xevd2d7f8a9b3c6d5e1f4a2b8c7d6e5f3a9b8c7d6e5f4a3b2c1d9e8f7a6b5712c",
      verificationSteps: [
        { id: "submitted", name: "Submitted", status: "completed", icon: FileText },
        { id: "baseline", name: "Baseline Agent Analysis", status: "completed", icon: Bot },
        { id: "satellite", name: "Satellite Agent Analysis", status: "in-progress", icon: Satellite },
        { id: "anomaly", name: "Anomaly Agent Analysis", status: "pending", icon: AlertTriangle },
        { id: "consensus", name: "Consensus Calculation", status: "pending", icon: Calculator },
        { id: "result", name: "Final Result", status: "pending", icon: Shield },
      ],
      agentResults: [
        { agentName: "Baseline Agent", confidenceScore: 88.5, anomalyScore: 5.2, estimatedVerifiedTons: 752, weight: 0.35 },
      ],
      consensusData: null,
    },
    {
      id: 3,
      name: "Reforestation Project Zeta",
      type: "Reforestation",
      location: "Oregon, USA",
      claimedReduction: 300,
      status: "approved-reduced",
      submittedDate: "2024-01-20",
      attestationHash: "0x9c8b7a6d5e4f3c2b1a9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c3b2a1f9e8d743de",
      mintTxHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
      evidenceHash: "0xevd9c8b7a6d5e4f3c2b1a9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c3b2a1f9def23",
      verificationSteps: [
        { id: "submitted", name: "Submitted", status: "completed", icon: FileText },
        { id: "baseline", name: "Baseline Agent Analysis", status: "completed", icon: Bot },
        { id: "satellite", name: "Satellite Agent Analysis", status: "completed", icon: Satellite },
        { id: "anomaly", name: "Anomaly Agent Analysis", status: "completed", icon: AlertTriangle },
        { id: "consensus", name: "Consensus Calculation", status: "completed", icon: Calculator },
        { id: "result", name: "Final Result", status: "completed", icon: Shield },
      ],
      agentResults: [
        { agentName: "Baseline Agent", confidenceScore: 78.3, anomalyScore: 12.5, estimatedVerifiedTons: 245, weight: 0.35 },
        { agentName: "Satellite Agent", confidenceScore: 72.1, anomalyScore: 15.8, estimatedVerifiedTons: 228, weight: 0.40 },
        { agentName: "Anomaly Detection Agent", confidenceScore: 81.2, anomalyScore: 9.3, estimatedVerifiedTons: 256, weight: 0.25 },
      ],
      consensusData: {
        weightedConfidence: 76.4,
        finalVerifiedTons: 238,
        reductionReason: "Satellite imagery analysis detected 20.7% less vegetation coverage than claimed. Anomaly agents flagged inconsistencies in growth rate projections.",
      },
    },
    {
      id: 4,
      name: "Mangrove Conservation Beta",
      type: "Marine Conservation",
      location: "Thailand",
      claimedReduction: 450,
      status: "frozen",
      submittedDate: "2024-02-01",
      attestationHash: "0xfrz4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
      mintTxHash: null,
      evidenceHash: "0xevd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1bab42",
      verificationSteps: [
        { id: "submitted", name: "Submitted", status: "completed", icon: FileText },
        { id: "baseline", name: "Baseline Agent Analysis", status: "completed", icon: Bot },
        { id: "satellite", name: "Satellite Agent Analysis", status: "completed", icon: Satellite },
        { id: "anomaly", name: "Anomaly Agent Analysis", status: "completed", icon: AlertTriangle },
        { id: "consensus", name: "Consensus Calculation", status: "completed", icon: Calculator },
        { id: "result", name: "Final Result", status: "completed", icon: Shield },
      ],
      agentResults: [
        { agentName: "Baseline Agent", confidenceScore: 45.2, anomalyScore: 42.8, estimatedVerifiedTons: 180, weight: 0.35 },
        { agentName: "Satellite Agent", confidenceScore: 38.7, anomalyScore: 55.3, estimatedVerifiedTons: 145, weight: 0.40 },
        { agentName: "Anomaly Detection Agent", confidenceScore: 52.1, anomalyScore: 38.9, estimatedVerifiedTons: 195, weight: 0.25 },
      ],
      consensusData: {
        weightedConfidence: 44.1,
        finalVerifiedTons: 0,
        reductionReason: "Critical anomalies detected: Satellite imagery shows significant discrepancies with claimed mangrove coverage. Multiple agents flagged potential misrepresentation. Project frozen pending manual review by governance committee.",
      },
    },
  ]);

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
    });
  };

  const downloadAttestationJSON = (project: Project) => {
    const attestation = {
      projectId: project.id,
      projectName: project.name,
      attestationHash: project.attestationHash,
      mintTxHash: project.mintTxHash,
      evidenceHash: project.evidenceHash,
      claimedReduction: project.claimedReduction,
      verifiedTons: project.consensusData?.finalVerifiedTons,
      weightedConfidence: project.consensusData?.weightedConfidence,
      status: project.status,
      timestamp: new Date().toISOString(),
      agentResults: project.agentResults,
    };

    const blob = new Blob([JSON.stringify(attestation, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attestation-${project.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Attestation JSON file downloaded",
    });
  };

  const getStatusBadge = (status: Project["status"]) => {
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
      case "verifying":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            AI Verification In Progress
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-muted text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Submitted
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject: Project = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      location: formData.location,
      claimedReduction: parseInt(formData.claimedReduction),
      status: "submitted",
      submittedDate: new Date().toISOString().split("T")[0],
      attestationHash: null,
      mintTxHash: null,
      evidenceHash: generateTxHash(),
      verificationSteps: [
        { id: "submitted", name: "Submitted", status: "completed", icon: FileText },
        { id: "baseline", name: "Baseline Agent Analysis", status: "pending", icon: Bot },
        { id: "satellite", name: "Satellite Agent Analysis", status: "pending", icon: Satellite },
        { id: "anomaly", name: "Anomaly Agent Analysis", status: "pending", icon: AlertTriangle },
        { id: "consensus", name: "Consensus Calculation", status: "pending", icon: Calculator },
        { id: "result", name: "Final Result", status: "pending", icon: Shield },
      ],
      agentResults: null,
      consensusData: null,
    };

    setMyProjects([newProject, ...myProjects]);
    setFormLocked(true);

    toast({
      title: "Project Submitted for AI Verification",
      description: "Your project has entered the automated verification pipeline. You will be notified of results.",
    });

    // Simulate verification starting
    setTimeout(() => {
      setMyProjects((prev) =>
        prev.map((p) =>
          p.id === newProject.id
            ? { ...p, status: "verifying" as const, verificationSteps: p.verificationSteps.map((s, i) => (i === 1 ? { ...s, status: "in-progress" as const } : s)) }
            : p
        )
      );
    }, 2000);

    setShowForm(false);
    setFormLocked(false);
    setFormData({ name: "", type: "", location: "", claimedReduction: "", description: "" });
  };

  const getVerificationProgress = (steps: VerificationStep[]) => {
    const completed = steps.filter((s) => s.status === "completed").length;
    return (completed / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole="project-owner" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Project Owner Dashboard
            </h1>
            <p className="text-muted-foreground">
              Submit projects for AI-powered verification and track your carbon credit issuance
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-primary"
            disabled={formLocked}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Important Notice */}
        <Card className="p-4 mb-6 border-primary/30 bg-primary/5">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Automated Verification System</h3>
              <p className="text-sm text-muted-foreground">
                All verification and minting decisions are made automatically by our AI agent consortium and enforced by blockchain smart contracts. 
                Human intervention is not possible in the verification process, ensuring complete transparency and immutability.
              </p>
            </div>
          </div>
        </Card>

        {/* Project Submission Form */}
        {showForm && (
          <Card className={`p-6 mb-8 bg-gradient-card ${formLocked ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Submit Project for AI Verification
              </h2>
              {formLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Solar Farm Alpha"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={formLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                    disabled={formLocked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solar Energy">Solar Energy</SelectItem>
                      <SelectItem value="Wind Energy">Wind Energy</SelectItem>
                      <SelectItem value="Reforestation">Reforestation</SelectItem>
                      <SelectItem value="Hydroelectric">Hydroelectric</SelectItem>
                      <SelectItem value="Biomass Energy">Biomass Energy</SelectItem>
                      <SelectItem value="Marine Conservation">Marine Conservation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., California, USA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    disabled={formLocked}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reduction">Claimed CO₂ Offset (tons) *</Label>
                  <Input
                    id="reduction"
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.claimedReduction}
                    onChange={(e) => setFormData({ ...formData, claimedReduction: e.target.value })}
                    required
                    disabled={formLocked}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your carbon offset project..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={formLocked}
                />
              </div>

              <div className="space-y-2">
                <Label>Evidence Upload (Mock)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload verification evidence
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, images, sensor data exports (max. 50MB)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-gradient-primary" disabled={formLocked}>
                  <Bot className="w-4 h-4 mr-2" />
                  Submit for AI Verification
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={formLocked}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Projects List */}
        <div className="space-y-6">
          {myProjects.map((project) => (
            <Card
              key={project.id}
              className={`p-6 hover:shadow-md transition-all cursor-pointer ${selectedProject?.id === project.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
            >
              {/* Project Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {project.name}
                    </h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type: </span>
                      <span className="text-foreground font-medium">{project.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location: </span>
                      <span className="text-foreground font-medium">{project.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Claimed: </span>
                      <span className="text-foreground font-medium">{project.claimedReduction} tons</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted: </span>
                      <span className="text-foreground font-medium">{project.submittedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Project Details */}
              {selectedProject?.id === project.id && (
                <div className="mt-6 pt-6 border-t border-border space-y-6">
                  {/* Verification Progress Timeline */}
                  <div>
                    <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      AI Verification Pipeline
                    </h4>
                    <div className="mb-2">
                      <Progress value={getVerificationProgress(project.verificationSteps)} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                      {project.verificationSteps.map((step) => (
                        <div
                          key={step.id}
                          className={`p-3 rounded-lg text-center text-xs ${
                            step.status === "completed"
                              ? "bg-success/10 text-success border border-success/20"
                              : step.status === "in-progress"
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          <step.icon className={`w-4 h-4 mx-auto mb-1 ${step.status === "in-progress" ? "animate-pulse" : ""}`} />
                          <span className="block truncate">{step.name}</span>
                          {step.status === "completed" && <CheckCircle className="w-3 h-3 mx-auto mt-1" />}
                          {step.status === "in-progress" && <Loader2 className="w-3 h-3 mx-auto mt-1 animate-spin" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Agent Results (Read-only) */}
                  {project.agentResults && (
                    <div>
                      <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        AI Agent Analysis Results
                        <Badge variant="outline" className="ml-2 text-xs">Read-only</Badge>
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Agent</th>
                              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Confidence</th>
                              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Anomaly Score</th>
                              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Est. Verified Tons</th>
                              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {project.agentResults.map((agent, idx) => (
                              <tr key={idx} className="border-b border-border/50">
                                <td className="py-2 px-3 text-foreground font-medium">{agent.agentName}</td>
                                <td className="py-2 px-3 text-right">
                                  <span className={agent.confidenceScore >= 80 ? "text-success" : agent.confidenceScore >= 60 ? "text-warning" : "text-destructive"}>
                                    {agent.confidenceScore.toFixed(1)}%
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right">
                                  <span className={agent.anomalyScore <= 10 ? "text-success" : agent.anomalyScore <= 25 ? "text-warning" : "text-destructive"}>
                                    {agent.anomalyScore.toFixed(1)}%
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right text-foreground">{agent.estimatedVerifiedTons}</td>
                                <td className="py-2 px-3 text-right text-muted-foreground">{(agent.weight * 100).toFixed(0)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Consensus & Outcome Section */}
                  {project.consensusData && (
                    <div>
                      <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Consensus Outcome
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="p-4 bg-muted/30">
                          <div className="text-xs text-muted-foreground mb-1">Weighted Confidence</div>
                          <div className={`text-2xl font-bold ${project.consensusData.weightedConfidence >= 80 ? "text-success" : project.consensusData.weightedConfidence >= 60 ? "text-warning" : "text-destructive"}`}>
                            {project.consensusData.weightedConfidence.toFixed(1)}%
                          </div>
                        </Card>
                        <Card className="p-4 bg-muted/30">
                          <div className="text-xs text-muted-foreground mb-1">Final Verified Tons</div>
                          <div className="text-2xl font-bold text-foreground">
                            {project.consensusData.finalVerifiedTons.toLocaleString()}
                          </div>
                        </Card>
                        <Card className="p-4 bg-muted/30">
                          <div className="text-xs text-muted-foreground mb-1">Status</div>
                          <div className="mt-1">{getStatusBadge(project.status)}</div>
                        </Card>
                      </div>
                      {project.consensusData.reductionReason && (
                        <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-warning mb-1">Reduction/Freeze Explanation</div>
                              <p className="text-sm text-muted-foreground">{project.consensusData.reductionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attestation & Blockchain Info */}
                  {(project.attestationHash || project.evidenceHash) && (
                    <div>
                      <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Blockchain Attestation
                        <Badge variant="outline" className="ml-2 text-xs">Immutable</Badge>
                      </h4>
                      <Card className="p-4 bg-muted/30 space-y-3">
                        {project.attestationHash && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Attestation Hash:</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(project.attestationHash!); }}
                              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono"
                            >
                              <span>{shortenHash(project.attestationHash, 10)}</span>
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {project.mintTxHash && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Mint Transaction:</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(project.mintTxHash!); }}
                              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono"
                            >
                              <span>{shortenHash(project.mintTxHash, 10)}</span>
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {project.evidenceHash && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Evidence Hash (IPFS):</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(project.evidenceHash!); }}
                              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono"
                            >
                              <span>{shortenHash(project.evidenceHash, 10)}</span>
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); downloadAttestationJSON(project); }}
                            disabled={!project.attestationHash}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Attestation JSON
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); window.open(`https://etherscan.io/tx/${project.mintTxHash}`, "_blank"); }}
                            disabled={!project.mintTxHash}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Explorer
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
