import { Document, Schema, Model, model } from 'mongoose'
import UserModelInterface from 'appTypes/UserModelInterface'

export interface UserModelI extends UserModelInterface, Document {
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
