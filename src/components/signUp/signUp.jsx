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
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import {isLoggedIn,loginLocalStorage } from '../General/Functions'
import { Styles } from '../General/StaticVariables/Styles.js'
import LoadingIcon from '../General/Loading.js'
import {graphQLRequest} from '../General/graphQlRequest'
import graphQLQueries from '../General/graphQLQueries'
import uri from '../General/StaticVariables/uri.json'


export default class createStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      repassword: '',
      passwordHidden: true,
      modalShow: false,
      nameAlert: false,
      passwordAlert: false,
      passwordAlertMsg: '',
      loading: false
    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleRepasswordChange = this.handleRepasswordChange.bind(this)
    this.handlePasswordVisibility = this.handlePasswordVisibility.bind(this)
  }
  
  handleUsernameChange(event) {
    this.setState({ username: event.target.value, nameAlert: false })
  }
  handlePasswordChange(event) {
    this.setState({ password: event.target.value, passwordAlert: false })
  }
  handleRepasswordChange(event) {
    this.setState({ repassword: event.target.value, passwordAlert: false })
  }
  handlePasswordVisibility() {
    this.setState({ passwordHidden: !this.state.passwordHidden })
  }



  validatePassword() {
    if (this.state.password !== this.state.repassword) {
      this.setState({ passwordAlertMsg: staticVariables.messages.passwordNotSame })
      return false
    } else if (this.state.password === '') {
      this.setState({ passwordAlertMsg: staticVariables.messages.emptyPassword })
    }else {
      return true
    }
  }

  componentDidMount() {
    if (isLoggedIn()) {
      window.location.href = uri.home
    }
  }

  async signup(e) {
    e.preventDefault() //to avoid reloading page
    e.stopPropagation()
    this.setState({
      nameAlert: false,
      passwordAlert: false
    })
    if (this.state.username === '') {
      this.setState({ nameAlert: true })
      return
    }
    if (!this.validatePassword()) {
      this.setState({ passwordAlert: true })
      return
    }
      
      this.setState({ loading: true  })
      const graphQLVariables = {
        username: this.state.username,
        password: this.state.password
    }
    await graphQLRequest(graphQLQueries.signUp,graphQLVariables, null)
        .then((response) => {
          this.setState({
            loading: false,
            modalShow: true
          })
          loginLocalStorage(response.createCustomer.token,response.createCustomer.name,this.state.password,response.createCustomer.userId,0)
        })
        .catch((error) => {
          this.setState({  loading: false })
        })
    
  }
  callbackFunction = (value) => {
    this.setState({ modalShow: value })
    window.location.href = uri.home
  }
  render() {
    return (
      <div style={Styles.bgImage}>
        <Navbar />
        <ToastContainer
                          position="top-right"
                          autoClose={3000}
                          hideProgressBar={false}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          pauseOnHover
                        />
        <div class="signin-background" style={Styles.minHeight} data-aos="zoom-in">
          <br />
          <br />
          <br />
          <div class="container">
            <div class="row">
              <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div class="card card-signin my-5">
                  <div class="card-body">
                  <div className="title">
                    <h1 class="card-title text-center">Sign Up</h1>
                    </div>
                    <form class="form-signin">
                      <div class="form-label-group">
                        <label for="inputStoreName">Username</label>
                        <input
                          id="inputStoreName"
                          class="form-control"
                          placeholder="Enter Username"
                          onChange={this.handleUsernameChange}
                          value={this.state.username}
                          required
                          autofocus
                        />
                        <Alert variant="danger" show={this.state.nameAlert}>
                          {staticVariables.messages.emptyUsername}
                        </Alert>
                      </div>
                      <br />

                      <div class="form-label-group">
                        <label for="inputStoreAddress">Password</label>
                        <InputGroup className="mb-3">
                          <FormControl
                            id="inputStorePassword"
                            class="form-control"
                            placeholder="Enter Password"
                            onChange={this.handlePasswordChange}
                            value={this.state.password}
                            type={
                              this.state.passwordHidden ? 'password' : 'text'
                            }
                            required
                            autofocus
                          />
                          <InputGroup.Append>
                            <Button
                              variant="outline-success"
                              onClick={() =>
                                this.setState({
                                  passwordHidden: !this.state.passwordHidden,
                                })
                              }
                            >
                              {this.state.passwordHidden ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </Button>
                          </InputGroup.Append>
                        </InputGroup>
                      </div>
                      <div class="form-label-group">
                        <label for="inputStoreAddress">Re-enter Password</label>
                        <InputGroup className="mb-3">
                          <FormControl
                            id="inputStoreRepassword"
                            class="form-control"
                            placeholder="Re-Enter Password"
                            onChange={this.handleRepasswordChange}
                            value={this.state.repassword}
                            type={
                              this.state.passwordHidden ? 'password' : 'text'
                            }
                            required
                            autofocus
                          />
                          <InputGroup.Append>
                            <Button
                              variant="outline-success"
                              onClick={() =>
                                this.setState({
                                  passwordHidden: !this.state.passwordHidden,
                                })
                              }
                            >
                              {this.state.passwordHidden ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </Button>
                          </InputGroup.Append>
                        </InputGroup>

                        <Alert variant="danger" show={this.state.passwordAlert}>
                          {this.state.passwordAlertMsg}
                        </Alert>
                      </div>
                      <br />
                      <button
                        class="btn btn-lg btn-success btn-block text-uppercase"
                        type="submit"
                        disabled={this.state.loading}
                        onSubmit={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => this.signup(e)}
                      >
                        {!this.state.loading ? (
                          'Sign Up'
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
                username={this.state.username}
                parentCallback={this.callbackFunction}
              />
            </div>
          </div>

          <br />
          <br />
        </div>
        <Footer />
      </div>
    )
  }
}
