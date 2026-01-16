import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Projects from "./pages/Projects";
import Verify from "./pages/Verify";
import Audit from "./pages/Audit";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AssistBotButton } from "./components/AssistBot";
import { GlobalStoreProvider } from "./context/GlobalStore";

const queryClient = new QueryClient();

const App = () => (
  <GlobalStoreProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AssistBotButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GlobalStoreProvider>
);

export default App;
