import * as yup from 'yup'
import { TWasteCollectorInputDTO } from '../../../../@core/application/dto/input/waste-collector.dto.input'

export const wasteCollectorSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  name: yup.string().required(),
  document: yup.string().required(),
  isEnterprise: yup.boolean().required(),
  address: yup.object().shape({
    zipCode: yup.string().required(),
    number: yup.string().nullable(),
    complement: yup.string().nullable()
  }).required(),
  materials: yup.array().of(yup.string()).required(),
  enterprise: yup.object().when('isEnterprise', {
    is: true,
    then: yup.object().shape({
      commercialName: yup.string().required(),
      companyName: yup.string().required()
    }).required(),
    otherwise: yup.object().nullable().notRequired()
  }),
  phone: yup.object().shape({
    ddd: yup.string(),
    ddi: yup.string(),
    number: yup.string()
  }).required()
})
