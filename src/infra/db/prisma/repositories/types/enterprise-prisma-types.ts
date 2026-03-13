export type TEnterprisePrismaResult = {
  id: string;
  commercialName: string;
  companyName: string;
  document: string;
  user_id: string;
  user: {
    id: string;
    email: string;
    password: string;
    phone: string;
    name: string;
  };
  tbl_enterprise_address: {
    complement: string;
    number: string;
    address: {
      id: string;
      zipCode: string
    }
  }[]
}
