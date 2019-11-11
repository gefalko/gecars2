import { OrderInterface } from '../order/OrderInterface'

export interface UserInterface {
  email: string
  orders: OrderInterface[]
  createdOn: Date
  hash: string
  salt: string
}
