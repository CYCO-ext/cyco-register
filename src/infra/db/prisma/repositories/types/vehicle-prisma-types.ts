export type TVehiclePrismaResult = {
  id: string;
  year: number;
  brand_id: string;
  type_id: string;
} & {
  brand: {
    id: string;
    brand: string;
  };
  tbl_vehicle_color: {
    color: {
      id: string;
      color: string;
    };
  }[];
  type: {
    id: string;
    type: string;
  };
  tbl_vehicle_vehicle_model: {
    model: {
      id: string;
      model: string;
    };
  }[];
  tbl_vehicle_deliveryman: {
    id: string;
    deliveryman_id: string;
    vehicle_id: string;
    plate: string;
  }[];
}
