const { buildSchema } = require('graphql');
const {itemSchemas , itemRootQuery, itemRootMutation} = require('./item.schema')
const {authSchemas , authRootMutation} = require('./auth.schema')
const {userSchemas , userRootQuery,userRootMutation} = require('./user.schema')
const {transactionSchemas, transactionRootQuery, transactionRootMutation} = require('./transaction.schema')
const {orderSchemas, orderRootQuery, orderRootMutation} = require('./order.schema');
const orderResolver = require('../resolvers/order.resolver');

const paginationInput = `input PaginationInput {
    limit: Int
    page: Int
  }`

const rootQuery = `type RootQuery {
    ${userRootQuery}
    ${itemRootQuery}
    ${transactionRootQuery}
    ${orderRootQuery}
}`

const rootMutation = `type RootMutation {
    ${authRootMutation}
    ${itemRootMutation}
    ${userRootMutation}
    ${transactionRootMutation}
    ${orderRootMutation}
}`

module.exports = buildSchema(`

${authSchemas}
${itemSchemas}
${userSchemas}
${transactionSchemas}
${orderSchemas}
${paginationInput}
${rootQuery}
${rootMutation}
schema {
  query: RootQuery
  mutation: RootMutation
}
`)