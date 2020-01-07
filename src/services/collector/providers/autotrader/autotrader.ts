/*
import { getHtml } from 'services/httpService'
import { parseAds, parsePagesNumber } from './autoTraderParser'
import capitalize from 'utils/capitalize'
import UserPopulatedOrderFilter from 'appTypes/UserPopulatedOrderFilter'

export function getFilterUrl(filter: UserPopulatedOrderFilter) {
  if (!filter) throw new Error('Filter is not defined')
  if (!filter.make || !filter.modelType) throw new Error('Incorrect filter object')

  const make = filter.make.make.toUpperCase()
  const model = filter?.modelType?.providersData?.autotrader
    ? filter.modelType.providersData.autotrader
    : filter.modelType?.name?.toUpperCase()
  const fuel = filter.fuel ? '&fuel-type=' + capitalize(filter.fuel) : ''
  const yearFrom = filter.yearFrom ? '&year-from=' + filter.yearFrom : ''
  const yearTo = filter.yearTo ? '&year-to=' + filter.yearTo : ''
  const priceFrom = filter.priceFrom ? '&price-from=' + filter.priceFrom : ''
  const priceTo = filter.priceTo ? '&price-to=' + filter.priceTo : ''

  return (
    'http://www.autotrader.co.uk/car-search?postcode=dn91jf&make=' +
    make +
    '&model=' +
    model +
    fuel +
    yearFrom +
    yearTo +
    priceFrom +
    priceTo
  )
}

function getPageUrls(url: string, totalPages: number) {
  const urls = []

  for (let i = 1; i < totalPages + 1; i++) {
    urls.push(url + '&page=' + i)
  }

  return urls
}

async function filter2ads(filter: UserPopulatedOrderFilter) {
  let url

  try {
    if (!filter) {
      throw new Error('Filter is not defined')
    }

    if (!getHtml) {
      throw new Error('HttpSer not have getHtml method')
    }

    url = getFilterUrl(filter)

    console.log('Filter url: ', url)

    let html = await getHtml(url)

    const totalPages = parsePagesNumber(html)

    console.log('Total pages: ', totalPages)

    let ads = parseAds(html)

    let filterAds = ads

    if (!totalPages) {
    } else {
      const urls = getPageUrls(url, totalPages)

      if (urls.length > 1) {
        for (let i = 1; i < urls.length; i++) {
          if (i > 10) break

          html = await getHtml(urls[i])

          ads = parseAds(html)

          filterAds = filterAds.concat(ads)
        }
      }
    }

    return filterAds
  } catch (err) {
    throw err
  }
}

export async function getFiltrededAds(filter: UserPopulatedOrderFilter) {
  const ads = await filter2ads(filter)

  return ads
}

/*
async function filterAdsNotInDB(ads: ParsedAd[]) {
  const filtredAds = []
  for (let ad of ads) {
    let exist = await orAdExist(ad)
    if (!exist) {
      filtredAds.push(ad)
    }
  }
  return filtredAds
}


export default {
  getFiltrededAds,
}
*/

export default undefined
