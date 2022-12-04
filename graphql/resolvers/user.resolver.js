
const Controller = require("../../api/controllers/user.controller")
const constants = require('../../config/constants.json')
const HttpError = require('../../exceptions/HttpError')
const {
  createCustomer,
  getUserById,
  updateUser,
  deleteUser,
  getAllCustomers,
  addItem,
  removeItem
} = Controller
module.exports = {
  createCustomer: async (args,req) => {
      if(!(req.isAuth && req.isAdmin)){
        throw new HttpError(constants.errorMessages.adminOnly)
      }
      return await createCustomer(args.createCustomerInput) 
    },
    customers: async (args,req) => {
      if(!req.isAdmin)
        throw new HttpError(constants.errorMessages.adminOnly)
      return await getAllCustomers(args.paginationInput)
    },
    user: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await getUserById(args.id) 
      },
    updateProfile: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await updateUser(args.updateCustomerInput,req.user.userId) 
      },
    deleteUser: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await deleteUser(args.id)
      },
    addItemToCart: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await addItem(args.addItemInput,req.user.userId) 
      },
    removeItemFromCart: async (args,req) => {
      if(!req.isAuth)
        throw new HttpError(constants.errorMessages.unauthorized)
      return await removeItem(args.itemId, req.user.userId) 
      }
  }