const Controller = require("../../api/controllers/transaction.controller")
const HttpError = require('../../exceptions/HttpError.js')
const constants = require('../../config/constants.json')

const {
    pay,
    getAllTransactions,
    getTransactionById
  } = Controller

module.exports = {
    transactions: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      if(args.allUsers && !req.isAdmin)
        throw new HttpError(constants.errorMessages.adminOnly)
      return await getAllTransactions(args.paginationInput,args.allUsers,req.user.userId)
    },
    transaction: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await getTransactionById(args.id) 
      },
    pay: async (args, req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await pay(args.paymentInput,args.orderId,req.user.userId)
    }
  }