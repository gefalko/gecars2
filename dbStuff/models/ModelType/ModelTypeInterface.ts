import { MakeModelI } from '../make/MakeModel'
import { ProvidersDataInterface } from './ProviderDataInterface'

export interface ModelTypeInterface {
  name?: string
  make?: MakeModelI
  providersData?: ProvidersDataInterface
}
