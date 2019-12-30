interface FilterModelInterface {
  _id: string	
  order: string
  make: string
  modelType: string
  providers: string[]
  priceFrom?: number
  priceTo?: number
  yearFrom?: number
  yearTo?: number
  fuel?: string
  fuel2?: string
  status?: number
}

export default FilterModelInterface
