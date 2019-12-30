import { Document, Schema, Model, model } from 'mongoose'
import { FuelTypeInterface } from './FuelTypeInterface'

export interface FuelTypeModelI extends FuelTypeInterface, Document {}

export let fuelTypeSchema: Schema = new Schema({
  name: { type: String, required: true },
  webName: { type: String },
})

export const FuelType: Model<FuelTypeModelI> = model<FuelTypeModelI>('FuelType', fuelTypeSchema)
