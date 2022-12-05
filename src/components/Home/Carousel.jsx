import React, { Component } from 'react'
import { Carousel } from 'react-bootstrap'

export default class HomeCarousel extends Component {
  render() {
    return (
      <div>
        <header>
          <Carousel>
           
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/sportsshop2.jpg"
                alt="First slide"
              />
              <Carousel.Caption>
                <h3 style={{ cursor: 'pointer' }}>
                  <b>Sports Shop</b>
                </h3>
                <p>Shop With Us For Better Experience.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/sportsshop3.jpg"
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3 style={{ cursor: 'pointer' }}>
                  <b>Sports Shop</b>
                </h3>
                <p>Shop With Us For Better Experience.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/sportsshop1.jpg"
                alt="Third slide"
              />
              <Carousel.Caption>
                <h3 style={{ cursor: 'pointer' }}>
                  <b>Sports Shop</b>
                </h3>
                <p>Shop With Us For Better Experience.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </header>
      </div>
    )
  }
}
