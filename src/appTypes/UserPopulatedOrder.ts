import OrderModelInterface from 'appTypes/OrderModelInterface'
import UserPopulatedOrderFilter from 'appTypes/UserPopulatedOrderFilter'

interface UserPopulatedOrder extends Omit<OrderModelInterface, 'user' | 'filters'> {
  user: { email: string }
  filters: UserPopulatedOrderFilter[]
}

export default UserPopulatedOrder
