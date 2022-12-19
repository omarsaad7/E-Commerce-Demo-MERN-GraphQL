import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import LoadingIcon from '../General/Loading.js'
import Alert from 'react-bootstrap/Alert'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { isLoggedIn, loginLocalStorage } from '../General/Functions'
import { Styles } from '../General/StaticVariables/Styles.js'
import uri from '../General/StaticVariables/uri.json'
import {graphQLRequest} from '../General/graphQlRequest'
import graphQLQueries from '../General/graphQLQueries'
import { ToastContainer } from 'react-toastify'

export default class SignIn extends Component {
  state = {
    token: '',
    username: '',
    password: '',
    passwordHidden: true,
    loading: false,
    alert: false,
    alertMessage: staticVariables.messages.invalidUsernameOrPassword
  }
  login = async (e) => {
    e.preventDefault() //to avoid reloading page
    e.stopPropagation()
    this.setState({ loading: true })
    const graphQLVariables = {
      username: this.state.username,
      password: this.state.password,
    }
    await graphQLRequest(graphQLQueries.signIn,graphQLVariables, null)
      .then((res) => {
        loginLocalStorage(
          res.login.token,
          this.state.username,
          this.state.password,
          res.login.userId
        )
        this.setState({ loading: false })
        window.location.href = uri.home
      })
      .catch((error) => {
          this.setState({ loading: false, alert: true })
      })
  }

  componentDidMount() {
    if (isLoggedIn()) {
      window.location.href = uri.home
    }
  }
  render() {
    return (
      <div style={Styles.bgImage}>
        <div class="signin-background">
          <Navbar />
          <br />
          <br />
          <br />
          <div class="container" style={Styles.minHeight} data-aos="zoom-in">
            <div class="row">
              <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div class="card card-signin my-5">
                  <div class="card-body">
                  <div className="title">
                    <h1 class="card-title text-center">Sign In</h1>
                    </div>
                    <form class="form-signin">
                      <div class="form-label-group">
                        <Alert variant="danger" show={this.state.alert}>
                          {this.state.alertMessage}
                        </Alert>
                        <label for="inputKey">Username</label>
                        <input
                          type="text"
                          id="inputKey"
                          class="form-control"
                          placeholder="Enter Your Username"
                          required
                          autofocus
                          value={this.state.username}
                          onChange={(e) => {
                            let { username } = this.state

                            username = e.target.value

                            this.setState({ username })
                          }}
                        />
                      </div>
                      <br />
                      <div class="form-label-group">
                        <label for="inputPassword">Password</label>
                        <InputGroup className="mb-3">
                          <FormControl
                            type={
                              this.state.passwordHidden ? 'password' : 'text'
                            }
                            id="inputPassword"
                            class="form-control"
                            placeholder="Password"
                            required
                            value={this.state.password}
                            onChange={(e) => {
                              let { password } = this.state

                              password = e.target.value

                              this.setState({ password })
                            }}
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
                      <button
                        class="btn btn-lg btn-success btn-block "
                        type="submit"
                        disabled={this.state.loading}
                        onSubmit={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => this.login(e)}
                      >
                        {!this.state.loading ? (
                          'Sign In'
                        ) : (
                          <LoadingIcon color="#ffffff" />
                        )}
                      </button>

                      <p style={{ color: 'gray', paddingTop: 5 }}>
                        {staticVariables.messages.signUp} {'  '}
                        <a href={uri.signUp}>sign up</a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
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
        </div>
      </div>
    )
  }
}
