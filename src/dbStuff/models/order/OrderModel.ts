import { Document, Schema, Model, model } from 'mongoose'
import OrderModelInterface from 'appTypes/OrderModelInterface'

export interface OrderModelI extends OrderModelInterface, Document {}

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  filters: [{ type: Schema.Types.ObjectId, ref: 'Filter' }],
})

export const Order: Model<OrderModelI> = model<OrderModelI>('Order', orderSchema)
