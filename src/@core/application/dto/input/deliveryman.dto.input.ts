export type TDeliverymanInputDTO = {
  email: string;
  password: string;
  name: string;
  phone: {
    ddd: number;
    ddi: number;
    number: string;
  };
  birthDate: Date;
  licenseNumber: string;
  vehicle: {
    id: string;
    colorId: string;
    modelId: string;
    plate: string;
  }
}
