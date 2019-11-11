import { Document, Schema, Model, model } from 'mongoose'
import { ModelTypeInterface } from './ModelTypeInterface'

export interface ModelTypeModelI extends ModelTypeInterface, Document {}

const modelTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  make: { type: Schema.Types.ObjectId, ref: 'Make' },
  providersData: {
    autotrader: String,
    ebay: String,
    gumtree: Schema.Types.Mixed,
  },
})

export const ModelType: Model<ModelTypeModelI> = model<ModelTypeModelI>('ModelType', modelTypeSchema)
