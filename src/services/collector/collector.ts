require('dbStuff/initDb')
import { Ad } from 'dbStuff/models/ad/AdModel'
import Provider from 'appTypes/Provider'
import ebayCollector from './providers/ebay/ebay'
import gumtreeCollector from './providers/gumtree/gumtree'
import ParsedAd from 'appTypes/ParsedAd'
import UserPopulatedOrderFilter from 'appTypes/UserPopulatedOrderFilter'
import UserPopulatedOrderFilterProvider from 'appTypes/UserPopulatedOrderFilterProvider'
import UserPopulatedOrder from 'appTypes/UserPopulatedOrder'
import { isAdExist } from 'services/dbService'

interface IArgs {
  filterSlice?: string
}

const args: IArgs = process.argv.slice(2).reduce((res, cur) => {
  const arg = cur.split('=')
  // @ts-ignore
  res[arg[0]] = arg[1]
  return res
}, {})

export async function collect(strategy: Provider, filter: UserPopulatedOrderFilter) {
  console.log('------------------------PROVIDER IS:' + strategy + '----------------------------------')

  try {
    switch (strategy) {
      case 'gumtree':
        return  gumtreeCollector(filter)
      case 'autotrader':
        // return addFilterIdAndProvider(await autotraderCollector.getFiltrededAds(filter))
        return []
      case 'ebay':
        return await ebayCollector(filter)
    }
  } catch (err) {
    console.log(err.stack)
    console.log(err)
  }

  return []
}

async function collectProviderByFilter(filter: UserPopulatedOrderFilter, provider: UserPopulatedOrderFilterProvider) {
  try {
    console.log(
      `${new Date().toLocaleString()}] Collect ${provider.name} of filter ${filter.make?.make} ${
        filter.modelType?.name
      }`,
    )

    const ads = (await collect(provider.name, filter)) as ParsedAd[]

    console.log('New ads of folter [' + ads.length + ']')

    console.log('=====================================================================================')

    return ads
  } catch (err) {
    console.log(`ERROR with filter ${filter._id} provider ${provider.name}`)
    console.log(err)
  }

  return []
}

async function filterNewAds(parsedAds: ParsedAd[]) {
  const newAds = []
  for (const parsedAd of parsedAds) {
    const exist = await isAdExist(parsedAd.filterId, parsedAd.providerAdId)
    if (!exist) {
      newAds.push(parsedAd)
    }
  }

  return newAds
}

export async function collectOrder(order: UserPopulatedOrder) {
  let parsedAds: ParsedAd[] = []
  const filtersForCollect = args.filterSlice ? order.filters.slice(0, parseInt(args.filterSlice)) : order.filters

  for (const filter of filtersForCollect) {
    if (filter.providers) {
      for (const provider of filter.providers) {
        const ads = await collectProviderByFilter(filter, provider)
        console.log('ADS COUNT FROM collectProviderByFilter:' + ads.length)
        parsedAds = [...parsedAds, ...ads]
      }
    }
  }

  console.log('TOTAL ADS COUNT ON collectOrder: ' + parsedAds.length)

  const newAds = await filterNewAds(parsedAds)
  
  console.log('TOTAL NEW ADS COUNT ON collectOrder: ' + newAds.length)

  const adsByAdinterface = newAds.map((ad) => ({
    filter: ad.filterId,
    make: ad.makeId,
    modelType: ad.modelId,
    title: ad.title,
    year: ad.year ?? undefined,
    price: ad.price,
    fuel: ad.fuel,
    providerAdId: ad.providerAdId,
    url: ad.url,
    img: ad.img,
    provider: ad.provider,
  }))

  await Ad.insertMany(adsByAdinterface)

  return newAds
}
