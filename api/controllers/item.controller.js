const Item = require("../../models/item.model");
const { updateItemValidation,createItemValidation,deleteItemValidation } = require('../../validations/item.validation')
const constants = require('../../config/constants.json')
const HttpError = require('../../exceptions/HttpError')

//Create Item (Only Admin)
const createItem = async (body) => {

    //check if any attribute in the request body violates the attributes constraints
    const { error } = createItemValidation(body)
    if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})

    //create new Item with the given data and return the new user id and a token for the user 
      return await Item.create(body)
};


//get item by id (No Auth required)
const getItemById = async (id) => {
  //search for the Item with the requested id
  return await Item.findById(id)
  .then(foundTarget => {
    // Throw Error if no item is found
    if(!foundTarget)
      throw new HttpError(constants.errorMessages.noItemFound);
    return foundTarget
  })
  .catch(error => {
    throw error
  });
};


//get all items (No Auth required)
const getAllItems = async (args) => {

      // make pagination in order not to load all items 
      // set default limit to 10 and start page to 1 
      // page and limit are changed to the values provided in the url
      if(!args.paginationInput)
        args.paginationInput= {}
      const { page = 1, limit = 10 } = args.paginationInput
      // sort the data with the latest come first and return the needed Items and the total number of Items
      return await Item.find().sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
        .then(async (items) => {
          //Count All Items
          return await Item.countDocuments().then((count)=>{
            return {
              totalSize: count,
              page:page,
              limit:limit,
              data: items
            }
          })
          
        })
        .catch((error) => {
          throw error
        })
    
}

//Update Item (Only Admin)
const updateItem = async (body) => {
  const { error } = updateItemValidation(body)
  if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})

  const targetId = body.id;
  body.id = null
  const item = await Item.findById(targetId)
  if (!item) throw new HttpError(constants.errorMessages.noItemFound)
  await Item.updateOne({ '_id': targetId }, body)
  return constants.errorMessages.success.msg
}

// Delete Item (Only Admin)
const deleteItem = async (id) => {
  const { error } = deleteItemValidation(id)
  if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})

  const deletedTarget = await Item.findByIdAndRemove(id)
  if (!deletedTarget) throw new HttpError(constants.errorMessages.noItemFound)
  return constants.errorMessages.success.msg
}


module.exports = {
  createItem,
  getItemById,
  getAllItems,
  deleteItem,
  updateItem
};



