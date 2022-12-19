import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import Carousel from './Carousel.jsx'
import Items from './Items.jsx'
import {Styles} from '../General/StaticVariables/Styles.js'

export default class Home extends Component {
  render() {
    return (
      <div>
      <div style={Styles.minHeight}>
        <Navbar />
        <div  data-aos="zoom-in">
        <Carousel />
        </div>
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

