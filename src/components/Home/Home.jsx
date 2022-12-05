import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import Carousel from './Carousel.jsx'
import Items from './Items.jsx'
import {Styles} from '../General/StaticVariables/Styles.js'
import staticVariables from '../General/StaticVariables/StaticVariables.json'

export default class Home extends Component {
  render() {
    return (
      <div>
      <div style={Styles.minHeight}>
        <Navbar />
        <Carousel />
        
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

