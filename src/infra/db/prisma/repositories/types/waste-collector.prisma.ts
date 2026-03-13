import { number } from "yup";

export type TWasteCollectorPismaResult = {
  id: string;
  document: string;
  isEnterprise: boolean;
  user_id: string;
  user: {
    id: string;
    email: string;
    password: string;
    phone: string;
    name: string
  };
  tbl_waste_collector_address: {
    complement?: string;
    number?: string;
    address: {
      id: string;
      zipCode: string
    };
  }[];

  tbl_enterprise: {
    id: string;
    commercialName: string;
    companyName: string;
  }[];
  tbl_materials_waste_collector: {
    materials: {
      id: string;
      name: string;
    };
  }[];
}
