import UserModelInterface from 'appTypes/UserModelInterface'
import UserPopulatedOrder from 'appTypes/UserPopulatedOrder'

interface UserPopulated extends Omit<UserModelInterface, 'orders'> {
  orders: UserPopulatedOrder[]
}

export default UserPopulated
