import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Copy,
  Plus,
  ArrowUpRight,
  Shield,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { shortenHash } from "@/utils/fakeBlockchain";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/context/GlobalStore";

const Dashboard = () => {
  const { state } = useGlobalStore();
  const { toast } = useToast();
  const { userRole, projects, portfolio, auditLog } = state;

  // Dynamic stats calculation
  const stats = [
    {
      label: "Active Projects",
      value: projects.length.toString(),
      icon: Activity,
      change: projects.length > 0 ? "+100%" : "0%"
    },
    {
      label: "Verified Tons",
      value: projects.reduce((sum, p) => sum + (p.consensusData?.finalVerifiedTons || 0), 0).toLocaleString(),
      icon: Leaf,
      change: "Global"
    },
    {
      label: "My Credits",
      value: portfolio.creditsOwned.toString(),
      icon: ShoppingCart,
      change: "Owned"
    },
    {
      label: "Audit Events",
      value: auditLog.length.toString(),
      icon: Shield,
      change: "Immutable"
    },
  ];

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
    });
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "verification":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "submission":
        return <Plus className="w-5 h-5 text-primary" />;
      case "trade":
        return <ArrowUpRight className="w-5 h-5 text-warning" />;
      case "retirement":
        return <Leaf className="w-5 h-5 text-destructive" />;
      default:
        return <Activity className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case "verification": return "bg-success/10 text-success border-success/20";
      case "submission": return "bg-primary/10 text-primary border-primary/20";
      case "trade": return "bg-warning/10 text-warning border-warning/20";
      case "retirement": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole={userRole} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring of the Green Ledger ecosystem as <strong>{userRole.replace("-", " ").toUpperCase()}</strong>
            </p>
          </div>
          <Badge variant="outline" className="mb-1 text-xs py-1 px-3 border-primary/50 text-primary font-mono">
            LIVE NETWORK STATE
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 bg-gradient-card hover:shadow-lg transition-all border-border/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity (Audit Log) */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Ledger Events
              </h2>
              <Link to="/audit">
                <Button variant="ghost" size="sm">
                  Full Audit Trail
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {auditLog.length > 0 ? (
                auditLog.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${getStatusColor(activity.actionType)}`}>
                      {getStatusIcon(activity.actionType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-foreground">
                          {activity.actionType.charAt(0).toUpperCase() + activity.actionType.slice(1)}: {activity.projectName}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {activity.details}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {activity.attestationHash && (
                          <button
                            onClick={() => copyToClipboard(activity.attestationHash!)}
                            className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-mono bg-primary/5 px-2 py-0.5 rounded"
                          >
                            <span>REF: {shortenHash(activity.attestationHash, 8)}</span>
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                        <Badge variant="outline" className="text-[10px] py-0 px-2 h-4 border-muted text-muted-foreground">
                          VERIFIED
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">No ledger entries detected yet.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Role-Specific Card */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                User Authority
              </h2>
              <div className="p-4 rounded-xl bg-muted/20 border border-border mb-6">
                <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Assigned Role</div>
                <div className="text-lg font-bold text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {userRole.replace("-", " ").toUpperCase()}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">Quick Actions</h3>
                {userRole === "project-owner" && (
                  <Link to="/projects">
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <Plus className="w-4 h-4" />
                      Submit New Project
                    </Button>
                  </Link>
                )}
                {userRole === "verifier" && (
                  <Link to="/verify">
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <CheckCircle className="w-4 h-4" />
                      Run Consensus Engine
                    </Button>
                  </Link>
                )}
                <Link to="/marketplace">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <ShoppingCart className="w-4 h-4" />
                    Marketplace Center
                  </Button>
                </Link>
                {userRole === "buyer-seller" && (
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Leaf className="w-4 h-4" />
                    Retire Carbon Credits
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Network Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Consensus Consistency</span>
                  <span className="text-success font-medium">100%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Ledger Sync</span>
                  <span className="text-success font-medium">Synchronized</span>
                </div>
                <div className="pt-2">
                  <div className="text-[10px] text-muted-foreground mb-1">NETWORK HEALTH</div>
                  <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                    <div className="bg-success h-full w-[98%]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
