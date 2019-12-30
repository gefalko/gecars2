import cheerio from 'cheerio'
import axios from 'axios'
import { findIndex } from 'lodash'
import capitalize from 'utils/capitalize'
import { MakeModelI } from 'dbStuff/models/make/MakeModel'
import { ModelTypeModelI } from 'dbStuff/models/modelType/ModelTypeModel'
import ParsedAdWithoutFilterData from 'appTypes/ParsedAdWithoutFilterData'
import UserPopulatedOrderFilter from 'appTypes/UserPopulatedOrderFilter'

function formatFuelUrl(filter: UserPopulatedOrderFilter) {
  return '&Fuel=' + (filter.fuel ? capitalize(filter.fuel) : '')
}

function formatUrl(filter: UserPopulatedOrderFilter) {
  if (!filter.make) {
    throw new Error(`ERROR: filter.make is falsy`)
  }

  const urlFuel = formatFuelUrl(filter)
  const urlMake = capitalize(filter.make.make)?.replace(' ', '%2520')
  const urlModel = capitalize(filter.modelType?.providersData?.ebay ?? filter.modelType?.name)?.replace(' ', '%2520')

  if (!urlModel || urlModel == 'not-exist') {
    throw new Error(`ERROR: Module ${filter.modelType?.name} not exist in Ebay`)
  }

  const url = `https://www.ebay.co.uk/b/Cars/9801?${urlFuel}&Manufacturer=${urlMake}&Model=${urlModel}&rt=nc&_udlo=${filter.priceFrom}&_udhi=${filter.priceTo}&_sop=10`

  return url
}

async function getHtml(url: string) {
  const headers = {
    'cache-control': 'no-cache',
    Connection: 'keep-alive',
    Cookie:
      'nonsession=BAQAAAW4fHJjkAAaAADMABV+uyyYwMTIxMwDKACBhj/6mNmIxODYyNmExNmUwYWE2NGVmYjZmZDRiZmZmMzAzNTcAywABXc2erjGtSmy/eowsFT5+g5smzf1KAfWfXQ**; s=CgAD4ACBdzukmNmIxODYyNmExNmUwYWE2NGVmYjZmZDRiZmZmMzAzNTeiEKFm; dp1=bbl/LT618ffea6^; ebay=%5Esbf%3D%23000000%5E; ak_bmsc=D82BFC938F757869BD8746B74034A13E5F649B8C5E3D0000A697CD5D43989B2C~pl+I4XetOCRB+7tTcySxII8cZqVUrNMhp5vW/3qWXRJCNhEiriHH+cJtvgU5QexV1bjEK5d0ZXOCg22cZf1NheXaBZu2TQfl2S2o0Ik7JXpNiGRM6RLpSogLgCJCPkMmkL7JlT1g7vGyOUUw19M9TYnHL7g7bAtUiTEmDP7gj03048B9/Ts3MFj1Biau7b6CBZ4YoSV/0nthKA/zsI+eCXiF9+vGQS+19iPqsGsZvlJrA=',
    'Accept-Encoding': 'gzip, deflate',
    Host: 'www.ebay.co.uk',
    'Postman-Token': 'cff6c64c-8ccd-423d-acef-3e506beb9c06,7d92d596-980e-484f-8435-bae7ec6272a2',
    'Cache-Control': 'no-cache',
    Accept: '*/*',
    'User-Agent': 'PostmanRuntime/7.19.0',
  }

  const response = await axios.get(url, {
    headers,
  })

  return response.data
}

function toArray(elements: Cheerio, $: CheerioStatic) {
  let array: Cheerio[] = []
  elements.each(function(i, elem) {
    array.push($(elem))
  })
  return array
}

function parseUrl(adElement: Cheerio) {
  const url = adElement.find('a.s-item__link').attr('href')

  return url
}

function parseProviderAdId(adElement: Cheerio) {
  const url = adElement.find('a.s-item__link').attr('href')
  const searchParams = new URLSearchParams(url?.split('?')[1])
  const adId = searchParams.get('hash')

  if (!adId) {
    throw 'can`t set ebay providerAdId.'
  }

  return adId
}

function parseImg(adElement: Cheerio) {
  const imgElement = adElement.find('.s-item__image-wrapper img.s-item__image-img')
  const imgUrl = imgElement.attr('data-src') || imgElement.attr('src')

  return imgUrl!
}

function parseTitle(adElement: Cheerio) {
  const title = adElement.find('.s-item__title').text()

  return title
}

function parsePrice(adElement: Cheerio) {
  const priceString = adElement.find('.s-item__price').text()
  const price = priceString
    .replace('.', '')
    .replace(',', '')
    .replace('£', '')

  return parseInt(price) / 100
}

async function parseYearFuel(url: string) {
  const html = await getHtml(url)
  const $ = cheerio.load(html)
  const tableItemsList = toArray($('.itemAttr table td'), $)

  const yearItemIndex = findIndex(tableItemsList, (item) => {
    return (
      item
        .text()
        .toLowerCase()
        .search('year') > -1
    )
  })

  const fuelItemIndex = findIndex(tableItemsList, (item) => {
    return (
      item
        .text()
        .toLowerCase()
        .search('fuel') > -1
    )
  })
  const parsedYear = parseInt(tableItemsList[yearItemIndex + 1].text())
  return {
    year: parsedYear === NaN ? null : parsedYear,
    fuel: tableItemsList[fuelItemIndex + 1]
      .text()
      .trim()
      .toLowerCase(),
  }
}

async function parseAdElement(adElement: Cheerio): Promise<ParsedAdWithoutFilterData> {
  const url = parseUrl(adElement)

  if(!url) {
    throw new Error('url is undefined')
  }

  const { year, fuel } = await parseYearFuel(url)

  return {
    providerAdId: parseProviderAdId(adElement),
    url,
    year,
    fuel,
    img: parseImg(adElement),
    title: parseTitle(adElement),
    price: parsePrice(adElement),
  }
}

function parsePage(html: string) {
  const $ = cheerio.load(html)
  const adElementList = toArray($('.b-list__items_nofooter li'), $)
  const parsedAdsPromises = adElementList.map(parseAdElement)

  return Promise.all(parsedAdsPromises)
}

function createFilter(filter: UserPopulatedOrderFilter) {
  return (parsedAd: ParsedAdWithoutFilterData) => {
    if (!parsedAd.price || !parsedAd.year) {
      return false
    }

    if (filter.priceTo && parsedAd.price > filter.priceTo) {
      return false
    }

    if (filter.priceFrom && parsedAd.price < filter.priceFrom) {
      return false
    }

    if (filter.yearTo && parsedAd.year > filter.yearTo) {
      return false
    }

    if (filter.yearFrom && parsedAd.year < filter.yearFrom) {
      return false
    }

    if (filter.fuel && filter.fuel?.toLowerCase() !== parsedAd.fuel.toLowerCase()) {
      return false
    }

    return true
  }
}

async function collect(filter: UserPopulatedOrderFilter) {
  const url = formatUrl(filter)

  console.log('PARSING: ' + url)
  console.log('FILTER: ' + filter._id)

  const html = await getHtml(url)
  const parsedAds = await parsePage(html)

  const adFilter = createFilter(filter)
  const filteredAds = parsedAds.filter(adFilter)

  const make = filter.make as MakeModelI
  const modelType = filter.modelType as ModelTypeModelI

  return filteredAds.map((ad) => ({
    makeId: make._id,
    makeName: make.make,
    modelId: modelType._id,
    modelName: modelType.name,
    filterId: filter._id,
    provider: 'ebay',
    ...ad,
  }))
}

export default collect
