export type TSessionOutputDTO = {
  user: {
    name: string
    email: string
  }
  role: "WASTE_COLLECTOR" | "GENERATOR"
  token: string
}
