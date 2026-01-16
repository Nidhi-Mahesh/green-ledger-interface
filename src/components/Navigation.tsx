import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, Shield, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/context/GlobalStore";

interface NavigationProps {
  isAuthenticated?: boolean;
  userRole?: "project-owner" | "verifier" | "buyer-seller";
}

const Navigation = ({ isAuthenticated = false, userRole: propsUserRole }: NavigationProps) => {
  const { state, dispatch } = useGlobalStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Use role from global store, fallback to prop
  const userRole = state.userRole || propsUserRole;

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { label: "Home", path: "/" },
    { label: "Marketplace", path: "/marketplace" },
    { label: "Audit Trail", path: "/audit" },
  ];

  const authenticatedLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Marketplace", path: "/marketplace" },
    ...(userRole === "project-owner" ? [{ label: "My Projects", path: "/projects" }] : []),
    ...(userRole === "verifier" ? [{ label: "Verify", path: "/verify" }] : []),
    { label: "Audit Trail", path: "/audit" },
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  const toggleRole = () => {
    const roles: ("project-owner" | "verifier" | "buyer-seller")[] = ["project-owner", "verifier", "buyer-seller"];
    const currentIndex = roles.indexOf(userRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    dispatch({ type: "SET_USER_ROLE", payload: nextRole });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            Green Ledger
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(link.path) ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth/Role Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleRole}
                  className="text-[10px] font-mono border-primary/30"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  ROLE: {userRole?.toUpperCase()}
                </Button>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "RESET_STATE" })}>
                  Reset
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border bg-card">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "block px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.path)
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-4 space-y-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" size="sm" className="w-full" onClick={toggleRole}>
                    Switch Role: {userRole}
                  </Button>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <Button size="sm" className="w-full bg-destructive" onClick={() => dispatch({ type: "RESET_STATE" })}>
                    Reset State
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-gradient-primary">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
