import { Document, Schema, Model, model } from 'mongoose'
import { AdInterface } from './AdInterface'

export interface AdModelI extends AdInterface, Document {}

const adSchema = new Schema({
  filter: { type: Schema.Types.ObjectId, ref: 'Filter', required: true },
  modelType: { type: Schema.Types.ObjectId, ref: 'ModelType', required: true },
  make: { type: Schema.Types.ObjectId, ref: 'Make', required: true },
  title: String,
  year: Number,
  price: Number,
  fuel: String,
  providerAdId: String,
  url: String,
  img: String,
})

export const Ad: Model<AdModelI> = model<AdModelI>('Ad', adSchema)
