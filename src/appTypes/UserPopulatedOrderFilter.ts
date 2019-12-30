import FilterModelInterface from 'appTypes/FilterModelInterface'
import ModelTypeModelInterface from 'appTypes/ModelTypeModelInterface'
import MakeModelInteface from 'appTypes/MakeModelInterface'
import ProviderModelInterface from 'appTypes/ProviderModelInterface'

interface UserPopulatedOrderFilter extends Omit<FilterModelInterface, 'providers' | 'make' | 'modelType'> {
  providers: ProviderModelInterface[]
  make: MakeModelInteface
  modelType: ModelTypeModelInterface
}

export default UserPopulatedOrderFilter
