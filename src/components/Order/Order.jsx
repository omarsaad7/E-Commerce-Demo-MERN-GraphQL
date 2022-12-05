import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import Items from './OrderInfo.jsx'
import {Styles} from '../General/StaticVariables/Styles.js'
import staticVariables from '../General/StaticVariables/StaticVariables.json'

export default class Order extends Component {
  render() {
    return (
      <div>
      <div style={Styles.minHeight}>
        <Navbar />
        
        <br />
        <div style={Styles.centered75}>
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

