import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyOrganization, isSuperAdmin } from "@/services/organizationService";
import type { Organization } from "@/types/organization";

interface OrganizationContextType {
  organization: Organization | null;
  isSuperAdmin: boolean;
  loading: boolean;
  recarregar: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function useOrganization() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error("useOrganization must be used within OrganizationProvider");
  return ctx;
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    if (!user) {
      setOrganization(null);
      setSuperAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [org, admin] = await Promise.all([
        fetchMyOrganization(),
        isSuperAdmin(),
      ]);
      setOrganization(org);
      setSuperAdmin(admin);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [user]);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        isSuperAdmin: superAdmin,
        loading,
        recarregar: carregar,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
