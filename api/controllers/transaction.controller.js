const User = require("../../models/user.model");
const Transaction = require("../../models/transaction.model");
const Item = require("../../models/item.model");
const Order = require("../../models/order.model");
const constants = require('../../config/constants.json')
const uri = require('../../config/uri.json')
const {getUserId} = require('./auth.controller.js')
const axios = require('axios')
const {paymentBackendRequest,createTransactionDto} = require('../../utils/dto.utils.js')
const { chargeValidation } = require('../../validations/transaction.validation')
const HttpError = require('../../exceptions/HttpError')

//Charge user
const pay = async (paymentInput,orderId,userId) => {
  
    try{
      chargeValidation({payment:paymentInput,orderId:orderId})
    }
    catch(error) {
      throw new HttpError({msg:error.message,statusCode:constants.errorMessages.badRequest.statusCode})
      }
    const user = await User.findById(userId)
    if(!user) 
      throw new HttpError(constants.errorMessages.noUserFound)
    const order = await Order.findById(orderId)
    if(!order) 
      throw new HttpError(constants.errorMessages.noOrderFound)
    if(order.status !== constants.types.orderStatus.paymentProcessing)
      throw new HttpError(constants.errorMessages.chargeForProcessingPaymentOrdersOnly)

    chargeUser(paymentInput,order,orderId,userId)
    return constants.errorMessages.paymentRequestAccepted.msg

};

const chargeUser = async (paymentInput,order,orderId,userId) => {
    try{

      var backendResponse = await chargeUserBackendCall(paymentInput)
      var transactionObject = createTransactionDto(backendResponse,orderId,userId)
      const transaction = await Transaction.create(transactionObject)
      await Order.updateOne({ '_id': req.body.orderId },{transactionId:transaction._id,status:constants.types.orderStatus.paid,receiptUrl: transaction.receipt_url})
    }
    catch(error){
      var msg = error.message
      if(error.response && error.response.data && error.response.data.error && error.response.data.error.message)
        msg = error.response.data.error.message
      for (let i = 0; i < order.items.length; i++) {
        var item = await Item.findById(order.items[i].item._id)
        await Item.updateOne({ '_id': order.items[i].item._id }, {quantity: item.quantity + order.items[i].count})
      }
    await Order.updateOne({ '_id': orderId },{status:constants.types.orderStatus.paymentFailed,failureReason:msg})
  }
}

const chargeUserBackendCall = async (body) => {
  const url = uri.transaction.backend.host + uri.transaction.backend.api.charge
  var data = paymentBackendRequest(body)

   var config = {
     method: constants.apiMethods.post,
     url: url,
     headers: { 
      Authorization: process.env.STRIPEAUTHHEADER, 
      'Content-Type': constants.headers.contentTypeUrlEncoded
     },
     data : data
   };
   return axios(config)
   .then( (response) =>  {
    return response.data
   })
}



//get Transaction by id
const getTransactionById = async (id) => {
  //search for the Transaction with the requested id
  return await Transaction.findById(id)
  .then(foundTarget => {
    // Throw Error if no transaction is found
    if(!foundTarget)
      throw new HttpError(constants.errorMessages.noTransactionFound);

    return foundTarget
  })
  .catch(error => {
    throw new HttpError({msg:error.message,statusCode:constants.errorMessages.badRequest.statusCode})
  });
};



//get all Transactions
getAllTransactions = async (paginationInput,allUsers,userId) => {
        // make pagination in order not to load all transactions 
      // set default limit to 10 and start page to 1 
      // page and limit are changed to the values provided in the url
      if(!paginationInput)
        paginationInput= {}
      const { page = 1, limit = 10 } = paginationInput
      // sort the data with the latest come first and return the needed Items and the total number of Items
      var query = {}
      if(!allUsers)
        query = {userId:userId}
      return await Transaction.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
        .then(async (transactions) => {
          //Count All Transactions
          return await Transaction.countDocuments(query).then((count)=>{
            return {
              totalSize: count,
              page:page,
              limit:limit,
              data: transactions
            }
          })
        })
        .catch((error) => {
          throw new HttpError({msg:error.message,statusCode:constants.errorMessages.badRequest.statusCode})
        })
}



module.exports = {
  pay,
  getTransactionById,
  getAllTransactions
};



