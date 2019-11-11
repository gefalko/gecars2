import { Document, Schema, Model, model } from 'mongoose'
import { ProviderInterface } from './ProviderInterface'

export interface ProviderModelI extends ProviderInterface, Document {}

const providerSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String },
  webImage: { type: String },
  webName: { type: String },
})

export const Provider: Model<ProviderModelI> = model<ProviderModelI>('Provider', providerSchema)
