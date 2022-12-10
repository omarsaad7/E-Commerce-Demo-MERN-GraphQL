import './App.css'
import React, { Component } from 'react'
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import SignUp from './components/signUp/signUp.jsx'
import Error from './components/Error/Error.jsx'
import Home from './components/Home/Home.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import Cart from './components/ShoppingCart/Cartt'
import Order from './components/Order/Order'
import Orders from './components/Order/AllOrders'
import Pay from './components/Pay/Pay'
import Update from './components/UpdateInfo/UpdateInfo'
import uri from './components/General/StaticVariables/uri.json'

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={() => <Home />} />
            <Route exact path={uri.signUp} component={() => <SignUp />} />
            <Route exact path={uri.cart} component={() => <Cart />} />
            <Route exact path={uri.update} component={() => <Update />} />
            <Route exact path={uri.orders} component={() => <Orders />} />
            <Route exact path={uri.order} component={(props) => <Order {...props} />} />
            <Route exact path={uri.pay} component={(props) => <Pay {...props} />} />
            <Route exact path={uri.login} component={() => <SignIn />} />

            <Route
              component={() => (
                <Error errorCode="404" errorMessage="Page Not Found" />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
