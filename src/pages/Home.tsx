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
} from "lucide-react";

const Home = () => {
  const stats = [
    { label: "Carbon Credits Issued", value: "2.4M Tons", icon: Leaf },
    { label: "Active Projects", value: "342", icon: Globe },
    { label: "Verified Transactions", value: "15,678", icon: CheckCircle },
    { label: "Platform Users", value: "4,521", icon: Users },
  ];

  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description:
        "Every carbon credit is tokenized and tracked on an immutable blockchain ledger.",
    },
    {
      icon: TrendingUp,
      title: "Transparent Trading",
      description:
        "Fair market pricing with complete visibility into project details and verification status.",
    },
    {
      icon: Users,
      title: "Multi-Role Platform",
      description:
        "Designed for project owners, verifiers, and buyers with dedicated workflows.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Connect carbon offset projects worldwide with buyers seeking verified credits.",
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
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Decentralized Carbon Credit Trading
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Track, Trade & Retire{" "}
              <span className="text-primary">Carbon Credits</span> with
              Transparency
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              CarbonChain leverages blockchain technology to create a
              trustworthy marketplace for verified carbon offset projects and
              tokenized credits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary shadow-glow">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline">
                  Explore Marketplace
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
              Why Choose CarbonChain?
            </h2>
            <p className="text-lg text-muted-foreground">
              A comprehensive platform built for trust, transparency, and
              environmental impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card hover:shadow-md transition-all"
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple steps to participate in the carbon credit ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-glow">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Register Project
              </h3>
              <p className="text-muted-foreground">
                Project owners submit carbon offset initiatives with supporting
                documentation for verification.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-glow">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Verify & Tokenize
              </h3>
              <p className="text-muted-foreground">
                Independent verifiers approve projects, and credits are minted
                as blockchain tokens (1 token = 1 ton CO₂e).
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto shadow-glow">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Trade & Retire
              </h3>
              <p className="text-muted-foreground">
                Buy, sell, or permanently retire credits on our transparent
                marketplace with full audit trails.
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
              Join the Carbon Offset Revolution
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Whether you're a project owner, verifier, or buyer, CarbonChain
              provides the tools you need to make a real environmental impact.
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-card text-primary hover:bg-card/90 shadow-lg"
              >
                Create Your Account
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
              CarbonChain
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 CarbonChain. Building a sustainable future.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
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
