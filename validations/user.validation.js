const Joi = require('joi')
const Constants = require('../config/constants.json')
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
    
    createUserValidation : User => {
        const userSchema = Joi.object({
            username:Joi.string().pattern(new RegExp(Constants.regex.usernameRegex)).messages({'string.pattern.base': Constants.errorMessages.usernameValidation.msg}).required(),
            password: Joi.string().pattern(new RegExp(Constants.regex.passwordRegex)).messages({'string.pattern.base': Constants.errorMessages.passwordValidation.msg}).required()
            })

            return userSchema.validate(User)
    },

    updateUserValidation : User => {
        const userSchema = Joi.object({
            username:Joi.string().pattern(new RegExp(Constants.regex.usernameRegex)).messages({'string.pattern.base': Constants.errorMessages.usernameValidation.msg}),
            password: Joi.string().pattern(new RegExp(Constants.regex.passwordRegex)).messages({'string.pattern.base': Constants.errorMessages.passwordValidation.msg})
            })

            return userSchema.validate(User)
    },

    addItemValidation : item => {
        const itemIdSchema = Joi.object({
            item:Joi.objectId().required(),
            count:Joi.number().min(1).required(),
            })

            return itemIdSchema.validate(item)
    },
    removeItemValidation : itemId => {
        const itemIdSchema = Joi.object({
            itemId:Joi.objectId().required(),
            })

            return itemIdSchema.validate({itemId:itemId})
    }
}
   