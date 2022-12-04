const User = require("../../models/user.model");
const Item = require("../../models/item.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { createUserValidation,updateUserValidation,addItemValidation,removeItemValidation} = require('../../validations/user.validation')
const constants = require('../../config/constants.json')
const {getUserId} = require('./auth.controller.js')
const HttpError = require('../../exceptions/HttpError')

//Create Customer
const createCustomer = async (data) => {
  //check if any attribute in the request body violates the attributes constraints
  const { error } = createUserValidation(data)
  if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})
  //Check if username already exists
  const user = await User.findOne({ username: data.username })
  if (user)
    throw new HttpError(constants.errorMessages.usernameAlreadyExists)
    
  //hash the store password
  const salt =  bcrypt.genSaltSync(10)
  const hachedPassword =  bcrypt.hashSync(data.password, salt)
  data.password = hachedPassword

  //create new User with the given data and return the new user id and a token for the user 
  return await User.create(data)
    .then(createdTarget => {
      const token = jwt.sign({ userId: createdTarget._id, userType:createdTarget.type}, process.env.TOKEN)
      return {
        userId: createdTarget._id,
        name:createdTarget.username,
        token: token
      }
    },
    )
    .catch(error => {
      throw new Error(error.message)
    });

};


//get Customer by id
const getUserById = async (id) => {
  //search for the User with the requested id
  return await User.findById(id).populate('cart.item')
  .then(foundTarget => {
    // Throw Error if no user is found
    if(!foundTarget)
      throw new HttpError(constants.errorMessages.noUserFound);
    return foundTarget
  })
};


//get all users (Only Admins can access this api)
const getAllCustomers = async (paginationInput) => {

        // make pagination in order not to load all customers 
      // set default limit to 10 and start page to 1 
      // page and limit are changed to the values provided in the url
      if(!paginationInput)
        paginationInput= {}
      const { page = 1, limit = 10} = paginationInput
      // sort the data with the latest come first and return the needed Items and the total number of Items
      return await User.find({type:constants.types.user.customer}).populate('cart.item').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit < 0 ? 0 : (page - 1) * limit)
        .then(async (users) => {
          //Count All Transactions
          return await User.countDocuments({type:constants.types.user.customer}).then((count)=>{
            return {
              totalSize: count,
              page:page,
              limit:limit,
              data: users
            }
          })   
        })
};


const updateUser = async (data,targetId) => {

    // Validate request body
    const { error } = updateUserValidation(data)
    if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})

    //find the user given it's id in the request url then update its data with the data provided in the request body
    if(data.username){
      const userFound = await User.findOne({username:data.username})
      console.log(userFound)
      if(userFound)
        throw new HttpError(constants.errorMessages.usernameAlreadyExists);
    }
    
    if(data.password){
      //hash the store password
      const salt =  bcrypt.genSaltSync(10)
      const hachedPassword =  bcrypt.hashSync(data.password, salt)
      data.password = hachedPassword
    }
    const user = await User.findById(targetId)
    if (!user) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})
    await User.updateOne({ '_id': targetId }, data)
    return constants.errorMessages.success.msg
}

const deleteUser = async (id) => {
    const deletedTarget = await User.findByIdAndRemove(id)
    if (!deletedTarget) throw new HttpError(constants.errorMessages.noUserFound)
    return constants.errorMessages.success.msg
}

//add Item to cart
const addItem =  async (data,userId) => {
    // Validate Request Body
    const { error } = addItemValidation(data)
    if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})
    // Get User 
    return await User.findById(userId)
      .then(async (user) => {
        // return If no user is found
        if(!user)
          throw new HttpError(constants.errorMessages.noUserFound)

          // Get Item
          return await Item.findById(data.item)
          .then(async (item) => {
            if(!item)
              throw new HttpError(constants.errorMessages.noItemFound)
            for (let i = 0; i <  user.cart.length; i++) {
              if(user.cart[i].item._id.toString()===item._id.toString()){
                user.cart[i].count = user.cart[i].count + data.count
                await User.updateOne({ '_id': userId }, {cart:user.cart})
                return constants.errorMessages.success.msg
              }
            }
            user.cart.push({item:item._id,count:data.count})
            await User.updateOne({ '_id': userId }, {cart:user.cart})
            return constants.errorMessages.success.msg
          })
           
      })
};



//remove Item from cart
const removeItem = async (itemId,userId) => {
    // Validate Request Body
    const { error } = removeItemValidation(itemId)
    if (error) throw new HttpError({msg:error.details[0].message,statusCode:constants.errorMessages.badRequest.statusCode})
    // Get User
    return await User.findById(userId)
      .then(async (user) => {
        // return If no user is found
        if(!user)
          throw new HttpError(constants.errorMessages.noUserFound)
          for (let i = 0; i <  user.cart.length; i++) {
            if(user.cart[i].item._id.toString()===itemId.toString()){
              user.cart.splice(i, 1)
              await User.updateOne({ '_id': userId }, {cart:user.cart})
              return constants.errorMessages.success.msg
            }
          }
          throw new HttpError(constants.errorMessages.itemNotInCart)   
      })
 
};

module.exports = {
  createCustomer,
  getUserById,
  updateUser,
  deleteUser,
  getAllCustomers,
  addItem,
  removeItem
};



