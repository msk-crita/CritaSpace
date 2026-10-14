import { useState } from "react";
import type { ReactNode } from "react";
import { initialCompanies } from "../data/companies";
import type { Company } from "../data/companies";
import { CompanyContext } from "./companyContextValue";

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  return (
    <CompanyContext.Provider value={{ companies, setCompanies }}>
      {children}
    </CompanyContext.Provider>
  );
}
