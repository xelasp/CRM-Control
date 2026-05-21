import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OrgGuard } from "@/components/OrgGuard";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Kanban from "./pages/Kanban";
import AdminPanel from "./pages/AdminPanel";
import SuperAdmin from "./pages/SuperAdmin";
import Onboarding from "./pages/Onboarding";
import AceitarConvite from "./pages/AceitarConvite";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <OrgGuard>
        <AppLayout>{children}</AppLayout>
      </OrgGuard>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <OrganizationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/aceitar-convite" element={<AceitarConvite />} />

              {/* Onboarding — autenticado mas sem org */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />

              {/* Rotas protegidas — exigem auth + organização */}
              <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
              <Route path="/cadastro" element={<ProtectedLayout><Cadastro /></ProtectedLayout>} />
              <Route path="/kanban" element={<ProtectedLayout><Kanban /></ProtectedLayout>} />
              <Route path="/admin" element={<ProtectedLayout><AdminPanel /></ProtectedLayout>} />
              <Route path="/perfil" element={<ProtectedLayout><Perfil /></ProtectedLayout>} />
              <Route path="/configuracoes" element={<ProtectedLayout><Configuracoes /></ProtectedLayout>} />

              {/* Super Admin */}
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute>
                    <AppLayout><SuperAdmin /></AppLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OrganizationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
