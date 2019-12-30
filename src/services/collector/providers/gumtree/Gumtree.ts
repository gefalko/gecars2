/*
import cheerio from 'cheerio'
import { FilterModelI } from '~/dbStuff/models/filter/FilterModel'
import ProviderInterface from '~/appTypes/ProviderModel'
import { AdInterface } from '~/dbStuff/models/ad/AdInterface'
import { FilterInterface } from '~/dbStuff/models/filter/FilterInterface'
import { Ad } from '~/dbStuff/models/ad/AdModel'

export class Gumtree implements ProviderInterfacei {
  debug: boolean = false
  $ = null
  requestHtml: requestHtmlInterface

  constructor(requestHtml: requestHtmlInterface, debug?: boolean) {
    this.requestHtml = requestHtml
    this.debug = debug
  }

  public debugModeOn() {
    this.debug = true
    return this
  }

  consolelog(msg, obj?: object) {
    if (true) {
      console.log(msg)
      if (obj) {
        console.log(obj)
      }
    }
  }

  // @TODO move out to service
  private static priceFilter(ad: AdInterface, filter: FilterInterface) {
    console.log(
      'ad.price >= filter.priceFrom && ad.price <= filter.priceTo',
      `${ad.price} >= ${filter.priceFrom} && ${ad.price} <= ${filter.priceTo}`,
    )

    return ad.price >= filter.priceFrom && ad.price <= filter.priceTo
  }

  // @TODO move out to service
  private static yearsFilter(ad: AdInterface, filter: FilterInterface) {
    console.log(
      'ad.year >= filter.yearFrom && ad.year <= filter.yearTo',
      `${ad.year} >= ${filter.yearFrom} && ${ad.year} <= ${filter.yearTo}`,
    )
    return ad.year >= filter.yearFrom && ad.year <= filter.yearTo
  }

  // @TODO move out to service
  private static doFilter(ad: AdInterface, filter: FilterInterface) {
    const passPriceFilter = Gumtree.priceFilter(ad, filter)
    const passYearsFilter = Gumtree.yearsFilter(ad, filter)

    console.log('PASS price filter:', passPriceFilter)
    console.log('PASS years filter:', passYearsFilter)

    return passPriceFilter && passYearsFilter
  }

  public async getNewAds(filter: FilterModelI): Promise<AdInterface[]> {
    this.consolelog('filter', filter)

    // check or gumtree has this kind model
    if (filter.modelType.providersData.gumtree === null) {
      return []
    }

    const url = Gumtree.getUrl(filter)

    if (this.debug) {
      console.log('URL FOR FILTER: ')
      console.log(url)
    }

    const html: string = await this.requestHtml.getHtml(url)

    console.log('-------------------------HTML-----------------------------')
    console.log(html)
    console.log('-------------------------HTML-----------------------------')

    this.$ = cheerio.load(html)

    return await this.checkAds(filter)
  }

  private async checkAds(filter: FilterModelI): Promise<AdInterface[]> {
    const consolelog = this.consolelog

    this.consolelog('Start checkAds.')

    const urlAds: AdInterface[] = this.getUrlAds(filter)

    this.consolelog('Print formated but not filtered ads from html:', urlAds)

    const filtredAds: AdInterface[] = []

    for (let ad of urlAds) {
      if (await checkAd(ad)) {
        filtredAds.push(ad)
      }
    }

    const self = this

    async function checkAd(ad: AdInterface): Promise<boolean> {
      consolelog('Check or specifc add pass filter requarements:', ad)

      try {
        const dbAd = await Ad.findOne({ filter: ad.filter, providerAdId: ad.providerAdId }).exec()

        if (dbAd == null) {
          if (Gumtree.doFilter(ad, filter)) {
            //ads.push(ad); @TODO change true to this.debug
            if (true) {
              console.log('Gumtree:' + ` FOUND NEW ADD -> ${ad.url}`)
            }

            return true
          }
        }
      } catch (err) {
        console.log(err)
      }

      return false
    }

    return filtredAds
  }

  public getUrlAds(filter: FilterModelI): AdInterface[] {
    const extractElementAd = (i, elem) => {
      return this.extract(elem, filter)
    }

    const featuredAds: AdInterface[] = this.$('ul[data-q="featuredresults"] > li')
      .map(extractElementAd)
      .get()

    console.log('number of featuredAds:', featuredAds.length)

    const naturalAds: AdInterface[] = this.$('ul[data-q="naturalresults"] > li.natural')
      .map(extractElementAd)
      .get()

    console.log('number of naturalAds:', naturalAds.length)

    return [].concat(featuredAds, naturalAds)
  }

  private static parsePrice(element) {
    return element
      .text()
      .replace('¬£', '')
      .replace(',', '')
  }

  public extract(element, filter: FilterModelI): AdInterface {
    return {
      filter: filter._id,
      make: filter.make._id,
      modelType: filter.modelType._id,
      fuel: this.$(element)
        .find('[itemprop="fuelType"]')
        .text(),
      year: Number(
        this.$(element)
          .find('[itemprop="dateVehicleFirstRegistered"]')
          .text(),
      ),
      price: Number(Gumtree.parsePrice(this.$(element).find('.listing-price'))),
      providerAdId: this.$(element)
        .find('[data-q]')
        .attr('data-q'),
      url:
        'https://www.gumtree.com' +
        this.$(element)
          .find('[itemprop="url"]')
          .attr('href'),
      img: this.$(element)
        .find('noscript img')
        .attr('src'),
    }
  }

  public static getUrl(filter: FilterInterface): string {
    const data = filter.modelType.providersData.gumtree

    let modelType = ''
    let q = ''

    if (!data) {
      modelType = filter.modelType.name
    } else if (!data.q) {
      modelType = filter.modelType.providersData.gumtree
    } else {
      q = data.q
    }

    const modelTypeName = modelType
      .toLowerCase()
      .split(' ')
      .join('-')

    const { priceFrom, priceTo, make } = filter
    const host = 'https://www.gumtree.com/cars/uk/'

    return `${host}${make.make.toLowerCase()}/${modelTypeName}?max_price=${priceTo}&min_price=${priceFrom}`

    return `https://www.gumtree.com/search?search_category=cars&search_location=uk&vehicle_make=${filter.make.make.toLowerCase()}&vehicle_model=${modelType.toLowerCase()}&q=${q}&min_price=${
      filter.priceFrom
    }&max_price=${filter.priceTo}${Gumtree.getFuelForUrl(filter)}`
  }

  private static getFuelForUrl(filter: FilterInterface): string {
    return filter.fuel ? '&vehicle_fuel_type=' + filter.fuel : ''
  }
i}
*/
