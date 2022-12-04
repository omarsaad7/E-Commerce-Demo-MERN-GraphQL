const User = require("../../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const constants = require('../../config/constants.json')
const HttpError = require('../../exceptions/HttpError')
Login = async (data) => {
  try {
    //check the validity of the username
    const user = await User.findOne({ username: data.username })
    if (!user)
      throw new HttpError(constants.errorMessages.invalidUsername)
    //the password validety
    //we check if the given password matches the hashed store password 
    const validPass = await bcrypt.compare(data.password, user.password)
    if (!validPass)
      throw new HttpError(constants.errorMessages.invalidPassword)
    
    // Generate and return  token
    const token = jwt.sign({ userId: user._id, userType:user.type}, process.env.TOKEN)
    return {userId:user._id, token: token,userType: user.type}
  } catch (error) { throw error }
}

getUserId =  (token) =>  {
      token = token.replace('Bearer ','')
      const verified = jwt.verify(token, process.env.TOKEN) 
      return verified.userId
}
module.exports = { Login, getUserId }