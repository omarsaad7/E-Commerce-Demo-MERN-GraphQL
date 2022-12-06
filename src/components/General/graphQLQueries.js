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
    signUp:`mutation signup($username: String!, $password: String!){
        createCustomer(createCustomerInput:{
          username: $username
          password: $password
        }){
          token
          userId
          name
        }
      }`
}