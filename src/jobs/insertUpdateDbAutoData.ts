import { Make, MakeModelI } from 'dbStuff/models/make/MakeModel'
import { ModelType, ModelTypeModelI } from 'dbStuff/models/modelType/ModelTypeModel'
import makes from 'appData/makeModels'
import InitModelData from 'appTypes/InitModelData'
import { createMake } from 'services/dbService'

interface IArgs {
  debug?: string
}

const args: IArgs = process.argv.slice(2).reduce((res, cur) => {
  const arg = cur.split('=')
  // @ts-ignore
  res[arg[0]] = arg[1]
  return res
}, {})

const { debug } = args

function findMake(make: string): Promise<MakeModelI> {
  return new Promise(function(resolve) {
    Make.findOne({ make: make }, function(err, make) {
      resolve(make || undefined)
    })
  })
}

/*
function findModel(makeId: string, model: string) {
  return new Promise(function(resolve) {
    ModelType.findOne({ name: model, make: makeId }, function(err, model) {
      resolve(model)
    })
  })
}
*/

function updateModel(makeId: string, modelName: string, newModel: InitModelData): Promise<ModelTypeModelI> {
  return new Promise(function(resolve) {
    ModelType.findOneAndUpdate({ name: modelName, make: makeId }, newModel, { upsert: true }, function(err, model) {
      if (model == null) {
        // create new

        ModelType.create({
          make: makeId,
          name: modelName,
          providersData: newModel.providersData,
        }).then(function(model) {
          resolve(model)
        })
      }
      resolve(model || undefined)
    })
  })
}

interface ModelType {
  name: string
}

interface Make {
  make: string
  modelTypes: ModelType[]
}

const consolelog = (msg: string, obj?: object | unknown) => {
  if (debug) {
    console.log(msg)
    if (obj) {
      console.log(obj)
    }
  }
}

async function init() {
  for (let _make of makes) {
    console.log('process make ' + _make.make + ' ')

    let make = (await findMake(_make.make)) as MakeModelI

    let saveMake = false

    if (!make) {
      make = (await createMake({ make: _make.make })) as MakeModelI
    } else {
      for (let _model of _make.modelTypes) {
        let model = await updateModel(make._id, _model.name, _model)

        if (!model) {
          consolelog('PROBLEM WITH MODULE')
        } else {
          // if model id not exist in make.models add
          // @ts-ignore
          if (make.modelTypes && make.modelTypes.indexOf(model._id == -1)) {
            make.modelTypes.push(model._id)
            saveMake = true
          }
        }
      }
    }

    if (saveMake) make.save()

    consolelog('------------------------------------------')
  }

  console.log('finish')
  process.exit()
}

try {
  init()
} catch (err) {
  console.log(err)
}
