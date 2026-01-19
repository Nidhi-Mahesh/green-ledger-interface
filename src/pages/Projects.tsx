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
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  shortenHash,
  generateTxHash,
} from "@/utils/fakeBlockchain";
import { useGlobalStore, Project, VerificationStep } from "@/context/GlobalStore";

const Projects = () => {
  const { state, dispatch } = useGlobalStore();
  const [showForm, setShowForm] = useState(false);
  const [formLocked, setFormLocked] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const myProjects = state.projects;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    claimedReduction: "",
    description: "",
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB) ready for upload.`,
      });
    }
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
            Multi-agent verification In Progress
          </Badge>
        );
      case "unverified":
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

    const timestamp = new Date().toISOString();
    const projectId = `proj-${Date.now()}`;

    const newProject: Project = {
      id: projectId,
      name: formData.name,
      type: formData.type,
      location: formData.location,
      claimedReduction: parseInt(formData.claimedReduction),
      description: formData.description,
      status: "unverified",
      submittedDate: timestamp.split("T")[0],
      attestationHash: null,
      mintTxHash: null,
      evidenceHash: generateTxHash(),
      verificationSteps: [
        { id: "submitted", name: "Submitted", status: "completed", iconName: "FileText" },
        { id: "baseline", name: "Baseline Agent Analysis", status: "pending", iconName: "Bot" },
        { id: "satellite", name: "Satellite Agent Analysis", status: "pending", iconName: "Satellite" },
        { id: "anomaly", name: "Anomaly Agent Analysis", status: "pending", iconName: "AlertTriangle" },
        { id: "consensus", name: "Consensus Calculation", status: "pending", iconName: "Calculator" },
        { id: "result", name: "Final Result", status: "pending", iconName: "Shield" },
      ],
      agentResults: null,
      consensusData: null,
      availableSupply: 0,
      evidenceFile: selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      } : null,
    };

    dispatch({ type: "ADD_PROJECT", payload: newProject });
    dispatch({
      type: "ADD_AUDIT_EVENT",
      payload: {
        id: `evt-${Date.now()}`,
        timestamp,
        projectId,
        projectName: newProject.name,
        attestationHash: null,
        actionType: "submission",
        details: `Project "${newProject.name}" submitted for verification. Evidence Hash: ${newProject.evidenceHash}`,
      },
    });

    setFormLocked(true);

    toast({
      title: "Project Submitted for Multi-agent Verification",
      description: "Your project has entered the automated verification pipeline. You can track progress in the list below.",
    });

    setShowForm(false);
    setFormLocked(false);
    setFormData({ name: "", type: "", location: "", claimedReduction: "", description: "" });
    setSelectedFile(null);
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
                <Label>Evidence Upload</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".json,.pdf,.csv"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${selectedFile ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                    }`}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="w-8 h-8 text-primary mb-2" />
                      <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Click to change
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Click to upload verification evidence
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JSON, PDF, CSV evidence data (max. 50MB)
                      </p>
                    </>
                  )}
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
                      Multi-agent Verification Pipeline
                    </h4>
                    <div className="mb-2">
                      <Progress value={getVerificationProgress(project.verificationSteps)} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                      {project.verificationSteps.map((step) => {
                        const IconMap: { [key: string]: React.ElementType } = {
                          FileText, Bot, Satellite, AlertTriangle, Calculator, Shield
                        };
                        const StepIcon = IconMap[step.iconName] || Bot;

                        return (
                          <div
                            key={step.id}
                            className={`p-3 rounded-lg text-center text-xs ${step.status === "completed"
                              ? "bg-success/10 text-success border border-success/20"
                              : step.status === "in-progress"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-muted text-muted-foreground border border-border"
                              }`}
                          >
                            <StepIcon className={`w-4 h-4 mx-auto mb-1 ${step.status === "in-progress" ? "animate-pulse" : ""}`} />
                            <span className="block truncate">{step.name}</span>
                            {step.status === "completed" && <CheckCircle className="w-3 h-3 mx-auto mt-1" />}
                            {step.status === "in-progress" && <Loader2 className="w-3 h-3 mx-auto mt-1 animate-spin" />}
                          </div>
                        );
                      })}
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
                            onClick={(e) => { e.stopPropagation(); toast({ title: "View Evidence", description: `Viewing: ${project.evidenceFile?.name || "N/A"}` }); }}
                            disabled={!project.evidenceFile}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Proof Document
                          </Button>
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
