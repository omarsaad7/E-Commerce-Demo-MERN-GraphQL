const User = require("../../models/user.model")
const Item = require("../../models/item.model")
const Order = require("../../models/order.model")
const { filterOrderValidation, OrderIdValidation } = require('../../validations/order.validation')
const constants = require('../../config/constants.json')
const {getUserId} = require('./auth.controller.js')
const HttpError = require('../../exceptions/HttpError')
//Create Order
const createOrder = async (userId) => {

    const user = await User.findById(userId).populate('cart.item')
    // return If no user is found
    if(!user)
      throw new HttpError(constants.errorMessages.noUserFound)
    //return error if user cart is empty
    if(user.cart.length === 0)
      throw new HttpError(constants.errorMessages.emptyCart)
          
    // check for items availablity, update Them and calculate total price
    var {totalPrice,errorMsg} =  await getTotalPriceAndUpdateItems(user)
    if(errorMsg)  throw new HttpError({msg:errorMsg,statusCode:constants.errorMessages.itemNotAvailable.statusCode})

    const createOrderData = {userId:userId, totalPrice:totalPrice,items:user.cart}    
  
    const order = await Order.create(createOrderData)
    await User.updateOne({ '_id': userId }, {cart:[]})
    return order
};

const processToPaymentOrder = async (orderId) => {

  const { error } = OrderIdValidation(orderId)
  if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})
  const order = await Order.findById(orderId)
  if (!order) throw new HttpError(constants.errorMessages.noOrderFound)
  if(order.status !== constants.types.orderStatus.pending)
      throw new HttpError(constants.errorMessages.payForPendingOrdersOnly)
  await Order.updateOne({ '_id': orderId }, {status:constants.types.orderStatus.paymentProcessing})
  return constants.errorMessages.success.msg
}


const getTotalPriceAndUpdateItems = async (user) => {
  // check for items availablity
  var totalPrice = 0
  var itemsList = []
  for (let i = 0; i < user.cart.length; i++) {
    var item = user.cart[i].item
    if(item.quantity < user.cart[i].count){
      return {errorMsg:item.name + constants.errorMessages.itemNotAvailable}
    }
    itemsList.push({item:item,count: user.cart[i].count})
    user.cart[i].item = user.cart[i].item._id 
  }

  // update items quantity and calculate total price
  for (let i = 0; i < itemsList.length; i++) {
    await Item.updateOne({ '_id': itemsList[i].item._id }, {quantity: itemsList[i].item.quantity - itemsList[i].count})
    totalPrice = totalPrice + (itemsList[i].item.price * itemsList[i].count)
  }
  return {totalPrice:totalPrice}
}

//get Order by id
const getOrderById = async (orderId) => {
  //search for the Order with the requested id
  return await Order.findById(orderId).populate('items.item')
  .then(foundTarget => {
    // Throw Error if no order is found
    if(!foundTarget)
      throw new HttpError(constants.errorMessages.noOrderFound);
    return foundTarget
  })
  .catch(error => {
    throw error
  });
};


//get all orders
const getAllOrders = async (paginationInput,status,allUsers,userId) => {

    // make pagination in order not to load all orders 
  // set default limit to 10 and start page to 1 
  // page and limit are changed to the values provided in the url
  if(!paginationInput)
    paginationInput= {}
  const { page = 1, limit = 10} = paginationInput
  findQuery = {}
  if(status){
    const { error } = filterOrderValidation({status:status})
    if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})
    findQuery.status = status.toUpperCase()
  }
  if(!allUsers)
    findQuery.userId = userId
  // sort the data with the latest come first and return the needed Items and the total number of Items
  return await Order.find(findQuery).populate('items.item').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
    .then(async (orders) => {
      //Count All Orders
      return await Order.countDocuments(findQuery).then((count)=>{
        return {
          totalSize: count,
          page:page,
          limit:limit,
          data: orders
        }
      })
      
    })
}

// Delete Order
const deleteOrder = async (id) => {

    const order = await Order.findById(id).populate('items.item')
    if (!order) throw new HttpError(constants.errorMessages.noOrderFound)
    if(order.status !== constants.types.orderStatus.pending)
      throw new HttpError(constants.errorMessages.deletePendingOrderOnly)
    
      for (let i = 0; i < order.items.length; i++) {
        var item = order.items[i].item
        await Item.updateOne({ '_id': order.items[i].item._id }, {quantity: item.quantity + order.items[i].count})
      }
    await Order.deleteOne({"_id":id})
    return constants.errorMessages.success.msg
}


module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  deleteOrder,
  processToPaymentOrder
};



