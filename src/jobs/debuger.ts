import ParsedAd from 'appTypes/ParsedAd'
import ebayCollector from 'services/collector/providers/ebay/ebay'
import autoTraderCollector from 'services/collector/providers/autotrader/autotrader'
import UserPopulatedOrderFilter from 'appTypes/UserPopulatedOrderFilter'

interface IArgs {
  providerForTest?: string
  filterId?: string
  printAds?: string
  printFilter?: string
  priceTo?: string
  yearFrom?: string
  yearTo?: string
  make?: string
  model?: string
  priceFrom?: string
  fuel?: string
}

const args: IArgs = process.argv.slice(2).reduce((res, cur) => {
  const arg = cur.split('=')
  // @ts-ignore
  res[arg[0]] = arg[1]
  return res
}, {})

async function testAll(filter: UserPopulatedOrderFilter) {
  await testEbay(filter)
  // await testGumtree(filter)
  await testAutotrader(filter)

  return true
}

function resPrinter(ads: ParsedAd[]) {
  console.log('----------------- From test file ----------------------------')
  console.log('Total new ads:', ads.length)
  for (let ad of ads) {
    console.log('Found new add -> ' + ad.url)
    console.log(ad)
  }
}

async function testEbay(filter: UserPopulatedOrderFilter) {
  try {
    console.log('=============================================================')
    console.log(`Testing ${filter.make?.make} ${filter.modelType?.name}`)
    console.log('=============================================================')
    console.log(`ebay `)
    console.log('-------------------------------------------------------------')
    resPrinter((await ebayCollector(filter)) as ParsedAd[])
    console.log('-------------------------------------------------------------')
  } catch (err) {
    console.log('Err on ebay')
    console.log(err)
  }
}

async function testAutotrader(filter: UserPopulatedOrderFilter) {
  try {
    console.log('-------------------------------------------------------------')
    console.log(`autotrader `)
    console.log('-------------------------------------------------------------')
    let ads = await autoTraderCollector.getFiltrededAds(filter)
    resPrinter(ads)
    console.log('-------------------------------------------------------------')
  } catch (err) {
    console.log('Autotrader err in testing')
    console.log(err)
  }
}

/*
async function testGumtree(filter: FilterInterface) {
  try {
    console.log('-------------------------------------------------------------')
    console.log(`gumtree `)
    console.log('-------------------------------------------------------------')
    const ads = await new Gumtree(new httpRequest()).debugModeOn().getNewAds(filter)
    resPrinter(ads)
    console.log('-------------------------------------------------------------')
  } catch (err) {
    console.log('Err on gumtree')
    console.log(err)
  }

  return true
}
*/

function test(provider: string, filter: UserPopulatedOrderFilter) {
  switch (provider) {
    case 'autotrader':
      testAutotrader(filter)
      break
    /*
    case 'gumtree':
      testGumtree(filter)
      break
      */
    case 'ebay':
      testEbay(filter)
      break
    default:
      testAll(filter)
  }
}

console.log('command args:', args)

function start() {
  if (!args.providerForTest) {
    throw 'providerForTest is undefined'
  }

  if (!args.make) {
    throw 'make is undefined'
  }

  if (!args.model) {
    throw 'model is undefined'
  }

  if (!args.priceFrom) {
    throw 'priceFrom is undefined'
  }

  if (!args.priceTo) {
    throw 'priceTo is undefined'
  }

  test(args.providerForTest, {
    _id: 'filterid',
    order: 'orderid',
    make: {
      make: args.make,
      modelTypes: [],
    },
    providers: [],
    modelType: { name: args.model },
    priceFrom: parseInt(args.priceFrom),
    priceTo: parseInt(args.priceTo),
    yearFrom: args.yearFrom ? parseInt(args.yearFrom) : undefined,
    yearTo: args.yearTo ? parseInt(args.yearTo) : undefined,
    fuel: args.fuel?.toLowerCase(),
  })
}

start()
