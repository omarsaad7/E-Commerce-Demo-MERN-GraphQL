const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);
const constants = require('../config/constants.json')

module.exports = {
    
     createOrderValidation : Order => {
        const orderSchema = Joi.object({
            status: Joi.forbidden()
            })

            return orderSchema.validate(Order)
        },


        filterOrderValidation : Order => {
            const orderSchema = Joi.object({
                status:Joi.string().valid(constants.types.orderStatus.pending,constants.types.orderStatus.paid,constants.types.orderStatus.paymentFailed,constants.types.orderStatus.paymentProcessing).required()
                })
                
                if(Order.status)
                    Order.status = Order.status.toUpperCase()
                return orderSchema.validate(Order)
            },

        OrderIdValidation : orderId => {
            const orderSchema = Joi.object({
                orderId:Joi.objectId().required()
                })
                
                return orderSchema.validate({orderId:orderId})
            }
}
   