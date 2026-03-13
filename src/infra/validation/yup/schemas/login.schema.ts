import * as yup from 'yup'
import { TSessionInputDTO } from "../../../../@core/application/dto/input/session.dto.input";

export const loginSchema: yup.SchemaOf<TSessionInputDTO> = yup.object().shape({
  password: yup.string().required(),
  email: yup.string().email().required()
})
