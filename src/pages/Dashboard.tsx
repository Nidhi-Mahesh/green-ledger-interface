import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { shortenHash } from "@/utils/fakeBlockchain";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  // Simulate user role - replace with actual auth context
  const [userRole] = useState<"project-owner" | "verifier" | "buyer-seller">(
    "project-owner"
  );

  const stats = [
    { label: "Active Credits", value: "2,450", icon: Leaf, change: "+12%" },
    { label: "Total Value", value: "$48,900", icon: TrendingUp, change: "+8%" },
    { label: "Transactions", value: "156", icon: ShoppingCart, change: "+23%" },
    { label: "Verified Projects", value: "8", icon: CheckCircle, change: "0%" },
  ];

  const recentActivities = [
    {
      type: "credit-issued",
      title: "Credits Issued",
      description: "500 credits from Solar Farm Project Alpha",
      time: "2 hours ago",
      status: "success",
      txHash: "0x7a3f8e2c4b9d1a6f5e8c7b4a9d2e1f3c8b7a6d5e4c3b2a1f9e8d7c6b5a4392bc",
    },
    {
      type: "verification",
      title: "Verification Pending",
      description: "Wind Energy Project Delta awaiting approval",
      time: "5 hours ago",
      status: "pending",
      txHash: null,
    },
    {
      type: "trade",
      title: "Trade Completed",
      description: "Sold 200 credits at $20/credit",
      time: "1 day ago",
      status: "success",
      txHash: "0x4e2d7f8a9b3c6d5e1f4a2b8c7d6e5f3a9b8c7d6e5f4a3b2c1d9e8f7a6b571af",
    },
    {
      type: "retirement",
      title: "Credits Retired",
      description: "100 credits permanently retired",
      time: "2 days ago",
      status: "info",
      txHash: "0x9c8b7a6d5e4f3c2b1a9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c3b2a1f9e8d743de",
    },
  ];

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard",
    });
  };

  const notifications = [
    {
      message: "New verification request for Reforestation Project Omega",
      time: "30 min ago",
      type: "alert",
    },
    {
      message: "Your project 'Solar Farm Alpha' has been verified",
      time: "3 hours ago",
      type: "success",
    },
    {
      message: "Market price update: Average credit price +5%",
      time: "1 day ago",
      type: "info",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "pending":
        return <Clock className="w-5 h-5 text-warning" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole={userRole} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your carbon credit activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 bg-gradient-card hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <Badge
                  variant={
                    stat.change.startsWith("+") ? "default" : "secondary"
                  }
                  className="text-xs"
                >
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
          {/* Recent Activity */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Recent Activity
              </h2>
              <Link to="/audit">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">
                      {activity.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {activity.description}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                      {activity.txHash && (
                        <button
                          onClick={() => copyToClipboard(activity.txHash!)}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-mono"
                        >
                          <span>{shortenHash(activity.txHash)}</span>
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Notifications
            </h2>

            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border bg-accent/30"
                >
                  <div className="text-sm text-foreground mb-2">
                    {notification.message}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {notification.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === "project-owner" && (
              <Link to="/projects">
                <Button variant="outline" className="w-full">
                  Register Project
                </Button>
              </Link>
            )}
            {userRole === "verifier" && (
              <Link to="/verify">
                <Button variant="outline" className="w-full">
                  Verify Projects
                </Button>
              </Link>
            )}
            <Link to="/marketplace">
              <Button variant="outline" className="w-full">
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" className="w-full">
                Trade Credits
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              Retire Credits
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
