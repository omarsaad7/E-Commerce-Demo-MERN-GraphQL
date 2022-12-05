export default { 
    getAllItems:`query getItems($limit: Int!, $page: Int!){
        items(paginationInput:{limit:$limit,page:$page}){
            totalSize
            limit
            page
            data{
            name
            _id
            img
            quantity
            price
            }
        }
        }`,
    addItemToCart:`mutation addItemToCart($count: Int!, $item: String!){
        addItemToCart(addItemInput:{
            count:$count
            item:$item
        })
        }`
}