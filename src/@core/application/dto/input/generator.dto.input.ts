export type TGeneratorInputDTO = {
  email: string;
  password: string;
  name: string;
  phone: {
    ddd: number;
    ddi: number;
    number: string;
  };
  birthDate: Date;
  document: string;
}
