const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Item schema
const itemSchema = new Schema(
  {
    name: {type : String, required : true},
    description: String,
    img:  String,
    quantity: {type : Number, required : true},
    price: {type : Number, required : true}, // smallest common currency unit
  },
  {
    timestamps: true
  }
);
itemSchema.index({
  "$**": "text"
});

module.exports = Item = mongoose.model("Item", itemSchema);
