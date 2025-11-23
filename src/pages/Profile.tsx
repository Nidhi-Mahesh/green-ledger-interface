import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Wallet, Bell, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleConnectWallet = () => {
    setWalletConnected(true);
    toast({
      title: "Wallet Connected",
      description: "Your blockchain wallet has been connected successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole="buyer-seller" />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profile & Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Personal Information
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization (Optional)</Label>
                <Input
                  id="organization"
                  placeholder="Your company or organization"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Role</Label>
                <div className="flex gap-2">
                  <Badge>Buyer/Seller</Badge>
                  <Badge variant="outline">Project Owner</Badge>
                  <Badge variant="outline">Verifier</Badge>
                </div>
              </div>

              <Separator />

              <Button onClick={handleSaveProfile} className="bg-gradient-primary">
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Wallet & Security */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Blockchain Wallet
                </h2>
              </div>

              {walletConnected ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm font-medium text-success mb-2">
                      Wallet Connected
                    </p>
                    <code className="text-xs text-foreground font-mono break-all">
                      0x742d...a8c9
                    </code>
                  </div>
                  <Button variant="outline" className="w-full">
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect your blockchain wallet to trade and manage carbon
                    credits.
                  </p>
                  <Button
                    onClick={handleConnectWallet}
                    className="w-full bg-gradient-primary"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Security
                </h2>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Enable Two-Factor Auth
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Notifications
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-foreground">
                    Project verification updates
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-foreground">Trade confirmations</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-foreground">Market price alerts</span>
                </label>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
