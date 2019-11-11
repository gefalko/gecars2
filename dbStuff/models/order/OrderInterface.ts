import { FilterInterface } from '../filter/FilterInterface'
import { UserInterface } from '../user/UserInterface'
import { TransactionInterface } from '../transaction/TransactionInterface'

export interface OrderInterface {
  user: UserInterface
  filters: FilterInterface[]
  payed: boolean
  active: boolean
  status: number
  createDate: Date
  duration: number
  start: Date
  end: Date
  transactions: TransactionInterface[]
}
