export type Company = {
  id: number;
  name: string;
  contactName: string;
  email: string;
  active: boolean;
  userCount: number;
};

export const initialCompanies: Company[] = [
  {
    id: 1,
    name: "Crita Creative",
    contactName: "Alex Morgan",
    email: "admin@critacreative.example",
    active: true,
    userCount: 2,
  },
  {
    id: 2,
    name: "Northstar Labs",
    contactName: "Taylor Reed",
    email: "admin@northstarlabs.example",
    active: true,
    userCount: 2,
  },
  {
    id: 3,
    name: "Greenfield Technologies",
    contactName: "Jordan Lee",
    email: "admin@greenfield.example",
    active: false,
    userCount: 0,
  },
];
