import { useContext } from "react";
import { CompanyContext } from "./companyContextValue";

export function useCompanies() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error("useCompanies must be used within CompanyProvider");
  }

  return context;
}
