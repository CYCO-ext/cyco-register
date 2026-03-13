import * as yup from 'yup'
import { TDeliverymanInputDTO } from '../../../../@core/application/dto/input/deliveryman.dto.input'

export const deliverymanSchema: yup.SchemaOf<TDeliverymanInputDTO> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  name: yup.string().required(),
  birthDate: yup.date().required(),
  licenseNumber: yup.string().required(),
  phone: yup.object().shape({
    ddd: yup.string().required(),
    ddi: yup.string().required(),
    number: yup.string().required()
  }).required(),
  vehicle: yup.object().shape({
    id: yup.string().required(),
    colorId: yup.string().required(),
    modelId: yup.string().required(),
    plate: yup.string().required()
  }).required()
})
