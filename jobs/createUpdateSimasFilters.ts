// Update simas filters
import { pickBy } from 'lodash'
import filters from '~/appData/simasData/activeFilters' 
const ser = require('../services/data.service')
const ObjectId = require('mongoose').Types.ObjectId
import { User } from '~/dbStuff/models/user/UserModel'
import { Order } from 'dbStuff/models/order/OrderModel'
import { Make } from 'dbStuff/models/make/MakeModel'
import { FilterInterface } from 'dbStuff/models/filter/FilterInterface'
import { FilterModelI } from 'dbStuff/models/filter/FilterModel'

async function formatProviders(providers: string[]) {
  const ids = []
  for (const provider of providers) {
    const id = await ser.findProviderId(provider)

    if (!id) {
      throw new Error(`Provider ${provider} not exist in DB. Please insert provider.`)
    }

    ids.push(new ObjectId(id))
  }
  return ids
}

async function updateFilter(orderId: string, rFilter: FilterModelI, sFilter: FilterInterface) {
  console.log('FILTER FOR UPDATE', sFilter)

  //for update providers ->
  let uFilter = await ser.updateFilter(rFilter._id, { $set: { providers: sFilter.providers, order: sFilter.order } })
  //update other data
  uFilter = await ser.updateFilter(rFilter._id, sFilter)

  console.log('UPDATED FILTER', uFilter)

  console.log(`${sFilter.make}->${sFilter.modelType}  `)

  return uFilter
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

async function init() {
  let user = await ser.findUser('ge4cars@gmail.com')

  if (!user) {
    const order = new Order()
    await order.save()

    user = new User({
      email: 'ge4cars@gmail.com',
      orders: [order],
    })

    await user.save()
    user = await ser.findUser('ge4cars@gmail.com')
  }

  const orderId = user.orders[0]
  const order = await ser.findOrderById(orderId)
  order.filters = []

  console.log('UPDATE FILTERS FOR ORDER :' + orderId)
  console.log(order)

  try {
    for (const filter of filters) {
      console.log('Process filter:', filter)

      const makeId = await ser.findMakeId(capitalizeFirstLetter(filter.make))

      if (!makeId) {
        const make = new Make({ _id: makeId, make: capitalizeFirstLetter(filter.make) })
        await make.save()
        throw new Error('Make not exist: ' + filter.make)
      }

      const modelId = await ser.findModelId(makeId, capitalizeFirstLetter(filter.modelType))

      if (!modelId) throw new Error('modelId not exist: ' + filter.modelType)

      const tempFilter = {
        make: new ObjectId(makeId),
        modelType: new ObjectId(modelId),
        yearFrom: filter.yearFrom,
        yearTo: filter.yearTo,
        priceFrom: filter.priceFrom,
        priceTo: filter.priceTo,
	fuel: filter.fuel
      }

      const rFilters = await ser.findFilters(pickBy(tempFilter))

      const filterProviders = await formatProviders(filter.providers)

      const sFilter = {
        ...tempFilter,
	order: new ObjectId(orderId),
	providers: filterProviders
      }

      console.log('Prepared filter to db:')
      console.log(sFilter)
      console.log('EXISTING DB FILTERS:', rFilters)

      if (rFilters.length > 1) throw new Error('To many filters')

      if (rFilters.length == 0 && !filter.remove) {
        console.log('Creating new filter:', sFilter)
        const nFilter = await ser.createFilter(sFilter)
        order.filters.push(nFilter._id)
        console.log('Created new filter:', nFilter)
        console.log('Created!')
      } else {
        const rFilter = rFilters[0]

        if (filter.remove) {
          if (rFilter) await ser.removeFilter(rFilter._id)
          console.log('Removed!')
        } else {
          // const uFilter = await updateFilter(orderId, rFilter, sFilter, filter);
          // @ts-ignore
	  const uFilter = await updateFilter(orderId, rFilter, sFilter)
          order.filters.push(uFilter._id)
          console.log('Updated!')
        }
      }

      console.log(' --------------------------------------- ')
    }

    Order.update({ _id: order.id }, order, function(err, raw) {
      if (err) {
        throw err
      }
      console.log('UPDATE ORDER!', order)
      process.exit()
    })
  } catch (err) {
    console.log(err.message)
    console.log(err.stack)
  }
}

init()
