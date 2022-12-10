import React, { Component } from 'react'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import { ToastContainer, toast } from 'react-toastify'
import LoadingIcon from '../General/Loading.js'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Button } from 'react-bootstrap'
import uri from '../General/StaticVariables/uri.json'
import {graphQLRequest} from '../General/graphQlRequest'
import graphQLQueries from '../General/graphQLQueries'

export default class Items extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      removeItemLoading:false,
      placeOrderloading:false,
      items: [],
      error:false
      
    }
  }


  async getItems(){
    this.setState({ loading: true })
    const graphQLVariables = {
      id: localStorage.getItem('userId')
  }
  await graphQLRequest(graphQLQueries.getUserCart,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
        
          this.setState({
            items: response.user.cart,
            
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


  async removeItemFromBag(itemId,i){
    this.setState({ removeItemLoading: true })
    const graphQLVariables = {
      itemId: itemId
  }
  await graphQLRequest(graphQLQueries.removeItemFromCart,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
        
          this.setState({
            removeItemLoading: false
          })
          toast.success(staticVariables.messages.itemRemove)
          var arrItems = this.state.items
          arrItems.splice(i, 1)
          this.setState({
            items:arrItems
          })
      })
      .catch((error) => {
        this.setState({ removeItemLoading: false })
      })
  }

  async placeOrder(){
    this.setState({ removeItemLoading: true, placeOrderloading:true })
    const graphQLVariables = {
      
  }
  await graphQLRequest(graphQLQueries.placeOrder,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
        
          this.setState({
            removeItemLoading: false,
            placeOrderloading:false
          })
          toast.success(staticVariables.messages.placeOrder)
          window.location.href = uri.order.replace(':id',response.createOrder._id)
      })
      .catch((error) => {
          this.setState({
            removeItemLoading: false,
            placeOrderloading:false
          })
      })
  }

  async componentDidMount() {
    this.getItems()
  }

  itemPrice(priceInCents){
    var priceInDollars = priceInCents/100
    return priceInDollars.toFixed(2)
  }

  render() {
  return (
    <div>
      {this.state.loading?( <LoadingIcon type="spin" color="#00ff00" />):this.state.items.length===0?(<h1>{staticVariables.messages.noItemsTOShow}</h1>):(
        <div>
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
              <Button 
                        disabled={this.state.removeItemLoading || this.state.placeOrderloading}
                        onClick={(e) => this.removeItemFromBag(item.item._id,i)}
                         variant="outline-danger">
                 Remove From Cart <RemoveShoppingCartIcon />
              </Button>
            </Card.Body>
          </Card>
          </div>
        </Col>
      ))}
    </Row>
    <Button 
    variant="success"
     size="lg" block
     onClick={(e) => this.placeOrder()}
     disabled={this.state.removeItemLoading || this.state.placeOrderloading}
     >{!this.state.placeOrderloading ? (
      'Make Order'
    ) : (
      <LoadingIcon color="#ffffff" />
    )}</Button>
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



