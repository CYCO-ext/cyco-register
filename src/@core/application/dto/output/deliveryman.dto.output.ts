export type TDeliverymanOutputDTO = {
  id: string;
  email: string;
  name: string;
  phone: {
    ddd: number;
    ddi: number;
    number: string;
  };
  birthDate: Date;
  licenseNumber: string;
  vehicle: {
    id: string
    type: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    plate: string;
  }
}
