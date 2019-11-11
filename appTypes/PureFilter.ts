type Provider = 'gumtree' | 'ebay' | 'autotrader'
type Fuel = 'petrol' | 'diesel'

interface PureFilter {
  make: string,
  modelType: string,
  priceFrom: number,
  priceTo: number,
  yearFrom: number,
  yearTo: number,
  providers: Provider[],
  id?: number,
  fuel?: Fuel
  remove?: boolean
}

export default PureFilter
