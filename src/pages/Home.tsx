import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import {
  Shield,
  TrendingUp,
  Leaf,
  Globe,
  Users,
  CheckCircle,
  ArrowRight,
  Calculator,
  Bot,
  Hash,
  Activity
} from "lucide-react";

const Home = () => {
  const stats = [
    { label: "Verified Tons CO₂e", value: "2.4M", icon: Leaf },
    { label: "Active Project Nodes", value: "342", icon: Activity },
    { label: "Consensus Proofs", value: "15,678", icon: Shield },
    { label: "Network Participants", value: "4,521", icon: Users },
  ];

  const features = [
    {
      icon: Shield,
      title: "Auditable Consensus",
      description:
        "Every credit is verified by a deterministic multi-agent consortium, ensuring zero human discretion.",
    },
    {
      icon: TrendingUp,
      title: "Risk-Aware Trading",
      description:
        "Dynamic collateral requirements automatically calculated based on agent confidence scores.",
    },
    {
      icon: Bot,
      title: "Multi-Agent Nodes",
      description:
        "Independent verification agents (Satellite, Baseline, Anomaly) reach consensus on every ton.",
    },
    {
      icon: Hash,
      title: "Deterministic Hashes",
      description:
        "Verifiable attestation hashes allow any auditor to replay consensus logic and confirm results.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={false} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Next-Gen Deterministic Carbon Ledger
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              The Protocol for <br />
              <span className="text-primary underline decoration-primary/30 underline-offset-8">Verified</span> Carbon Impact
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Green Ledger replaces subjective manual audits with a deterministic, multi-agent consensus engine
              recorded on an immutable auditable trail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary shadow-glow px-8">
                  Launch App
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="px-8 border-primary/30">
                  Marketplace
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 bg-gradient-card border-border/50 hover:shadow-lg transition-all"
              >
                <stat.icon className="w-8 h-8 text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Green Ledger Standard
            </h2>
            <p className="text-lg text-muted-foreground">
              Eliminating "Green-washing" through programmatic enforcement and auditable replayability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card hover:shadow-md transition-all border-border/50"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Consensus Pipeline
            </h2>
            <p className="text-lg text-muted-foreground">
              How the multi-agent consortium secures the carbon market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-glow">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Submission
              </h3>
              <p className="text-muted-foreground">
                Project owners register data with immutable evidence hashes attached.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-glow">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Verification Consortium
              </h3>
              <p className="text-muted-foreground">
                Agent nodes analyze data and reach weighted consensus on reduction claims.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-glow">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Attestation
              </h3>
              <p className="text-muted-foreground">
                A deterministic hash secures the result, making the entire audit trail auditable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to verify real impact?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Join the Green Ledger ecosystem and participate in the world's most transparent carbon credit marketplace.
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-card text-primary hover:bg-card/90 shadow-lg px-12"
              >
                Join the Network
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <Leaf className="w-6 h-6" />
              Green Ledger Protocol
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              STATUS: FULLY DETERMINISTIC & AUDITABLE
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Whitepaper
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Audit Trail
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
