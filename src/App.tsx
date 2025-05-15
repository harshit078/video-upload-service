import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import VideoDetail from "./pages/VideoDetail";
import SharesPage from "./pages/SharesPage";
import MainLayout from "./components/MainLayout";
import Login from "./pages/Login";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
        <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Index />
            </MainLayout>
          </ProtectedRoute>
        }
      />
          <Route 
            path="/video/:id" 
            element={
          <ProtectedRoute>
              <MainLayout>
                <VideoDetail />
              </MainLayout>
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/shares" 
            element={
          <ProtectedRoute>
              <MainLayout>
                <SharesPage />
              </MainLayout>
          </ProtectedRoute>
            } 
          />
        </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
