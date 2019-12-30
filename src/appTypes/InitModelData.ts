interface InitModelData {
  name: string
  providersData?: {
    gumtree?: string | { q: string }
    ebay?: string
    autotrader?: string	  
  }
}

export default InitModelData
