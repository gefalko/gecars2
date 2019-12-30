import { Document, Schema, Model, model } from 'mongoose'
import ModelTypeModelInterface from 'appTypes/ModelTypeModelInterface'

export interface ModelTypeModelI extends ModelTypeModelInterface, Document {}

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
