import { FilterInterface } from './FilterInterface'
import { Document, Schema, Model, model } from 'mongoose'

//interface FilterModel extends FilterInterface, mongoose.Document { };

export interface FilterModelI extends FilterInterface, Document {}

export let filterSchema: Schema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  make: { type: Schema.Types.ObjectId, ref: 'Make', required: true },
  modelType: { type: Schema.Types.ObjectId, ref: 'ModelType', required: true },
  providers: [{ type: Schema.Types.ObjectId, ref: 'Provider' }],
  priceFrom: { type: Number, required: true },
  priceTo: { type: Number, required: true },
  yearFrom: { type: Number, required: true },
  yearTo: { type: Number, required: true },
  fuel: String,
  //for new version of fuels
  status: { type: Number, default: 0 },
  fuel2: { type: Schema.Types.ObjectId, ref: 'Order' },
})

export const Filter: Model<FilterModelI> = model<FilterModelI>('Filter', filterSchema)
