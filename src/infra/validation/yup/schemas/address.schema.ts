import * as yup from 'yup'
import { TAddressInputDTO } from '../../../../@core/application/dto/input/address.dto.input'

export const addressSchema: yup.SchemaOf<TAddressInputDTO> = yup.object().shape({
  zipCode: yup.string().required(),
  complement: yup.string().required(),
  number: yup.string().required()
})
