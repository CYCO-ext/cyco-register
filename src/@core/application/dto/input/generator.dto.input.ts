export type TGeneratorInputDTO = {
  email: string;
  password: string;
  name: string;
  phone: {
    ddd: number;
    ddi: number;
    number: string;
  };
  address: {
    zipCode: string;
    number: string;
    complement?: string;
  },
  birthDate: Date;
  document: string;
}
