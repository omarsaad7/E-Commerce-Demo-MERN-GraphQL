import React from 'react'
import { Navbar, Nav, Form, Button } from 'react-bootstrap'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReactTooltip from 'react-tooltip'
import { logout } from '../General/Functions'
import {isLoggedIn} from '../General/Functions'
import uri from '../General/StaticVariables/uri.json'
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
  }

  componentDidMount() {
    if(isLoggedIn()){
      this.setState({ loggedIn: true })
    }
    else{
      this.setState({ loggedIn: false })
    }
  }

  render() {
    if (!this.state.loggedIn) {
      return (
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/logo.png"
                width="60"
                height="30"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href={uri.home}>Shop</Nav.Link>
            </Nav>
            <Form inline bg="dark" variant="dark">
              <dev  style= {{paddingRight:'10px'}}>
            <Button href={uri.signUp} variant="outline-success">
                <PersonAddAlt1RoundedIcon /> Sign Up
              </Button>
              </dev>
              {'  '}
              <Button href={uri.login} variant="outline-success">
                <AccountCircleIcon /> Sign In
              </Button>
            </Form>
          </Navbar>
          <ReactTooltip />
        </div>
      )
    } else {
      return (
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/logo.png"
                width="60"
                height="30"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href={uri.home}>Shop</Nav.Link>
            </Nav> 
            <Nav className="mr-auto"/>
            
            
            <Form inline bg="dark" variant="dark">
              <div>
              <IconButton
                  aria-label="delete"
                  onClick={() => (window.location.href = uri.cart)}
                >
                  {/* <div style={{ color: 'white' }}> */}
                  <ShoppingCartIcon
                    style={{ color: 'white' }}
                    data-tip
                    data-for="cart"
                  />
                  <ReactTooltip id="cart" type="dark">
                    <span>Shopping Cart</span>
                  </ReactTooltip>
                  {/* </div> */}
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => (window.location.href = uri.update)}
                >
                  {/* <div style={{ color: 'white' }}> */}
                  <EditIcon
                    style={{ color: 'white' }}
                    data-tip
                    data-for="editAccount"
                  />
                  <ReactTooltip id="editAccount" type="dark">
                    <span>Edit Account</span>
                  </ReactTooltip>
                  {/* </div> */}
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => (window.location.href = uri.orders)}
                >
                  {/* <div style={{ color: 'white' }}> */}
                  <ReceiptIcon
                    style={{ color: 'white' }}
                    data-tip
                    data-for="orders"
                  />
                  <ReactTooltip id="orders" type="dark">
                    <span>My Orders</span>
                  </ReactTooltip>
                  {/* </div> */}
                </IconButton>
                <IconButton aria-label="delete" onClick={logout}>
                  <ExitToAppIcon
                    style={{ color: 'white' }}
                    data-tip
                    data-for="logout"
                  />
                  <ReactTooltip id="logout" type="dark">
                    <span>Log Out</span>
                  </ReactTooltip>
                </IconButton>
              </div>
            </Form>
          </Navbar>
          <ReactTooltip />
        </div>
      )
    }
  }
}
