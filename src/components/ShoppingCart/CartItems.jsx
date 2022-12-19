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
import {isLoggedIn} from '../General/Functions'


export default class Items extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      removeItemLoading:false,
      placeOrderloading:false,
      quantityUpdate:false,
      items: [],
      error:false
      
    }
  }

  
  async updateCartItemQuantity(e,item){
    item.count = e.target.value
    this.setState({
      quantityUpdate:true
    })
    
  }
  async updateCartItem(itemId,count){
    if(!isLoggedIn()){
      window.location.href = uri.login;
      return
    }
    this.setState({ quantityUpdate:false,removeItemLoading: true })

    const graphQLVariables = {
      item: itemId,
      count: count?parseInt(count):1
  }
  await graphQLRequest(graphQLQueries.updateCartItem,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
        
          this.setState({
            removeItemLoading: false
          })
          toast.success(staticVariables.messages.quantityUpdated)
      })
      .catch((error) => {
        this.setState({ removeItemLoading: false })
      })
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
          toast.success(staticVariables.messages.itemRemoved)
          var arrItems = this.state.items
          arrItems.splice(i, 1)
          this.setState({
            items:arrItems
          })
          localStorage.setItem('cartCount',parseInt(localStorage.getItem('cartCount'))-1)
          window.dispatchEvent(new Event("cartCount"));
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
      {this.state.loading?( <LoadingIcon type="spin" color="#00ff00" />):this.state.items.length===0?(<div data-aos="slide-right" className='info'><h1>{staticVariables.messages.noItemsTOShow}</h1></div>):(
        <div>
    <Row xs={1} md={3} className="g-4">
      {this.state.items.map((item,i) => (
        <Col>
        <div style={{paddingBottom:'20px'}} data-aos="fade-down" data-aos-anchor-placement="top-center">
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
              <Card.Text>
              <div class="form-label-group" style={{ width: '60%',paddingBottom:'5px',paddingRight:'5px'}}>
                        <label for="inputQuantity" >Quantity:</label>
                        <input
                          id="inputQuantity"
                          class="form-control"
                          
                          value={item.count}
                          onChange={(e)=>{this.updateCartItemQuantity(e,item)}}
                          onBlur={(e)=>{this.updateCartItem(item.item._id,item.count)}}
                          type="number"
                          min={1}
                          disabled={this.state.removeItemLoading || this.state.placeOrderloading}
                          required
                          autofocus
                        />
                        </div>
              </Card.Text>
              <br/>
              <Button 
                        disabled={this.state.removeItemLoading || this.state.placeOrderloading || this.state.quantityUpdate}
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
     disabled={this.state.removeItemLoading || this.state.placeOrderloading || this.state.quantityUpdate}
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



