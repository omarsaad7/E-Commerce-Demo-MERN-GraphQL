const Controller = require("../../api/controllers/item.controller")
const HttpError = require('../../exceptions/HttpError.js')
const constants = require('../../config/constants.json')

const {
    createItem,
    getItemById,
    getAllItems,
    deleteItem,
    updateItem
  } = Controller

module.exports = {
    items: async (args) => {
      return await getAllItems(args)
    },
    item: async (args) => {
        return await getItemById(args.id) 
      },
    createItem: async (args, req) => {
      if(!req.isAdmin)
        throw new HttpError(constants.errorMessages.adminOnly)
      return await createItem(args.itemInput)
    },
    updateItem: async (args, req) => {
      if(!req.isAdmin)
        throw new HttpError(constants.errorMessages.adminOnly)
      return await updateItem(args.itemInput)
    },
    deleteItem: async (args, req) => {
      if(!req.isAdmin)
        throw new HttpError(constants.errorMessages.adminOnly)
      return await deleteItem(args.id)
    }
  }