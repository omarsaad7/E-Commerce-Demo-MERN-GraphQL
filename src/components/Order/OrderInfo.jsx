import React, { Component } from 'react'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import { ToastContainer, toast } from 'react-toastify'
import LoadingIcon from '../General/Loading.js'
import { Button } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import Error from '../Error/Error.jsx'
import uri from '../General/StaticVariables/uri.json'
import {graphQLRequest} from '../General/graphQlRequest'
import graphQLQueries from '../General/graphQLQueries'

export default class OrderPending extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      deleteOrderLoading:false,
      processToPaymentLoading:false,
      items: [],
      totalPrice:undefined,
      error:false,
      status:undefined,
      receiptUrl:undefined,
      failureReason:undefined
    }
  }


  async getData(){
    this.setState({ loading: true })
    
    const graphQLVariables = {id:window.location.href.split('/')[4]}
    await graphQLRequest(graphQLQueries.getOrder,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
          this.setState({
            items: response.order.items,
            totalPrice: response.order.totalPrice,
            status: response.order.status,
            receiptUrl:response.order.receiptUrl,
            failureReason:response.order.failureReason,
            loading: false
          })
      })
      .catch((error) => {
        this.setState({ loading: false, error: true })
      })
  }


  async processToPayment(){
    this.setState({ processToPaymentLoading: true })
    const graphQLVariables = {
      orderId: window.location.href.split('/')[4]
  }
  await graphQLRequest(graphQLQueries.processToPayment,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
        
          this.setState({
            processToPaymentLoading: false
          })
          toast.success(staticVariables.messages.OrderReadyToBePaid)
          window.location.href = uri.pay.replace(':id', window.location.href.split('/')[4])
      })
      .catch((error) => {
        this.setState({ processToPaymentLoading: false })
      })
  }

  async DeleteOrder(){
    this.setState({ deleteOrderLoading: true, processToPaymentLoading:true })
    const graphQLVariables = {
      orderId: window.location.href.split('/')[4]
  }
  await graphQLRequest(graphQLQueries.deleteOrder,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
        
          this.setState({
            deleteOrderLoading: false,
            processToPaymentLoading:false
          })
          toast.success(staticVariables.messages.orderDeleted)
          window.location.href = uri.home
      })
      .catch((error) => {
          this.setState({
            deleteOrderLoading: false,
            processToPaymentLoading:false,
          })
      })
  }

  async componentDidMount() {
    this.getData()
  }

  itemPrice(priceInCents){
    var priceInDollars = priceInCents/100
    return priceInDollars.toFixed(2)
  }

  getBadgeColor(){
    switch (this.state.status)
{
   case "PENDING": 
   case "PAYMENTPROCESSING": return '#FFBF00'
   case "PAYMENTFAILED": return '#ff0000'
   case "PAID": return '#00ff00'
   default: return '#FFBF00'
}
  }

  render() {
  return (
    <div>
      {this.state.loading?( <LoadingIcon type="spin" color="#00ff00" />):this.state.error?(<Error errorCode="404" errorMessage="Couldn't find Order" />):(
        <div>
      <div className='title'  data-aos="slide-left">
      <h1 >
      Your Order <Badge style={{color: this.getBadgeColor(),fontSize:'20px'}} > ({this.state.status})</Badge>
      </h1></div>
          <hr />
          <div data-aos="slide-right" className="subtitle">
          <h1 >Total Price: {this.itemPrice(this.state.totalPrice)}$</h1>
          </div>
    
    {this.state.status === "PENDING"?(<div data-aos="slide-right">
      <Button 
    variant="success"
     size="lg" block
     disabled ={this.state.deleteOrderLoading || this.state.processToPaymentLoading}
     onClick={(e) => this.processToPayment()}
     >{!this.state.processToPaymentLoading ? (
      'Process To Payment'
    ) : (
      <LoadingIcon color="#ffffff" />
    )}</Button> 
    <Button 
    variant="danger"
     size="lg" block
     disabled={this.state.deleteOrderLoading || this.state.processToPaymentLoading}
     onClick={(e) => this.DeleteOrder()}
     >{!this.state.deleteOrderLoading ? (
      'Delete Order'
    ) : (
      <LoadingIcon color="#ffffff" />
    )}</Button></div>) : this.state.status==="PAYMENTPROCESSING"? (
    <div data-aos="slide-right"><Button  variant="success"size="lg" block href={uri.pay.replace(':id',window.location.href.split('/')[4])}>Pay</Button> </div>):
    this.state.status==="PAID"?(<div data-aos="slide-right"><Button  variant="success"size="lg" block onClick={(e) => window.open(this.state.receiptUrl, '_blank', 'noopener,noreferrer')} >
      View Receipt</Button> </div>)
      :<div className='subtitle' data-aos="slide-right"><h1 style={{color:'red'}}>Failure Reason: {this.state.failureReason}</h1> </div>}
    <br/>
    <hr/>
    <Row xs={1} md={3} className="g-4">
      {this.state.items.map((item,i) => (
        <Col>
        <div style={{paddingBottom:'20px'}}    data-aos="fade-down" >
          <Card className="zoom">
            <Card.Img variant="top" src={item.item.img} />
            <Card.Body>
              <Card.Title>{item.item.name}</Card.Title>
              <Card.Text>
              {item.item.description}
              </Card.Text>
              <Card.Text>
              Price per each: {this.itemPrice(item.item.price)}$
              </Card.Text>
              <Card.Text>
              Quantity: {item.count}
              </Card.Text>
              <Card.Text>
              Total Price: {this.itemPrice(item.item.price * item.count)}$
              </Card.Text>
            </Card.Body>
          </Card>
          </div>
        </Col>
      ))}
    </Row>
    <hr />
    
    </div>
    
                        )}
    <ToastContainer
                          position="top-center"
                          autoClose={3000}
                          hideProgressBar={false}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          pauseOnHover
                        />
    </div>
  );
  }
}



