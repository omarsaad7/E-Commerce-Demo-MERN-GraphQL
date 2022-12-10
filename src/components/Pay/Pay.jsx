import React, { Component } from 'react'
import Alert from 'react-bootstrap/Alert'
import KeyModal from './SubscModal.js'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import { Styles } from '../General/StaticVariables/Styles.js'
import LoadingIcon from '../General/Loading.js'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Error from '../Error/Error.jsx'
import uri from '../General/StaticVariables/uri.json'
import {graphQLRequest} from '../General/graphQlRequest'
import graphQLQueries from '../General/graphQLQueries'

var expMonth = undefined
var expYear = undefined
export default class createStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardNumber: '',
      cvc:'',
      cvcAlert:'',
      modalShow: false,
      cardNumberAlert: false,
      loading: false,
      payLoading:false,
      expiryDate:'',
      totalPrice:undefined,
      expiryDateAlert:false,
      resMsg:undefined
    }

    this.handleCardNumberChange = this.handleCardNumberChange.bind(this)
    this.handleCvcChange = this.handleCvcChange.bind(this)
    this.handleExpiryDateChange = this.handleExpiryDateChange.bind(this)
  }
  
  handleCardNumberChange(event) {
    this.setState({ cardNumber: event.target.value, cardNumberAlert: false })
  }
  handleCvcChange(event) {
    this.setState({ cvc: event.target.value, cvcAlert: false })
  }
  handleExpiryDateChange(event) {
    var date = event.target.value
    if(date.length > 5)
      return
    if(date.length===2 && this.state.expiryDate.length===1)
      date = date +'/'
    if(date.length===3 && this.state.expiryDate.length===2){
      date = [date.slice(0, 2), '/', date.slice(2)].join('');
    }

    this.setState({ expiryDate:date, expiryDateAlert: false })
  }



  validateExpiryDate() {
    if (this.state.expiryDate.length !== 5) 
      return false
    
    const date = this.state.expiryDate.split('/')
    expMonth = date[0]
    expYear = date[1]
    let expMonthInt =parseInt(expMonth)
    let expYearInt = parseInt(expYear)
    if(isNaN(expMonthInt) || isNaN(expYearInt) || expMonthInt>12)
      return false
    return true
  }

  async getData(){
    this.setState({ loading: true })
    const graphQLVariables = {id:window.location.href.split('/')[4]}
    await graphQLRequest(graphQLQueries.getOrder,graphQLVariables, localStorage.getItem('token'))
      .then((response) => {
        
          this.setState({
            totalPrice: response.order.totalPrice,
            loading: false
          })
      })
      .catch((error) => {
        this.setState({ loading: false, error: true })
      })
  }

  async componentDidMount() {
    this.getData()
  }

  itemPrice(priceInCents){
    var priceInDollars = priceInCents/100
    return priceInDollars.toFixed(2)
  }

  async pay(e) {
    e.preventDefault() //to avoid reloading page
    e.stopPropagation()
    this.setState({
      cardNumberAlert: false,
      expiryDateAlert: false,
      cvcAlert:false
    })
    if (this.state.cardNumber.length !== 16) {
      this.setState({ cardNumberAlert: true })
      return
    }
    if (this.state.cvc.length !== 3) {
      this.setState({ cvcAlert: true })
      return
    }
    if (!this.validateExpiryDate()) {
      this.setState({ expiryDateAlert: true })
      return
    }

      this.setState({ payLoading: true  })
      const graphQLVariables ={
        orderId: window.location.href.split('/')[4],
        amount:this.state.totalPrice,
        currency:staticVariables.currency,
        cardNumber:this.state.cardNumber,
        expMonth:parseInt(expMonth),
        expYear:parseInt('20'+expYear),
        cvc:parseInt(this.state.cvc)
      }
      await graphQLRequest(graphQLQueries.pay,graphQLVariables, localStorage.getItem('token'))
        .then((response) => {
          this.setState({
            payLoading: false,
            modalShow: true,
            resMsg:response.pay
          })
        })
        .catch((error) => {
          this.setState({  payLoading: false }) 
        })
    
  }
  callbackFunction = (value) => {
    this.setState({ modalShow: value })
    window.location.href = uri.order.replace(':id', window.location.href.split('/')[4])
  }
  render() {
    return (
      <div style={Styles.bgImage}>
        <Navbar />
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
                      {this.state.loading?( <LoadingIcon type="spin" color="#00ff00" />):this.state.error?(<Error errorCode="404" errorMessage="Couldn't find Order" />):(
        <div class="signin-background" style={Styles.minHeight}>
          <br />
          <br />
          <br />
          <div class="container">
            <div class="row">
              <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div class="card card-signin my-5">
                  <div class="card-body">
                    <h5 class="card-title text-center">Pay</h5>
                    <form class="form-signin">
                    <div class="form-label-group">
                        <label for="inputCardNumber">Card Number</label>
                        <InputGroup className="mb-3">
                          <FormControl
                            id="inputCardNumber"
                            class="form-control"
                            placeholder="Enter Card Number"
                            onChange={this.handleCardNumberChange}
                            value={this.state.cardNumber}
                            type='number'
                            required
                            autofocus
                          />
                          <InputGroup.Append>
                            <Button
                              variant="outline-dark"
                              disabled='true'
                            >
                                <CreditCardIcon />
                            </Button>
                          </InputGroup.Append>
                        </InputGroup>
                        <Alert variant="danger" show={this.state.cardNumberAlert}>
                          {staticVariables.messages.invalidCardNumber}
                        </Alert>
                      </div>
                      
                      <br />
                      <div style={{padding: '0px'}}>
                      <div class="form-label-group" style={{ width: '50%',float: 'left',padding: '30px'}}>
                        <label for="inputCardNumber">Expiry Date</label>
                        <input
                          id="inputCardNumber"
                          class="form-control"
                          placeholder="mm/yy"
                          onChange={this.handleExpiryDateChange}
                          type="text"
                          value={this.state.expiryDate}
                          disabled={this.state.payLoading}
                          required
                          autofocus
                        />
                        <Alert variant="danger" show={this.state.expiryDateAlert}>
                          {staticVariables.messages.invalidExpiryDate}
                        </Alert>
                      </div>
                      <br />
                      <div class="form-label-group" style={{ width: '50%',float: 'left',padding: '5px'}}>
                        <label for="inputCVC">CVC</label>
                        <input
                          id="inputCVC"
                          class="form-control"
                          placeholder="Enter CVC"
                          onChange={this.handleCvcChange}
                          type="number"
                          value={this.state.cvc}
                          disabled={this.state.payLoading}
                          required
                          autofocus
                        />
                        <Alert variant="danger" show={this.state.cvcAlert}>
                          {staticVariables.messages.invalidCvc}
                        </Alert>
                      </div>
                      </div>
                      <br />
                      <br />
                      
                      <button
                        class="btn btn-lg btn-success btn-block text-uppercase"
                        type="submit"
                        disabled={this.state.payLoading}
                        onSubmit={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => this.pay(e)}
                      >
                        {!this.state.payLoading ? (
                          `Pay (${this.itemPrice(this.state.totalPrice)}$)`
                                                  ) : (
                          <LoadingIcon color="#ffffff" />
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <KeyModal
                show={this.state.modalShow}
                msg={this.state.resMsg}
                parentCallback={this.callbackFunction}
              />
            </div>
          </div>

          <br />
          <br />
        </div>)}
        <Footer />
      </div>
    )
  }
}
