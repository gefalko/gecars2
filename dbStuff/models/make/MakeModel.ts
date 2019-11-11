import { Document, Schema, Model, model } from 'mongoose'
import { MakeInterface } from './MakeInterface'

export interface MakeModelI extends MakeInterface, Document {}

const makeSchema = new Schema({
  make: {
    type: String,
    required: true,
  },
  modelTypes: [{ type: Schema.Types.ObjectId, ref: 'ModelType' }],
})

export const Make: Model<MakeModelI> = model<MakeModelI>('Make', makeSchema)
