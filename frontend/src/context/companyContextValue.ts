import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Company } from "../data/companies";

export type CompanyContextType = {
  companies: Company[];
  setCompanies: Dispatch<SetStateAction<Company[]>>;
};

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined,
);
