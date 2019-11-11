import { Document, Schema, Model, model } from 'mongoose'
import { UserInterface } from './UserInterface'

export interface UserModelI extends UserInterface, Document {
  setPassword(pass: string): void
  generateJwt(): string
}

const userSchema = new Schema({
  email: { type: String },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  createdOn: { type: Date },
  hash: { type: String },
  salt: { type: String },
})

export const User: Model<UserModelI> = model<UserModelI>('User', userSchema)
