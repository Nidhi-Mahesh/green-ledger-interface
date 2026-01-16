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
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Copy,
  CheckCircle,
  FileText,
  Box,
  Hash
} from "lucide-react";
import { useState } from "react";
import { shortenHash } from "@/utils/fakeBlockchain";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalStore } from "@/context/GlobalStore";

const Audit = () => {
  const { state } = useGlobalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const auditLog = state.auditLog;

  // Filter audit log based on search query
  const filteredEvents = auditLog.filter(event =>
    event.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.attestationHash && event.attestationHash.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: "Hash copied to clipboard",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "submission":
        return <FileText className="w-4 h-4 text-primary" />;
      case "verification":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "minting":
        return <Box className="w-4 h-4 text-warning" />;
      case "trade":
        return <ArrowUpRight className="w-4 h-4 text-warning" />;
      case "retirement":
        return <Flame className="w-4 h-4 text-destructive" />;
      default:
        return <Hash className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "submission":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Submission</Badge>;
      case "verification":
        return <Badge className="bg-success/10 text-success border-success/20">Verification</Badge>;
      case "minting":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Minting</Badge>;
      case "trade":
        return <Badge variant="default">Trade</Badge>;
      case "retirement":
        return <Badge variant="destructive">Retirement</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} userRole={state.userRole} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Global Audit Trail
            </h1>
            <p className="text-muted-foreground">
              Immutable ledger of all consensus-driven activities and transactions
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Ledger Integrity</div>
            <Badge variant="outline" className="text-success border-success/30 bg-success/5">
              Verified & Synchronized
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by event, project name, or hash..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* Audit Log Table */}
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[150px]">Event Type</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="max-w-[300px]">Details</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Deterministic Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-accent/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(event.actionType)}
                        {getTypeBadge(event.actionType)}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {event.projectName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {event.details}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {new Date(event.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {event.attestationHash ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => copyToClipboard(event.attestationHash!)}
                              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-mono bg-primary/5 px-2 py-1 rounded"
                            >
                              <span>{shortenHash(event.attestationHash, 10)}</span>
                              <Copy className="w-3 h-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="font-mono text-[10px] break-all max-w-[200px]">{event.attestationHash}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-12 h-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground font-medium">No audit events found recorded in the ledger.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Audit;
