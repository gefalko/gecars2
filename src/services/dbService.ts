require('dbStuff/initDb')

import { Provider } from 'dbStuff/models/provider/ProviderModel'
import { Make, MakeModelI } from 'dbStuff/models/make/MakeModel'
import { ModelType, ModelTypeModelI } from 'dbStuff/models/modelType/ModelTypeModel'
import { Order } from 'dbStuff/models/order/OrderModel'
import { FuelType } from 'dbStuff/models/fuelType/FuelTypeModel'
import { Ad } from 'dbStuff/models/ad/AdModel'
import { User } from 'dbStuff/models/user/UserModel'
import { Filter, FilterModelI } from 'dbStuff/models/filter/FilterModel'
import ProviderModelInterface from 'appTypes/ProviderModelInterface'

export function saveUser(email: string, pass: string) {
  console.log('SAVE NEW USER', email)

  const user = new User()

  user.email = email

  user.setPassword(pass)

  return new Promise(function(resolve) {
    user.save(function(err) {
      const token = user.generateJwt()
      resolve(token)
    })
  })
}

export function findUser(email: string) {
  return new Promise(function(resolve) {
    User.findOne({ email: email }, function(err, user) {
      if (err) throw err
      resolve(user ? user : undefined)
    })
  })
}

export function findUsersPopulated() {
 return User.find({}).populate({
    path: 'orders',
    populate: [
      {
        path: 'filters',
        model: 'Filter',
        populate: [
          { path: 'providers' },
          { path: 'make', modelType: 'Make' },
          { path: 'modelType', modelType: 'modelType' },
        ],
      },
      { path: 'user', model: 'User' },
    ],
  })
}

export function getUsers() {
  return new Promise(function(resolve) {
    User.find({}, function(err, users) {
      if (err) throw err
      resolve(users)
    })
  })
}

export function findMake(make: string): Promise<MakeModelI> {
  return new Promise(function(resolve) {
    Make.findOne({ make: make }, function(err, make) {
      if (err) throw err
      resolve(make ? make : undefined)
    })
  })
}

export function findMakeId(make: string) {
  return new Promise(function(resolve) {
    findMake(make).then(function(make) {
      if (!make) resolve(make)
      resolve(make ? make._id : undefined)
    })
  })
}

export function findModelsByName(modelName: string) {
  return new Promise(function(resolve) {
    ModelType.find({ name: modelName }, function(err, models) {
      if (err) throw err
      else resolve(models)
    })
  })
}

export function findModel(makeId: string, modelType: string): Promise<ModelTypeModelI> {
  return new Promise(function(resolve) {
    ModelType.findOne({ name: modelType, make: makeId }, function(err, make) {
      if (err) throw err
      else resolve(make ? make : undefined)
    })
  })
}

export function findModelId(makeId: string, modelType: string) {
  return new Promise(function(resolve) {
    console.log('findModelId makeId:')
    console.log('makeId:', makeId)
    console.log('modelType:', modelType)

    findModel(makeId, modelType).then(function(modelType) {
      console.log('RES', modelType)

      if (!modelType) resolve(modelType)
      resolve(modelType._id)
    })
  })
}

// filters

export function findFilters(query: object): Promise<FilterModelI[]> {
  return new Promise(function(resolve) {
    Filter.find(query, function(err, filters) {
      if (err) throw err
      resolve(filters)
    })
  })
}

export async function updateFilter(filterId: string, newFilter: object) {
  const updatedFilter = await Filter.findOneAndUpdate({ _id: filterId }, newFilter, { upsert: true }).exec()

  return updatedFilter
}

export function getFilterById(id: string) {
  return new Promise(function(resolve) {
    Filter.findById(id, function(err, filter) {
      if (err) throw err
      resolve(filter ? filter : undefined)
    })
  })
}

export function getFilterByIdFull(id: string) {
  return new Promise(function(resolve) {
    Filter.findById(id)
      .populate([{ path: 'make' }, { path: 'modelType' }])
      .exec()
      .then(function(filter) {
        resolve(filter ? filter : undefined)
      })
  })
}

export function updateProvider(name: string, newProvider: ProviderModelInterface) {
  return new Promise(function(resolve) {
    Provider.findOneAndUpdate({ name: name }, newProvider, { upsert: true }, function(err, provider) {
      if (err) throw err
      resolve(provider ? provider : undefined)
    })
  })
}

export function updateFuelType(name: string, newFuelType: string) {
  return new Promise(function(resolve) {
    FuelType.findOneAndUpdate({ name: name }, newFuelType, { upsert: true }, function(err, fuelType) {
      if (err) throw err
      resolve(fuelType ? fuelType : undefined)
    })
  })
}

export function findProviderId(provider: string) {
  return new Promise(function(resolve) {
    Provider.findOne({ name: provider }, function(err, provider) {
      if (err) throw err
      resolve(provider ? provider._id : null)
    })
  })
}

export function getProviders() {
  return new Promise(function(resolve) {
    Provider.find({}, function(err, providers) {
      if (err) throw err
      resolve(providers)
    })
  })
}

export function getProvider(id: string) {
  return new Promise(function(resolve) {
    Provider.findById(id, function(err, provider) {
      if (err) throw err
      resolve(provider ? provider : undefined)
    })
  })
}

export function getFuelTypes() {
  return new Promise(function(resolve) {
    FuelType.find({}, function(err, fuelTypes) {
      if (err) throw err
      resolve(fuelTypes)
    })
  })
}

export function loadAllMakesFull() {
  return new Promise(function(resolve) {
    Make.find({})
      .populate([{ path: 'modelsTypes' }])
      .exec()
      .then(function(makes) {
        resolve(makes)
      })
  })
}

export async function createFilter(filter: object) {
  const dbFilter = await Filter.create(filter)

  return dbFilter
}

export function removeFilter(filterId: string) {
  return new Promise(function(resolve) {
    Filter.remove({ _id: filterId }, function(err) {
      if (!err) {
        resolve(true)
      }
    })
  })
}

export function findOrderById(orderId: string) {
  return new Promise(function(resolve) {
    Order.findById(orderId, function(err, order) {
      if (err) throw err
      resolve(order ? order : undefined)
    })
  })
}

export function findUserOrders(userId: string) {
  return new Promise(function(resolve) {
    Order.find({ user: userId })
      .populate([
        {
          path: 'filters',
          populate: [{ path: 'modelType' }, { path: 'make' }, { path: 'fuel2' }, { path: 'providers' }],
        },
      ])
      .exec()
      .then(function(orders) {
        resolve(orders)
      })
  })
}

export function createOrder(order: object) {
  return new Promise(function(resolve) {
    Order.create(order, function(err: object, order: object) {
      if (err) throw err
      resolve(order)
    })
  })
}

export function createMake(make: object) {
  return new Promise(function(resolve) {
    Make.create(make, function(err: object, make: object) {
      if (err) throw err
      resolve(make)
    })
  })
}

/* Ads */

export function isAdExist(filterId: string, providerAdId: string) {
  return new Promise(function(resolve) {
    Ad.findOne({ filter: filterId, providerAdId: providerAdId }, function(err, ad) {
      resolve(ad !== null)
    })
  })
}
