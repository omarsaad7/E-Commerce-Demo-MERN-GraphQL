
const itemSchema = `type Item {
    _id: ID!
    name: String!
    description: String
    img: String
    quantity: Int!
    price: Int!
    createdAt:String
    updatedAt:String
  }`

const allItemsSchema = `type Items {
    totalSize: Int!
    limit: Int!
    page: Int!
    data:[Item!]!
  }`
const itemInput = `input ItemInput {
    name: String!
    description: String
    img: String
    quantity: Int!
    price: Int!
  }`

const itemUpdateInput = `input ItemUpdateInput {
  id:ID!
  name: String
  description: String
  img: String
  quantity: Int
  price: Int
}`

const itemRootQuery = `
    items(paginationInput: PaginationInput):Items!
    item(id:ID!):Item!
`

const itemRootMutation = `
    createItem(itemInput: ItemInput!): Item
    updateItem(itemInput: ItemUpdateInput!): String
    deleteItem(id: ID!): String
`
const itemSchemas =  `
${itemSchema}
${itemInput}
${itemUpdateInput}
${allItemsSchema}
`
module.exports = {
  itemSchemas,
  itemRootQuery,
  itemRootMutation
}