
  const userCreationSchema = `type CreateUser {
      name: String
      token: String
      userId: ID
    }`

  const createCustomerInput = `input CreateCustomerInput {
      username: String!
      password: String!
    }`

  const cartItemInput = `input CartItemInput {
    item: String!
    count: Int!
  }`

  const updateCustomerInput = `input UpdateCustomerInput {
    username: String
    password: String
  }`

  const cartItem = `type CartItem{
    item: Item
    count: Int
  }`

  const userSchema = `type User {
    _id: ID
    type: String
    cart:[CartItem]
    username:String
    password:String
    createdAt:String
    updatedAt:String
  }`

  const allUsersSchema = `type Users {
    totalSize: Int
    limit: Int
    page: Int
    data:[User]
  }`

  const userRootQuery = `
  customers(paginationInput: PaginationInput):Users
  user(id:ID!):User!
`

 
const userRootMutation = `
    createCustomer(createCustomerInput: CreateCustomerInput!): CreateUser
    updateProfile(updateCustomerInput: UpdateCustomerInput!):String
    deleteUser(id: ID!):String
    addItemToCart(addItemInput:CartItemInput):String
    removeItemFromCart(itemId:ID!):String
`
const userSchemas =  `
${userCreationSchema}
${createCustomerInput}
${userSchema}
${cartItem}
${allUsersSchema}
${updateCustomerInput}
${cartItemInput}
`
module.exports = {
  userSchemas,
  userRootQuery,
  userRootMutation
}