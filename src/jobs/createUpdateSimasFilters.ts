// Update simas filters
import 'source-map-support/register'
import { pickBy } from 'lodash'
import filters from 'appData/simasData/activeFilters'
import {
  findProviderId,
  updateFilter as dbUpdateFilter,
  findUser,
  findOrderById,
  findMakeId,
  findModelId,
  findFilters,
  removeFilter,
  createFilter,
} from 'services/dbService'
import FilterModelInterface from 'appTypes/FilterModelInterface'
import { FilterModelI } from 'dbStuff/models/filter/FilterModel'
import { User, UserModelI } from 'dbStuff/models/user/UserModel'
import { Order, OrderModelI } from 'dbStuff/models/order/OrderModel'
import { Make } from 'dbStuff/models/make/MakeModel'

const ObjectId = require('mongoose').Types.ObjectId

async function formatProviders(providers: string[]) {
  const ids = []
  for (const provider of providers) {
    const id = await findProviderId(provider)

    if (!id) {
      throw new Error(`Provider ${provider} not exist in DB. Please insert provider.`)
    }

    ids.push(new ObjectId(id))
  }
  return ids
}

async function updateFilter(orderId: string, rFilter: FilterModelI, sFilter: Omit<FilterModelInterface, '_id'>) {
  console.log('FILTER FOR UPDATE', sFilter)
  //for update providers ->
  let uFilter = await dbUpdateFilter(rFilter._id, { $set: { providers: sFilter.providers, order: sFilter.order } })
  //update other data
  uFilter = await dbUpdateFilter(rFilter._id, sFilter)

  console.log('UPDATED FILTER', uFilter)

  console.log(`${sFilter.make}->${sFilter.modelType}  `)

  return uFilter
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

async function init() {
  let user = await findUser('ge4cars@gmail.com')

  if (!user) {
    const order = new Order()
    await order.save()

    user = new User({
      email: 'ge4cars@gmail.com',
      orders: [order],
    }) as UserModelI

    await (user as UserModelI).save()
    user = await findUser('ge4cars@gmail.com')
  }

  console.log('user---->')
  console.log(user)

  const orderId = (user as UserModelI).orders[0] as string
  const order = (await findOrderById(orderId)) as OrderModelI
  order.filters = []

  console.log('UPDATE FILTERS FOR ORDER :' + orderId)
  console.log(order)

  try {
    for (const filter of filters) {
      console.log('Process filter:', filter)

      const makeId = (await findMakeId(capitalizeFirstLetter(filter.make))) as string

      console.log('---------- makeID ---------')
      console.log(makeId)

      if (!makeId) {
        const make = new Make({ _id: makeId, make: capitalizeFirstLetter(filter.make) })
        await make.save()
        throw new Error('Make not exist: ' + filter.make)
      }

      const modelId = await findModelId(makeId, capitalizeFirstLetter(filter.modelType))

      console.log('---------- modelID ---------')
      console.log(modelId)

      if (!modelId) throw new Error('modelId not exist of modelType: ' + filter.modelType)

      const tempFilter = {
        make: new ObjectId(makeId),
        modelType: new ObjectId(modelId),
        yearFrom: filter.yearFrom,
        yearTo: filter.yearTo,
        priceFrom: filter.priceFrom,
        priceTo: filter.priceTo,
        fuel: filter.fuel,
      }

      const rFilters = (await findFilters(pickBy(tempFilter))) as FilterModelI[]

      const filterProviders = await formatProviders(filter.providers)

      const sFilter = {
        ...tempFilter,
        order: new ObjectId(orderId),
        providers: filterProviders,
      }

      console.log('Prepared filter to db:')
      console.log(sFilter)
      console.log('EXISTING DB FILTERS:', rFilters)

      if (rFilters.length > 1) throw new Error('To many filters')

      if ((rFilters as FilterModelI[]).length == 0 && !filter.remove) {
        console.log('Creating new filter:', sFilter)
        const nFilter = await createFilter(sFilter)
        if (nFilter._id) {
          order.filters.push(nFilter._id)
        }
        console.log('Created new filter:', nFilter)
        console.log('Created!')
      } else {
        const rFilter = (rFilters as FilterModelI[])[0]

        if (filter.remove && rFilter._id) {
          if (rFilter) await removeFilter(rFilter._id)
          console.log('Removed!')
        } else {
          // const uFilter = await updateFilter(orderId, rFilter, sFilter, filter);
          const uFilter = await updateFilter(orderId, rFilter, sFilter)

          if (uFilter) {
            order.filters.push(uFilter._id)
          }

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
