export default { 
    getAllItems:`query getItems($limit: Int!, $page: Int!){
        items(paginationInput:{limit:$limit,page:$page}){
            totalSize
            data{
            name
            description
            _id
            img
            price
            }
        }
        }`,
    addItemToCart:`mutation addItemToCart($count: Int!, $item: String!){
        addItemToCart(addItemInput:{
            count:$count
            item:$item
        })
        }`,
    removeItemFromCart:`mutation removeItemFromCart($itemId:ID!){
        removeItemFromCart(itemId:$itemId)
      }`,
    signUp:`mutation signup($username: String!, $password: String!){
        createCustomer(createCustomerInput:{
          username: $username
          password: $password
        }){
          token
          userId
          name
        }
      }`,
    signIn:`mutation logIn($username: String!, $password: String!){
        login(loginInput:{
          username: $username
          password:$password
        }){
          token
          userId
        }
      }`,
    userOrders:`query orders($limit: Int!, $page: Int!,$status: String){
        orders(paginationInput:{limit:$limit,page:$page},status: $status){
          totalSize
          data{
              _id
              status
              createdAt
              totalPrice
              receiptUrl
              failureReason
              items{
                count
                  item{
                    name
                    description
                    _id
                    img
                    price
                  }
              }
          }
        }
      }`,
    getOrder:`query order($id: ID!){
        order(id:$id){
              _id
              status
              createdAt
              totalPrice
              receiptUrl
              failureReason
              items{
                  count
                  item{
                    name
                    description
                    _id
                    img
                    price
                  }
          }
        }
      }`,
    processToPayment:`mutation processToPayment($orderId: ID!){
        processToPaymentOrder(orderId:$orderId)
      }`,
    deleteOrder:`mutation deleteOrder($orderId: ID!){
        deleteOrder(id:$orderId)
      }`,
    getUserCart:`query getUser($id:ID!){
        user(id: $id){
              cart{
                  count
                  item{
                    name
                    description
                    _id
                    img
                    price
                  }
              }
        }
      }`,
    placeOrder:`mutation{
        createOrder{
          _id
          totalPrice
        }
      }`,
    pay:`   mutation pay($orderId:ID!,$amount:Int!,$currency:String!,$cardNumber:String!,$expMonth:Int!,$expYear:Int!,$cvc:Int!){
        pay(paymentInput:{
            amount:$amount
          currency:$currency
          cardNumber:$cardNumber
          expMonth:$expMonth
          expYear:$expYear
          cvc:$cvc
      },
      orderId:$orderId)
  }`
}