const jwt = require("jsonwebtoken")
const constants = require('../../config/constants.json')
module.exports = async function (req, res, next) {

    
    var token = req.headers.authorization
    req.isAdmin = false
    if (!token){
        req.isAuth = false
    }
    try {
        token = token.replace('Bearer ','')
        const verified = jwt.verify(token, process.env.TOKEN)
        req.user = verified
        req.isAuth = true
        if(verified.userType === constants.types.user.admin)
           req.isAdmin = true
    }
    catch (error) {
        req.isAuth = false
    }
    next()

}