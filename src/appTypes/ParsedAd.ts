interface ParsedAd {
  makeId: string
  makeName: string
  modelId: string
  modelName: string
  filterId: string
  providerAdId: string
  url: string
  img: string
  title: string
  price: number
  year: number | null
  fuel: string
  provider: string	
}

export default ParsedAd
