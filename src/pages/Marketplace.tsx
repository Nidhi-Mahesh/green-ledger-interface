import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Leaf, TrendingUp } from "lucide-react";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const listings = [
    {
      id: 1,
      projectName: "Solar Farm Alpha",
      location: "California, USA",
      type: "Solar Energy",
      availableCredits: 500,
      pricePerCredit: 22,
      verified: true,
      reductionAmount: "500 tons CO₂e",
    },
    {
      id: 2,
      projectName: "Reforestation Omega",
      location: "Amazon, Brazil",
      type: "Reforestation",
      availableCredits: 1200,
      pricePerCredit: 18,
      verified: true,
      reductionAmount: "1,200 tons CO₂e",
    },
    {
      id: 3,
      projectName: "Wind Energy Delta",
      location: "Texas, USA",
      type: "Wind Energy",
      availableCredits: 800,
      pricePerCredit: 20,
      verified: true,
      reductionAmount: "800 tons CO₂e",
    },
    {
      id: 4,
      projectName: "Ocean Conservation Beta",
      location: "Pacific Ocean",
      type: "Marine Conservation",
      availableCredits: 350,
      pricePerCredit: 25,
      verified: true,
      reductionAmount: "350 tons CO₂e",
    },
    {
      id: 5,
      projectName: "Hydroelectric Gamma",
      location: "Norway",
      type: "Hydroelectric",
      availableCredits: 600,
      pricePerCredit: 19,
      verified: true,
      reductionAmount: "600 tons CO₂e",
    },
    {
      id: 6,
      projectName: "Biomass Plant Epsilon",
      location: "India",
      type: "Biomass Energy",
      availableCredits: 450,
      pricePerCredit: 17,
      verified: true,
      reductionAmount: "450 tons CO₂e",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={false} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Carbon Credit Marketplace
          </h1>
          <p className="text-muted-foreground">
            Browse and trade verified carbon credits from projects worldwide
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="solar">Solar Energy</SelectItem>
                <SelectItem value="wind">Wind Energy</SelectItem>
                <SelectItem value="reforestation">Reforestation</SelectItem>
                <SelectItem value="marine">Marine Conservation</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="price-low">
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="credits-high">Most Credits</SelectItem>
                <SelectItem value="recent">Recently Listed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Project Header */}
              <div className="bg-gradient-primary p-6 text-primary-foreground">
                <div className="flex items-start justify-between mb-3">
                  <Badge className="bg-card text-primary">
                    {listing.verified ? "Verified" : "Pending"}
                  </Badge>
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {listing.projectName}
                </h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <MapPin className="w-4 h-4" />
                  {listing.location}
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium text-foreground">
                    {listing.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Available Credits
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {listing.availableCredits.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    CO₂e Reduction
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {listing.reductionAmount}
                  </span>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      Price per Credit
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-primary">
                        ${listing.pricePerCredit}
                      </span>
                      <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-primary">
                    Buy Credits
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
