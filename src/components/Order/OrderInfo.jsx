import React, { Component } from 'react'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import backendUrls from '../General/StaticVariables/backEndUrls.json'
import { ToastContainer, toast } from 'react-toastify'
import LoadingIcon from '../General/Loading.js'
import { Button } from 'react-bootstrap'
import {Styles} from '../General/StaticVariables/Styles.js'
import Badge from 'react-bootstrap/Badge'
import Error from '../Error/Error.jsx'
import uri from '../General/StaticVariables/uri.json'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

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
    const headers = {
      Authorization: localStorage.getItem('token'),
    }
    
    await axios
      .get(
        backendUrls.host + backendUrls.order.baseUri + backendUrls.order.api.getOrderById.replace(':id', window.location.href.split('/')[4]),{
          headers: headers,
        }
      )
      .then((response) => {
        
          this.setState({
            items: response.data.data.items,
            totalPrice: response.data.data.totalPrice,
            status: response.data.data.status,
            receiptUrl:response.data.data.receiptUrl,
            failureReason:response.data.data.failureReason,
            loading: false
          })
      })
      .catch((error) => {
        if(error.response && error.response.data && error.response.data.error)
          toast.error(error.response.data.error)
         else
          toast.error(staticVariables.messages.somethingWrong)
        this.setState({ loading: false, error: true })
      })
  }


  async processToPayment(){
    this.setState({ processToPaymentLoading: true })
    const headers = {
      Authorization: localStorage.getItem('token'),
    }
    const body = {
      orderId: window.location.href.split('/')[4]
  }
    await axios
      .post(
        backendUrls.host + backendUrls.order.baseUri + backendUrls.order.api.processToPayment ,body, {
          headers: headers,
        }
      )
      .then((response) => {
        
          this.setState({
            processToPaymentLoading: false
          })
          toast.success(staticVariables.messages.OrderReadyToBePaid)
          window.location.href = uri.pay.replace(':id', window.location.href.split('/')[4])
      })
      .catch((error) => {
        if(error.response && error.response.data && error.response.data.error)
          toast.error(error.response.data.error)
         else
          toast.error(staticVariables.messages.somethingWrong)
        this.setState({ processToPaymentLoading: false })
      })
  }

  async DeleteOrder(){
    this.setState({ deleteOrderLoading: true, processToPaymentLoading:true })
    const headers = {
      Authorization: localStorage.getItem('token'),
    }
    const body = {
      
  }
    await axios
      .delete(
        backendUrls.host + backendUrls.order.baseUri + backendUrls.order.api.deleteOrder.replace(':id', window.location.href.split('/')[4]), {
          headers: headers,
        }
      )
      .then((response) => {
        
          this.setState({
            deleteOrderLoading: false,
            processToPaymentLoading:false
          })
          toast.success(staticVariables.messages.orderDeleted)
          window.location.href = uri.home
      })
      .catch((error) => {
        if(error.response && error.response.data && error.response.data.error)
          toast.error(error.response.data.error)
         else
          toast.error(staticVariables.messages.somethingWrong)
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
      <h1 style={Styles.centered50}>
      Your Order <Badge style={{color: this.getBadgeColor(),fontSize:'20px'}} > ({this.state.status})</Badge>
      </h1>
          <hr />
          <h2>Total Price: {this.itemPrice(this.state.totalPrice)}$</h2>
    <hr />
    {this.state.status === "PENDING"?(<div>
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
    <Button  variant="success"size="lg" block href={uri.pay.replace(':id',window.location.href.split('/')[4])}>Pay</Button> ):
    this.state.status==="PAID"?(<Button  variant="success"size="lg" block onClick={(e) => window.open(this.state.receiptUrl, '_blank', 'noopener,noreferrer')} >
      View Receipt</Button> )
      :<h5 style={{color:'red'}}>Failure Reason: {this.state.failureReason}</h5> }
    <br/>
    <hr/>
    <Row xs={1} md={3} className="g-4">
      {this.state.items.map((item,i) => (
        <Col>
        <div style={{paddingBottom:'20px'}}>
          <Card>
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



