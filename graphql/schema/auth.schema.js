
const loginSchema = `type Login {
    userId: ID!
    token: String!
    userType: String
    cartCount: Int
  }`

const loginInput = `input LoginInput {
    username: String!
    password: String!
  }`

const authRootMutation = `
    login(loginInput: LoginInput!): Login!
`
const authSchemas =  `
${loginSchema}
${loginInput}
`
module.exports = {
  authSchemas,
  authRootMutation
}