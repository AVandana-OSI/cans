import { RESIDENCE_TYPE } from './AddressType'

const addressTypes = [{ code: RESIDENCE_TYPE, value: 'Home' }]
const unableToDetermineCodes = [
  { code: 'A', value: 'Abandoned' },
  { code: 'I', value: 'Unknown' },
  { code: 'K', value: 'Unknown' },
]
export const systemCodes = {
  addressTypes,
  unableToDetermineCodes,
}
