import cheerio from 'cheerio'
import ParsedAd from 'appTypes/ParsedAd'
import ParsedAdWithoutFilterData from 'appTypes/ParsedAdWithoutFilterData'

export function parseAds(html: string) {
  const $ = cheerio.load(html)

  const body = checkHtmlStructureAndReturnBody($)

  const adsElements = getAdsElements(body)

  const ads: ParsedAd[] = []

  adsElements.each(function() {
    // @ts-ignore
    let ad = parseAd($(this))
    // @ts-ignore
    ads.push(ad)
  })

  return ads
}

function parseAd(adLiElement: Cheerio): ParsedAdWithoutFilterData {
  const { year, fuel } = parseYearsAndFuelType(adLiElement)

  return {
    providerAdId: parseProviderId(adLiElement),
    url: parseUrl(adLiElement),
    img: parseImg(adLiElement),
    title: parseTitle(adLiElement),
    price: parsePrice(adLiElement),
    year: year,
    fuel: fuel,
  }
}

function getAdsElements(body: Cheerio) {
  const adsElements = body.find('ul.search-page__results li.search-page__result')

  return adsElements
}

/* private. Input is root cheerio object. */
function checkHtmlStructureAndReturnBody($: CheerioStatic) {
  const body = $('body')

  if (!body.length) {
    throw new Error('Not correct html structure')
  }

  const content = $('#main-content')

  if (!content.length) {
    throw new Error('Not found #main-content element')
  }

  return body
}

function parseTitle(adLiElement: Cheerio) {
  if (!adLiElement) {
    throw new Error('adLiElement is not defined')
  }

  // check or element exist for extract title
  const title = adLiElement.find('h2.listing-title a.listing-fpa-link')

  if (!title.length) {
    throw new Error('Not found "h2.listing-title a.listing-fpa-link" element for set ad title.')
  }

  return title.text()
}

function parseImg(adLiElement: Cheerio) {
  if (!adLiElement) {
    throw new Error('adLiElement is not defined')
  }

  // check or element exist for extract image
  const img = adLiElement.find('figure.listing-main-image img')

  if (!img.length) {
    throw new Error('Not found figure.listing-main-image img element for set ad img.')
  }

  return img.attr('src')!
}

function parseUrl(adLiElement: Cheerio) {
  if (!adLiElement) {
    throw new Error('adLiElement is not defined')
  }

  const url = adLiElement.find('a.listing-fpa-link')

  if (!url.length) {
    throw new Error('adLiElement not have a.listing-fpa-link element while try parse ad url')
  }

  return 'http://www.autotrader.co.uk' + url.attr('href')
}

function parseProviderId(adLiElement: Cheerio) {
  if (!adLiElement) {
    throw new Error('adLiElement is not defined')
  }

  const id = adLiElement.attr('id')

  if (!id) {
    throw new Error('adLiElement id attr not defined')
  }

  return id
}

function parsePrice(adLiElement: Cheerio) {
  let price = adLiElement.find('section.price-column div.vehicle-price')

  if (!price.length) {
    throw new Error('Not found div.vehicle-price in section.price-column element for set ad price.')
  }

  return formatPrice(price.text())
}

function formatPrice(priceStr: string) {
  let price = priceStr.replace('¬£', '').replace(',', '')

  return parseFloat(price)
}

function parseYearsAndFuelType(adLiElement: Cheerio) {
  // from info object extracting years and fuels info
  const info = adLiElement.find('ul.listing-key-specs')

  if (!info.length) {
    throw new Error('Not found ul.listing-key-specs element for extract years and fuels info')
  }

  const first = info.find('li:first-child')
  let year

  if (first.find('.writeOffCat').length) {
    year = info.find('li:nth-child(2)')
  } else {
    year = first
  }

  const res = {
    year: formatYears(year.text()),
    fuel: info.find('li:last-child').text(),
  }

  return res
}

function formatYears(years: string) {
  return parseInt(years)
}

export function parsePagesNumber(html: string) {
  if (!html) {
    throw new Error('Html is not defined')
  }

  const $ = cheerio.load(html)

  const body = checkHtmlStructureAndReturnBody($)

  const element = body.find('.pagination .pagination--li')

  if (!element.length) {
    throw new Error('".pagination .pagination--li" elements not found on parsing pages number')
  }

  return element.length - 2
}
