import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const myProjects = [
    {
      id: 1,
      name: "Solar Farm Alpha",
      type: "Solar Energy",
      location: "California, USA",
      status: "verified",
      expectedReduction: "500 tons CO₂e",
      submittedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Wind Energy Delta",
      type: "Wind Energy",
      location: "Texas, USA",
      status: "pending",
      expectedReduction: "800 tons CO₂e",
      submittedDate: "2024-02-10",
    },
    {
      id: 3,
      name: "Reforestation Project Zeta",
      type: "Reforestation",
      location: "Oregon, USA",
      status: "rejected",
      expectedReduction: "300 tons CO₂e",
      submittedDate: "2024-01-20",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Pending
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
    toast({
      title: "Project Submitted!",
      description: "Your project has been submitted for verification.",
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole="project-owner" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Projects
            </h1>
            <p className="text-muted-foreground">
              Manage your carbon offset projects and track verification status
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Project Registration Form */}
        {showForm && (
          <Card className="p-6 mb-8 bg-gradient-card">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Register New Project
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Solar Farm Alpha"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solar">Solar Energy</SelectItem>
                      <SelectItem value="wind">Wind Energy</SelectItem>
                      <SelectItem value="reforestation">
                        Reforestation
                      </SelectItem>
                      <SelectItem value="hydroelectric">
                        Hydroelectric
                      </SelectItem>
                      <SelectItem value="biomass">Biomass Energy</SelectItem>
                      <SelectItem value="marine">
                        Marine Conservation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., California, USA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reduction">
                    Expected CO₂e Reduction (tons)
                  </Label>
                  <Input
                    id="reduction"
                    type="number"
                    placeholder="e.g., 500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your carbon offset project..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Supporting Documents</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, or images (max. 10MB)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-gradient-primary">
                  Submit for Verification
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          {myProjects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                      <span className="text-foreground font-medium">
                        {project.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location: </span>
                      <span className="text-foreground font-medium">
                        {project.location}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reduction: </span>
                      <span className="text-foreground font-medium">
                        {project.expectedReduction}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted: </span>
                      <span className="text-foreground font-medium">
                        {project.submittedDate}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
