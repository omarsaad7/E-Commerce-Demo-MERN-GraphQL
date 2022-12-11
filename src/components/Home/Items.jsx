import React, { Component } from 'react'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import { ToastContainer, toast } from 'react-toastify'
import LoadingIcon from '../General/Loading.js'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {Form, Button } from 'react-bootstrap'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {isLoggedIn} from '../General/Functions'
import uri from '../General/StaticVariables/uri.json'
import {graphQLRequest} from '../General/graphQlRequest'
import graphQLQueries from '../General/graphQLQueries'

export default class Items extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      addItemloading:false,
      items: [],
      error:false,
      limit:12,
      page:1,
      totalSize:0
    }

    this.handleQuantityChange = this.handleQuantityChange.bind(this)
  }

  handleQuantityChange(e,item) {
    // this.setState({ cvc: event.target.value, cvcAlert: false })
    item.count =e.target.value 
  }

  async nextPage(){
    var totalPages = Math.ceil(this.state.totalSize / this.state.limit)
    if(totalPages > this.state.page){
      await this.getAllItems(this.state.page+1,this.state.limit)
      this.setState({ page: this.state.page+1 })
    }
  }

  async previousPage(){
    if(this.state.page>1){
      await this.getAllItems(this.state.page-1,this.state.limit)
      this.setState({ page: this.state.page-1 })
    }
  }

  async addItemToBag(itemId,count){
    if(!isLoggedIn()){
      window.location.href = uri.login;
      return
    }
    this.setState({ addItemloading: true })

    const graphQLVariables = {
      item: itemId,
      count: count?parseInt(count):1
  }
  await graphQLRequest(graphQLQueries.addItemToCart,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
        
          this.setState({
            addItemloading: false
          })
          toast.success(staticVariables.messages.itemAdded)
      })
      .catch((error) => {
        this.setState({ addItemloading: false })
      })
  }

  async componentDidMount() {
    this.getAllItems(this.state.page,this.state.limit)
  }

  async getAllItems(page,limit){
    this.setState({ loading: true })
    const graphQLVariables = {limit:limit,page:page}
    await graphQLRequest(graphQLQueries.getAllItems,graphQLVariables,null)
    .then((response) => {
      this.setState({
        items: response.items.data,
        totalSize:response.items.totalSize,
        loading: false,
      })
  })
  .catch((error) => {
    this.setState({ loading: false, error: true })
  })
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
      {this.state.items.map((item) => (
        <Col>
        <div style={{paddingBottom:'20px'}}>
          <Card>
            <Card.Img variant="top" src={item.img} />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>
              {item.description}
              </Card.Text>
              <Card.Text>
              Price: {this.itemPrice(item.price)}$
              </Card.Text>
              <Card.Text>
              <div class="form-label-group" style={{ width: '30%',paddingBottom:'5px',paddingRight:'5px'}}>
                        <label for="inputQuantity" >Quantity:</label>
                        <input
                          id="inputQuantity"
                          class="form-control"
                          placeholder="1"
                          onChange={(e)=>{this.handleQuantityChange(e,item)}}
                          type="number"
                          min={1}
                          // value={this.state.cvc}
                          disabled={this.state.addItemloading}
                          required
                          autofocus
                        />
                        </div>
              </Card.Text>
              <br/>
              <Button 
                        disabled={this.state.addItemloading}
                        onClick={(e) => this.addItemToBag(item._id,item.count)}
                         variant="outline-success">
                 Add To Cart <AddShoppingCartIcon />
              </Button>
            </Card.Body>
          </Card>
          </div>
        </Col>
      ))}
    </Row>
    <Form inline bg="dark" variant="dark">
              <dev  style= {{paddingRight:'10px'}}>
            <Button disabled={this.state.page<=1}
                        onClick={(e) => this.previousPage(e)}
                         variant="outline-success">
                <ArrowLeftIcon /> Previous
              </Button>
              </dev>
              {'  '}
              <Button 
                        disabled={Math.ceil(this.state.totalSize / this.state.limit)<=this.state.page}
                        onClick={(e) => this.nextPage(e)}
                         variant="outline-success">
                 Next <ArrowRightIcon />
              </Button>
            </Form>
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



