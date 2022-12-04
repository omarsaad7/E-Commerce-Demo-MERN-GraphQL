const Joi = require('joi')

module.exports = {
    
     createItemValidation : Item => {
        const itemSchema = Joi.object({
            quantity:Joi.number().integer().min(1).max(1.7976931348623157e+308).required(),
            name: Joi.string().min(1).max(30).required(),
            description: Joi.string().min(1).max(100),
            img: Joi.string(),
            price:Joi.number().integer().min(1).max(1.7976931348623157e+308).required()
            })

            return itemSchema.validate(Item)
        },

        updateItemValidation : Item => {
            const itemSchema = Joi.object({
                id:Joi.objectId().required(),
                quantity:Joi.number().min(1).max(1.7976931348623157e+308),
                name: Joi.string().min(1).max(30),
                description: Joi.string().min(1).max(100),
                img: Joi.string(),
                price:Joi.number().min(1).max(1.7976931348623157e+308)
                })
    
                return itemSchema.validate(Item)
            },

            deleteItemValidation : id => {
                const itemSchema = Joi.object({
                    id:Joi.objectId().required()
                    })
        
                    return itemSchema.validate({id:id})
                }
}
   