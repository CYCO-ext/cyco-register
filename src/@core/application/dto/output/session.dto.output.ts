export type TSessionOutputDTO = {
  user: {
    id: string,
    name: string
    email: string
  }
  role: "WASTE_COLLECTOR" | "GENERATOR"
  token: string
}
