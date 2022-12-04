const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const Constants = require('../config/constants.json')
const HttpError = require('../exceptions/HttpError')
module.exports = {
    
     chargeValidation : Charge => {
        const paymentSchema = Joi.object({
            amount:Joi.number().integer().min(1).max(1.7976931348623157e+308).required(),
            currency: Joi.string().required(),
            cardNumber: Joi.string().pattern(new RegExp(Constants.regex.cardNumberRegex)).messages({'string.pattern.base': Constants.errorMessages.cardNumberValidation.msg}).required(),
            expMonth: Joi.number().integer().min(1).max(12).required(),
            expYear: Joi.number().integer().min(2000).required(),
            cvc: Joi.number().integer().min(100).max(999).required()
            })
        
        const chargeSchema = Joi.object({
            payment:paymentSchema,
            orderId: Joi.objectId().required()
            })

            const validationResult = chargeSchema.validate(Charge)
            if(validationResult.error)
                throw validationResult.error

            today = new Date();
            someday = new Date();
            someday.setFullYear(Charge.payment.expYear, Charge.payment.expMonth, 1)

            if (someday < today) 
                throw new HttpError(Constants.errorMessages.expiryDateValidation)
            
            return validationResult
        }
}
   