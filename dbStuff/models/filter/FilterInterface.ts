import { MakeModelI } from '../make/MakeModel'
import { ModelTypeModelI } from '../modelType/ModelTypeModel'
import { OrderModelI } from '../order/OrderModel'
import { ProviderModelI } from '../provider/ProviderModel'
import { FuelTypeModelI } from '../fuelType/FuelTypeModel'

export interface FilterInterface {
  order?: OrderModelI
  make?: MakeModelI
  modelType?: ModelTypeModelI
  providers?: ProviderModelI
  priceFrom?: number
  priceTo?: number
  yearFrom?: number
  yearTo?: number
  fuel?: string
  fuel2?: FuelTypeModelI
  status?: number
}
