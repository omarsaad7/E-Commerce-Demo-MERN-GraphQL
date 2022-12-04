const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Source Schema
const source = new Schema(
  {
    _id: String,
    object: String,
    brand: String,
    country: String,
    cvc_check: String,
    exp_month: Number,
    exp_year: Number,
    fingerprint: String,
    funding: String,
    last4: String
  },
  {
    timestamps: false
  }
);


//Transaction schema
const transactionSchema = new Schema(
  {
    _id:  type = String,
    object: type = String,
    amount: type = Number,
    amount_captured: type = Number,
    amount_refunded:type = Number,
    balance_transaction: type = String,
    billing_details:type = Object,
    captured: type = Boolean,
    date: type = String,
    currency: type = String,
    paid: type = Boolean,
    payment_method: type = String,
    source:type = source,
    receipt_url: type = String,
    refunded: type = Boolean,
    status: type = String,
    userId:
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    orderId:
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }

  },
  {
    timestamps: true
  }
);
transactionSchema.index({
  "$**": "text"
});







module.exports = Transaction = mongoose.model("Transaction", transactionSchema);
