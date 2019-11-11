require('dbStuff/initDb')

import { Provider } from 'dbStuff/models/provider/ProviderModel'
import { Make, MakeModelI } from 'dbStuff/models/make/MakeModel'
import { ModelType, ModelTypeModelI } from 'dbStuff/models/modelType/ModelTypeModel'
import { Order } from 'dbStuff/models/order/OrderModel'
import { FuelType } from 'dbStuff/models/fuelType/FuelTypeModel'
import { Transaction } from 'dbStuff/models/transaction/TransactionModel'
import { Ad } from 'dbStuff/models/ad/AdModel'
import { AdInterface } from 'dbStuff/models/ad/AdInterface'
import { User } from 'dbStuff/models/user/UserModel'
import { Filter } from 'dbStuff/models/filter/FilterModel'

module.exports = {
  findMake: findMake,
  findMakeId: findMakeId,
  findModelId: findModelId,
  findModel: findModel,
  findUser: findUser,
  getUsers: getUsers,

  findFilters: findFilters,
  updateFilter: updateFilter,
  getFilterById: getFilterById,
  getFilterByIdFull: getFilterByIdFull,
  removeFilter: removeFilter,
  createFilter: createFilter,

  loadAllMakesFull: loadAllMakesFull,
  findOrderById: findOrderById,
  findProviderId: findProviderId,
  getProviders: getProviders,
  getProvider: getProvider,
  getFuelTypes: getFuelTypes,
  updateProvider: updateProvider,
  updateFuelType: updateFuelType,
  createOrder: createOrder,
  createTransaction: createTransaction,
  createMake: createMake,
  findUserOrders: findUserOrders,
  findModelsByName: findModelsByName,
  saveUser: saveUser,

  /* Ads */

  orAdExist: orAdExist,
}

function saveUser(email: string, pass: string) {
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

function findUser(email: string) {
  return new Promise(function(resolve) {
    User.findOne({ email: email }, function(err, user) {
      if (err) throw err
      resolve(user ? user : undefined)
    })
  })
}

function getUsers() {
  return new Promise(function(resolve) {
    User.find({}, function(err, users) {
      if (err) throw err
      resolve(users)
    })
  })
}

function findMake(make: string): Promise<MakeModelI> {
  return new Promise(function(resolve) {
    Make.findOne({ make: make }, function(err, make) {
      if (err) throw err
      resolve(make ? make : undefined)
    })
  })
}

function findMakeId(make: string) {
  return new Promise(function(resolve) {
    findMake(make).then(function(make) {
      if (!make) resolve(make)
      resolve(make ? make._id : undefined)
    })
  })
}

function findModelsByName(modelName: string) {
  return new Promise(function(resolve) {
    ModelType.find({ name: modelName }, function(err, models) {
      if (err) throw err
      else resolve(models)
    })
  })
}

function findModel(makeId: string, modelType: string): Promise<ModelTypeModelI> {
  return new Promise(function(resolve) {
    ModelType.findOne({ name: modelType, make: makeId }, function(err, make) {
      if (err) throw err
      else resolve(make ? make : undefined)
    })
  })
}

function findModelId(makeId: string, modelType: string) {
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

function findFilters(query: object) {
  return new Promise(function(resolve) {
    Filter.find(query, function(err, filters) {
      if (err) throw err
      resolve(filters)
    })
  })
}

function updateFilter(filterId: string, newFilter: object) {
  return new Promise(function(resolve) {
    Filter.findOneAndUpdate({ _id: filterId }, newFilter, { upsert: true }, function(err, filter) {
      if (err) throw err
      resolve(filter ? filter : undefined)
    })
  })
}

function getFilterById(id: string) {
  return new Promise(function(resolve) {
    Filter.findById(id, function(err, filter) {
      if (err) throw err
      resolve(filter ? filter : undefined)
    })
  })
}

function getFilterByIdFull(id: string) {
  return new Promise(function(resolve) {
    Filter.findById(id)
      .populate([{ path: 'make' }, { path: 'modelType' }])
      .exec()
      .then(function(filter) {
        resolve(filter ? filter : undefined)
      })
  })
}

function updateProvider(name: string, newProvider: string) {
  return new Promise(function(resolve) {
    Provider.findOneAndUpdate({ name: name }, newProvider, { upsert: true }, function(err, provider) {
      if (err) throw err
      resolve(provider ? provider : undefined)
    })
  })
}

function updateFuelType(name: string, newFuelType: string) {
  return new Promise(function(resolve) {
    FuelType.findOneAndUpdate({ name: name }, newFuelType, { upsert: true }, function(err, fuelType) {
      if (err) throw err
      resolve(fuelType ? fuelType : undefined)
    })
  })
}

function findProviderId(provider: string) {
  return new Promise(function(resolve) {
    Provider.findOne({ name: provider }, function(err, provider) {
      if (err) throw err
      resolve(provider ? provider._id : null)
    })
  })
}

function getProviders() {
  return new Promise(function(resolve) {
    Provider.find({}, function(err, providers) {
      if (err) throw err
      resolve(providers)
    })
  })
}

function getProvider(id: string) {
  return new Promise(function(resolve) {
    Provider.findById(id, function(err, provider) {
      if (err) throw err
      resolve(provider ? provider : undefined)
    })
  })
}

function getFuelTypes() {
  return new Promise(function(resolve) {
    FuelType.find({}, function(err, fuelTypes) {
      if (err) throw err
      resolve(fuelTypes)
    })
  })
}

function loadAllMakesFull() {
  return new Promise(function(resolve) {
    Make.find({})
      .populate([{ path: 'modelsTypes' }])
      .exec()
      .then(function(makes) {
        resolve(makes)
      })
  })
}

function createFilter(filter: object) {
  return new Promise(function(resolve) {
    Filter.create(filter, function(err: object, filter: object) {
      if (err) {
        throw err
      }
      resolve(filter)
    })
  })
}

function removeFilter(filterId: string) {
  return new Promise(function(resolve) {
    Filter.remove({ _id: filterId }, function(err) {
      if (!err) {
        resolve(true)
      }
    })
  })
}

function findOrderById(orderId: string) {
  return new Promise(function(resolve) {
    Order.findById(orderId, function(err, order) {
      if (err) throw err
      resolve(order ? order : undefined)
    })
  })
}

function findUserOrders(userId: string) {
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

function createOrder(order: object) {
  return new Promise(function(resolve) {
    Order.create(order, function(err: object, order: object) {
      if (err) throw err
      resolve(order)
    })
  })
}

function createMake(make: object) {
  return new Promise(function(resolve) {
    Make.create(make, function(err: object, make: object) {
      if (err) throw err
      resolve(make)
    })
  })
}

function createTransaction(transaction: object) {
  return new Promise(function(resolve) {
    Transaction.create(Transaction, function(err: object, transaction: object) {
      if (err) throw err
      resolve(transaction)
    })
  })
}

/* Ads */

function orAdExist(ad: AdInterface) {
  return new Promise(function(resolve) {
    Ad.findOne({ filter: ad.filter, providerAdId: ad.providerAdId }, function(err, ad) {
      resolve(ad !== null)
    })
  })
}
