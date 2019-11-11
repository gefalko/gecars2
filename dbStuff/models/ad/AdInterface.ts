import { MakeModelI } from '../make/MakeModel'
import { FilterModelI } from '../filter/FilterModel'
import { ModelTypeModelI } from '../modelType/ModelTypeModel'

export interface AdInterface {
  filter: FilterModelI
  make: MakeModelI
  modelType: ModelTypeModelI
  title?: string
  year: number
  price: number
  fuel: string
  providerAdId: string
  url: string
  img: string
  strategy?: string
}
