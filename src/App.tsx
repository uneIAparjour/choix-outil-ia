import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/comparer" element={<Compare />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  </TooltipProvider>
);

export default App;
