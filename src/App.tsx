import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentSelection from "./pages/StudentSelection";
import AgentSearch from "./pages/AgentSearch";
import ScholarshipResults from "./pages/ScholarshipResults";
import ActionPlanPage from "./pages/ActionPlanPage";
import TrackerPage from "./pages/TrackerPage";
import StudentChat from "./pages/StudentChat";
import StudentResults from "./pages/StudentResults";
import StudentActionPlan from "./pages/StudentActionPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/students" element={<StudentSelection />} />
          <Route path="/agent-search/:studentId" element={<AgentSearch />} />
          <Route path="/scholarship-results/:studentId" element={<ScholarshipResults />} />
          <Route path="/action-plan" element={<ActionPlanPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/student-chat" element={<StudentChat />} />
          <Route path="/student-results" element={<StudentResults />} />
          <Route path="/student-action-plan" element={<StudentActionPlan />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
