export type TUserPrismaResult = {
  id: string;
  email: string;
  password: string;
  phone: string;
  name: string;
  tbl_generator: {
    id: string;
  }[],
  tbl_waste_collector: {
    id: string;
  }[]
}
