
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import Navbar from "./components/layout/Navbar";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import ListProject from "./pages/ListProject";
import DAO from "./pages/DAO";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/list-project" element={<ListProject />} />
              <Route path="/dao" element={<DAO />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
