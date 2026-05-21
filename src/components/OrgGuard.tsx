import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useOrganization } from "@/contexts/OrganizationContext";
import { Loader2 } from "lucide-react";

interface OrgGuardProps {
  children: ReactNode;
}

/**
 * Protege rotas que exigem organização.
 * Se usuário não tem org → redireciona para /onboarding.
 * Super admin pode acessar sem org.
 */
export function OrgGuard({ children }: OrgGuardProps) {
  const { organization, isSuperAdmin, loading } = useOrganization();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!organization && !isSuperAdmin) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
