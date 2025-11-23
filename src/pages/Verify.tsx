import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Verify = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const pendingProjects = [
    {
      id: 1,
      name: "Hydroelectric Gamma",
      owner: "GreenTech Solutions",
      type: "Hydroelectric",
      location: "Norway",
      expectedReduction: "600 tons CO₂e",
      submittedDate: "2024-02-15",
      documents: ["project-plan.pdf", "environmental-impact.pdf", "photos.zip"],
    },
    {
      id: 2,
      name: "Biomass Plant Epsilon",
      owner: "EcoEnergy India",
      type: "Biomass Energy",
      location: "India",
      expectedReduction: "450 tons CO₂e",
      submittedDate: "2024-02-18",
      documents: ["technical-specs.pdf", "certification.pdf"],
    },
    {
      id: 3,
      name: "Coastal Mangrove Restoration",
      owner: "Ocean Conservation Fund",
      type: "Marine Conservation",
      location: "Vietnam",
      expectedReduction: "280 tons CO₂e",
      submittedDate: "2024-02-20",
      documents: ["project-proposal.pdf", "site-survey.pdf", "images.zip"],
    },
  ];

  const handleApprove = (projectId: number) => {
    toast({
      title: "Project Approved",
      description: "Credits will be minted and issued to the project owner.",
    });
    setSelectedProject(null);
    setComment("");
  };

  const handleReject = (projectId: number) => {
    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Comment Required",
        description: "Please provide feedback for the rejection.",
      });
      return;
    }
    toast({
      title: "Project Rejected",
      description: "Feedback has been sent to the project owner.",
    });
    setSelectedProject(null);
    setComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole="verifier" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Project Verification
          </h1>
          <p className="text-muted-foreground">
            Review and verify carbon offset projects pending approval
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2 space-y-4">
            {pendingProjects.map((project) => (
              <Card
                key={project.id}
                className={`p-6 cursor-pointer hover:shadow-md transition-all ${
                  selectedProject === project.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      by {project.owner}
                    </p>
                  </div>
                  <Badge className="bg-warning text-warning-foreground">
                    Pending
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {project.submittedDate}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground font-medium">
                      {project.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Expected Reduction:
                    </span>
                    <span className="text-foreground font-medium">
                      {project.expectedReduction}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Documents:</span>
                    <span className="text-foreground font-medium">
                      {project.documents.length} files
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Verification Panel */}
          <div className="space-y-6">
            {selectedProject ? (
              <>
                <Card className="p-6 bg-gradient-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Project Documents
                  </h3>
                  <div className="space-y-2">
                    {pendingProjects
                      .find((p) => p.id === selectedProject)
                      ?.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                        >
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="flex-1 text-sm text-foreground">
                            {doc}
                          </span>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </div>
                      ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Verification Decision
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comment">
                        Comments / Feedback (Optional for approval, required for
                        rejection)
                      </Label>
                      <Textarea
                        id="comment"
                        placeholder="Provide feedback about the project..."
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-success hover:bg-success/90"
                        onClick={() => handleApprove(selectedProject)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleReject(selectedProject)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a project to review its details and documents
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
