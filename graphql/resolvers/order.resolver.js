const Controller = require("../../api/controllers/order.controller")
const HttpError = require('../../exceptions/HttpError.js')
const constants = require('../../config/constants.json')

const {
    createOrder,
    getOrderById,
    getAllOrders,
    processToPaymentOrder,
    deleteOrder
  } = Controller

module.exports = {
    orders: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      if(args.allUsers && !req.isAdmin)
        throw new HttpError(constants.errorMessages.adminOnly)
      return await getAllOrders(args.paginationInput,args.status,args.allUsers,req.user.userId)
    },
    order: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await getOrderById(args.id) 
      },
    createOrder: async (args, req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await createOrder(req.user.userId)
    },
    processToPaymentOrder: async (args, req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await processToPaymentOrder(args.orderId)
    },
    deleteOrder: async (args, req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await deleteOrder(args.id)
    }
  }