import * as yup from 'yup'
import { TGeneratorInputDTO } from '../../../../@core/application/dto/input/generator.dto.input'

export const generatorSchema: yup.SchemaOf<TGeneratorInputDTO> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  name: yup.string().required(),
  birthDate: yup.date().required(),
  document: yup.string().required(),
  address: yup.object().shape({
    zipCode: yup.string().required(),
    number: yup.string().required(),
    complement: yup.string()
  }).required(),
  phone: yup.object().shape({
    ddd: yup.string().required(),
    ddi: yup.string().required(),
    number: yup.string().required()
  }).required()
})
