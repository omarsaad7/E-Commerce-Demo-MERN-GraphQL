import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import LoadingIcon from '../General/Loading.js'
// import Alert from 'react-bootstrap/Alert'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { Styles } from '../General/StaticVariables/Styles.js'
import uri from '../General/StaticVariables/uri.json'
import { ToastContainer } from 'react-toastify'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import KeyModal from './SubscModal.js'
import {graphQLRequest} from '../General/graphQlRequest'
import graphQLQueries from '../General/graphQLQueries'

export default class UpdateInfo extends Component {
  state = {
    token: '',
    username: '',
    password: '',
    newPassword:'',
    passwordHidden: true,
    loading: false,
    alert: false,
    updateUsername:false,
    updatePassword:false,
    alertMessage: staticVariables.messages.invalidUsernameOrPassword,
    modalShow: false
  }
  updateInfo = async (e) => {
    e.preventDefault() //to avoid reloading page
    e.stopPropagation()
    this.setState({ loading: true })
    var graphQLVariables = {
      username: localStorage.getItem('username'),
      password: this.state.password,
    }
    await graphQLRequest(graphQLQueries.signIn,graphQLVariables, null)
      .then(async (res) => {

        graphQLVariables = {}
        if(this.state.updateUsername){
          graphQLVariables.username = this.state.username
        }
        if(this.state.updatePassword){
          graphQLVariables.password = this.state.newPassword
        }
        await graphQLRequest(graphQLQueries.updateUser,graphQLVariables, res.login.token)
          .then((response) => {
              this.setState({
                loading: false
              })
              if(this.state.updateUsername)
                localStorage.setItem('username', this.state.username)
              if(this.state.updatePassword)
                localStorage.setItem('password', this.state.newPassword)
          })
          .catch((error) => {
            this.setState({ loading: false })
          })

        this.setState({ loading: false,
                        username: '',
                        password: '',
                        newPassword:'',
                        updateUsername:false,
                        updatePassword:false,
                        modalShow: true})
      })
      .catch((error) => {
          this.setState({ loading: false, alert: true, alertMessage: staticVariables.messages.somethingWrong})
      })
  }

  componentDidMount() {}

  passwordSwitchChanged() {
    this.setState({ updatePassword: !this.state.updatePassword })
  }

  usernameSwitchChanged() {
    this.setState({ updateUsername: !this.state.updateUsername })
  }
  callbackFunction = (value) => {
    this.setState({ modalShow: value })
    window.location.href = uri.update
  }

  render() {
    return (
      <div style={Styles.bgImage}>
        <div class="signin-background">
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
          <br />
          <br />
          <br />
          <div class="container" style={Styles.minHeight} data-aos="zoom-in">
            <div class="row">
              <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div class="card card-signin my-5">
                  <div class="card-body">
                  <div className="title">
                    <h1 class="card-title text-center">Update Info</h1>
                    </div>
                    <form class="form-signin">
                    <div class="form-label-group">
                        <label for="inputPassword">Old Password</label>
                        <InputGroup className="mb-3">
                          <FormControl
                            type={
                              this.state.passwordHidden ? 'password' : 'text'
                            }
                            id="inputPassword"
                            class="form-control"
                            placeholder="Old Password"
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
                      <div class="form-label-group">
                        {/* <Alert variant="danger" show={this.state.alert}>
                          {this.state.alertMessage}
                        </Alert> */}
                        
                        <FormControlLabel
                        control={<Switch onClick={()=>this.usernameSwitchChanged()} color="primary" />}
                        label="Update username"
                        labelPlacement="Update username"
                      />
                        <input
                          type="text"
                          id="inputKey"
                          class="form-control"
                          placeholder="Enter Your New Username"
                          required
                          disabled={!this.state.updateUsername}
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
                      <FormControlLabel
                        control={<Switch  onClick={()=>this.passwordSwitchChanged()} color="primary" />}
                        label="Update Password"
                        labelPlacement="Update Password"
                      />
                        <InputGroup className="mb-3">
                          <FormControl
                            type={
                              this.state.passwordHidden ? 'password' : 'text'
                            }
                            id="inputPassword"
                            class="form-control"
                            placeholder="New Password"
                            required
                            disabled={!this.state.updatePassword}
                            value={this.state.newPassword}
                            onChange={(e) => {
                              let { newPassword } = this.state

                              newPassword = e.target.value

                              this.setState({ newPassword })
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
                        onClick={(e) => this.updateInfo(e)}
                      >
                        {!this.state.loading ? (
                          'Update Info'
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
                parentCallback={this.callbackFunction}
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}
