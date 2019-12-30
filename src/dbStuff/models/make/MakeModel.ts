import { Document, Schema, Model, model } from 'mongoose'
import MakeModelInteface from 'appTypes/MakeModelInterface'

export interface MakeModelI extends MakeModelInteface, Document {}

const makeSchema = new Schema({
  make: {
    type: String,
    required: true,
  },
  modelTypes: [{ type: Schema.Types.ObjectId, ref: 'ModelType' }],
})

export const Make: Model<MakeModelI> = model<MakeModelI>('Make', makeSchema)
