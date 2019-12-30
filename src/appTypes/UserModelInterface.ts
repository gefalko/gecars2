interface UserModelInterface {
  email: string
  orders: string[]
  createdOn: Date
  hash: string
  salt: string
}

export default UserModelInterface
