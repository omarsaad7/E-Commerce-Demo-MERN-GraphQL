import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import Orders from './AllOrdersData.jsx'
import {Styles} from '../General/StaticVariables/Styles.js'

export default class orders extends Component {
  render() {
    return (
      <div>
      <div style={Styles.minHeight}>
        <Navbar />
        
        <br />
        <div style={Styles.centered75}>
        <div className='title'>
        <h1>Your Orders</h1>
        </div>
          <hr />
          <Orders />
          <hr/>
        </div>
        <br />
  
        </div>
        <Footer />
      </div>
    )
  }
}

