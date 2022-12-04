const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require('../config/constants.json')
const Item = require("./item.model")

const user = new Schema(
  {
    username: { type : String , unique : true, required : true},
    password: {type : String, required : true},
    type:{
      type: String,
      enum : [constants.types.user.customer,constants.types.user.admin],
      default: constants.types.user.customer
  },
    cart:[{item:{type: Schema.Types.ObjectId,ref: "Item"},count:Number}]
  },
  {
    timestamps: true
  }
);
user.index({
  "$**": "text"
});

module.exports = User = mongoose.model("User", user);
