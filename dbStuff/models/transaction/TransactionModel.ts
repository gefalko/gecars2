import { Document, Schema, Model, model } from 'mongoose'
import { TransactionInterface } from './TransactionInterface'

export interface TransactionModelI extends TransactionInterface, Document {}

const transactionSchema = new Schema({
  data: { type: Schema.Types.Mixed },
})

export const Transaction: Model<TransactionModelI> = model<TransactionModelI>('Transaction', transactionSchema)
