import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import Items from './CartItems.jsx'
import {Styles} from '../General/StaticVariables/Styles.js'
import staticVariables from '../General/StaticVariables/StaticVariables.json'

export default class Cartt extends Component {
  render() {
    return (
      <div>
      <div style={Styles.minHeight}>
        <Navbar />
        
        <br />
        <div style={Styles.centered75}>
        <h1 style={Styles.centered50}>Your Shopping Bag</h1>
          <hr />
          <Items />
          <hr/>
        </div>
        <br />
  
        </div>
        <Footer />
      </div>
    )
  }
}

