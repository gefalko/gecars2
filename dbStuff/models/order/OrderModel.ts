import { Document, Schema, Model, model } from 'mongoose'
import { OrderInterface } from './OrderInterface'

export interface OrderModelI extends OrderInterface, Document {}

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  filters: [{ type: Schema.Types.ObjectId, ref: 'Filter' }],
  payed: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  status: { type: Number, default: 0 },
  createDate: { type: Date, default: Date.now },
  duration: { type: Number }, //duration in months
  start: { type: Date },
  end: { type: Date },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
})

export const Order: Model<OrderModelI> = model<OrderModelI>('Order', orderSchema)
