export type TDeliverymanPrismaResult = {
  id: string;
  licenseNumber: string;
  birthDate: Date;
  user_id: string;
  user: {
    id: string;
    email: string;
    password: string;
    phone: string;
    name: string;
  };
  tbl_vehicle_deliveryman: {
    id: string;
    deliveryman_id: string;
    vehicle_id: string;
    plate: string;
    model_id: string;
    color_id: string;
    vehicle: {
      id: string;
      year: number;
      brand: {
        id: string;
        brand: string;
      };
      type: {
        id: string;
        type: string;
      };
      tbl_vehicle_color: {
        color: {
          id: string;
          color: string;
        };
      }[];
      tbl_vehicle_vehicle_model: {
        model: {
          id: string;
          model: string;
        };
      }[];
    };
  }[];
};
// {
//   id: string;
//   licenseNumber: string;
//   birthDate: Date;
//   user_id: string;
// } & {
//   tbl_vehicle_deliveryman: {
//     vehicle: TVehiclePrismaResult;
//     plate: string
//   };
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     password: string;
//     phone: string;
//   };
// }
