var qs = require('qs');

function paymentBackendRequest(body) {
  return qs.stringify({
    'amount': body.amount,
   'currency': body.currency,
   'card[number]': body.cardNumber,
   'card[exp_month]': body.expMonth,
   'card[exp_year]': body.expYear,
   'card[cvc]': body.cvc 
   });
  }


  function createTransactionDto(backendResponse,orderId,userId) {
    var transactionObject = backendResponse
    transactionObject._id=backendResponse.id
    transactionObject.orderId=orderId
    transactionObject.userId=userId
    transactionObject.source._id = backendResponse.source.id
    transactionObject.date = backendResponse.created
    return transactionObject
    }
  
  
  
module.exports = { paymentBackendRequest,createTransactionDto}