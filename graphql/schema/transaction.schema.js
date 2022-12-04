const addressSchema = `type Address {
  city: String
  country: String
  line1: String
  line2: String
  postal_code:String
  state:String
}`

const billingDetailsSchema = `type BillingDetails {
  email: String
  name: String
  phone: String
  address: Address
}`

const sourceSchema = `type TransactionSource {
  object: String
  brand: String
  country: String
  cvc_check: String
  exp_month: Int
  exp_year: Int
  fingerprint:String
  funding:String
  last4:String
  _id:String
}`

const transactionSchema = `type Transaction {
    _id: ID
    object: String
    amount: Int
    amount_captured: Int
    amount_refunded: Int
    balance_transaction: Int
    billing_details:BillingDetails
    captured:Boolean
    currency:String
    paid:Boolean
    payment_method:String
    receipt_url:String
    refunded:Boolean
    source:TransactionSource
    status:String
    orderId:ID
    userId:ID
    date:String
    createdAt:String
    updatedAt:String
  }`

const allTransactionsSchema = `type Transactions {
    totalSize: Int
    limit: Int
    page: Int
    data:[Transaction]
  }`


const paymentInput = `input PaymentInput {
  currency: String!
  cardNumber: String!
  amount: Int!
  expMonth: Int!
  expYear:Int!
  cvc:Int!
}`

const transactionRootQuery = `
    transactions(paginationInput: PaginationInput,allUsers:Boolean):Transactions
    transaction(id:ID!):Transaction!
`

const transactionRootMutation = `
    pay(paymentInput: PaymentInput!,orderId:ID!): String
`
const transactionSchemas =  `
${addressSchema}
${billingDetailsSchema}
${sourceSchema}
${transactionSchema}
${allTransactionsSchema}
${paymentInput}
`
module.exports = {
  transactionSchemas,
  transactionRootQuery,
  transactionRootMutation
}