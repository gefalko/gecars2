import cheerio from 'cheerio'
import axios from 'axios'
import UserPopulatedOrderFilter from 'appTypes/UserPopulatedOrderFilter'
import ParsedAdWithoutFilterData from 'appTypes/ParsedAdWithoutFilterData'
import { toArray, findElement } from 'services/collector/utils'

async function getHtml(url: string) {
  const headers = {
    'cache-control': 'no-cache',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
  }

  const response = await axios.get(url, {
    headers,
  })

  return response.data
}

function formatUrl(filter: UserPopulatedOrderFilter) {
  const make = filter.make.make.toLowerCase()
  const model = (filter.modelType?.providersData?.gumtree ?? filter.modelType?.name)?.toLowerCase()
  const fuel = filter.fuel ? `/${filter.fuel}` : ''

  return `https://www.gumtree.com/cars/uk/${make}/${model}${fuel}?max_price=${filter.priceFrom}&min_price=${filter.priceTo}&sort=date`
}

function parseProviderAdId(adElement: Cheerio) {
  const adId = adElement.find('article').attr('data-q')

  console.log(adId)

  if (!adId) {
    throw 'can`t set gumtree providerAdId.'
  }

  return adId
}

function parseAdUrl(adElement: Cheerio) {
  const adUrl = adElement.find('a.listing-link').attr('href')

  if (!adUrl) {
    throw 'can`t set gumtree addUrl.'
  }

  return adUrl
}

function parseAdYear(adElement: Cheerio) {
  const elements = adElement.find('ul.listing-attributes li')
  const yearsElment = findElement(elements, ($) => {
    const type = $('.hide-visually').text()
    return type === 'Year'
  })

  if (!yearsElment) {
    throw 'can`t set gumtree year.'
  }

  const year = yearsElment('span:not(.hide-visually)').text()

  return parseInt(year)
}

function parseAdFuel(adElement: Cheerio) {
  console.log('parsign fuel')
  const elements = adElement.find('ul.listing-attributes li')

  const yearsElment = findElement(elements, ($) => {
    const type = $('.hide-visually').text()
    console.log(type)
    return type === 'Fuel type'
  })

  if (!yearsElment) {
    throw 'can`t set gumtree fuel.'
  }

  const fuel = yearsElment('span:not(.hide-visually)').text()

  return fuel.toLowerCase()
}

function parseAdImg(adElement: Cheerio) {
  const imgUrl = adElement.find('.listing-thumbnail img').attr('src')

  if (!imgUrl) {
    throw 'can`t set gumtree img.'
  }

  return imgUrl
}

function parseAdTitle(adElement: Cheerio) {
  const title = adElement.find('.listing-title').text()

  if (!title) {
    throw 'can`t set gumtree title.'
  }

  return title
}

function parseAdPrice(adElement: Cheerio) {
  const price = adElement.find('.listing-price strong').text()

  if (!price) {
    throw 'can`t set gumtree price.'
  }

  return parseInt(price.replace('£', '').replace(',', ''))
}

async function parseAdElement(adElement: Cheerio): Promise<ParsedAdWithoutFilterData | null> {
  return {
    providerAdId: parseProviderAdId(adElement),
    url: parseAdUrl(adElement),
    year: parseAdYear(adElement),
    fuel: parseAdFuel(adElement),
    img: parseAdImg(adElement),
    title: parseAdTitle(adElement),
    price: parseAdPrice(adElement),
  }
}

function parsePage(html: string) {
  const $ = cheerio.load(html)

  /*
   *  PROBLEM IS THAT GUMTREE BLOCKED AND ASK CAPTCHA
   *  POSIBLE SOLUTIONS:
   *  A) USE CORRECT REUQEST HEADER
   *  B) TRY PROXIES SERVICES
   *
   *  AFTER NEED TO CHECK OR HTML TILL IS PARSING CORRECTLY :)
   **/	
  console.log(html)	

  const adElementList = toArray($('ul.list-listing-mini li.natural'), $)	
  const parsedAdsPromises = adElementList.map(parseAdElement)

  return Promise.all(parsedAdsPromises)
}

async function collect(filter: UserPopulatedOrderFilter) {
  const url = formatUrl(filter)
  const html = await getHtml(url)
  const parsedAds = await parsePage(html)

  return parsedAds
}

export default collect
