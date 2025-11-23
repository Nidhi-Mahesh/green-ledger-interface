import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUpRight, ArrowDownRight, Flame } from "lucide-react";
import { useState } from "react";

const Audit = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const transactions = [
    {
      id: "TXN001",
      type: "issuance",
      project: "Solar Farm Alpha",
      amount: 500,
      from: "System",
      to: "GreenTech Solutions",
      timestamp: "2024-02-20 14:30:22",
      blockchainHash: "0x7a3f...92bc",
    },
    {
      id: "TXN002",
      type: "trade",
      project: "Wind Energy Delta",
      amount: 200,
      from: "EcoInvest Corp",
      to: "Carbon Neutral Inc",
      timestamp: "2024-02-20 11:15:08",
      blockchainHash: "0x4e2d...71af",
    },
    {
      id: "TXN003",
      type: "retirement",
      project: "Reforestation Omega",
      amount: 100,
      from: "Carbon Neutral Inc",
      to: "Burned",
      timestamp: "2024-02-19 16:42:55",
      blockchainHash: "0x9c8b...43de",
    },
    {
      id: "TXN004",
      type: "trade",
      project: "Hydroelectric Gamma",
      amount: 350,
      from: "GreenTech Solutions",
      to: "EcoInvest Corp",
      timestamp: "2024-02-19 09:20:17",
      blockchainHash: "0x1f5e...88cd",
    },
    {
      id: "TXN005",
      type: "issuance",
      project: "Biomass Plant Epsilon",
      amount: 450,
      from: "System",
      to: "EcoEnergy India",
      timestamp: "2024-02-18 13:05:44",
      blockchainHash: "0x6d4c...29fe",
    },
    {
      id: "TXN006",
      type: "trade",
      project: "Solar Farm Alpha",
      amount: 150,
      from: "GreenTech Solutions",
      to: "Carbon Neutral Inc",
      timestamp: "2024-02-17 10:33:12",
      blockchainHash: "0x2a7b...55ea",
    },
    {
      id: "TXN007",
      type: "retirement",
      project: "Wind Energy Delta",
      amount: 75,
      from: "EcoInvest Corp",
      to: "Burned",
      timestamp: "2024-02-16 15:18:39",
      blockchainHash: "0x8e3f...66db",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "issuance":
        return <ArrowDownRight className="w-4 h-4 text-success" />;
      case "trade":
        return <ArrowUpRight className="w-4 h-4 text-primary" />;
      case "retirement":
        return <Flame className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "issuance":
        return <Badge className="bg-success text-success-foreground">Issued</Badge>;
      case "trade":
        return <Badge variant="default">Trade</Badge>;
      case "retirement":
        return <Badge variant="destructive">Retired</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Audit Trail
          </h1>
          <p className="text-muted-foreground">
            Complete blockchain-verified transaction history
          </p>
        </div>

        {/* Search and Stats */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-4 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID, project, or user..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-24">Type</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Credits</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Blockchain Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-accent/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      {getTypeBadge(tx.type)}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {tx.id}
                  </TableCell>
                  <TableCell className="font-medium">{tx.project}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {tx.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tx.from}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tx.to}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tx.timestamp}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs text-primary font-mono">
                      {tx.blockchainHash}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Audit;
