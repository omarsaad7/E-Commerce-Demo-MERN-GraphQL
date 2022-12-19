import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import Items from './CartItems.jsx'
import {Styles} from '../General/StaticVariables/Styles.js'

export default class Cartt extends Component {
  render() {
    return (
      <div>
      <div style={Styles.minHeight}>
        <Navbar />
        
        <br />
        <div style={Styles.centered75}>
          <div className='title'>
        <h1 >Your Shopping Bag</h1>
        </div>
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

