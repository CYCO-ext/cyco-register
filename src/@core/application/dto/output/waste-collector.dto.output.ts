export type TWasteCollectorOutputDTO = {
  id: string;
  email: string;
  phone: {
    ddd: number;
    ddi: number;
    number: string;
  };
  address: {
    zipCode: string;
    number: string;
    complement: string;
  }
  document: string;
  isEnterprise: boolean;
  materials: string[];
  enterprise?: {
    commercialName: string;
    companyName: string;
  };
}
