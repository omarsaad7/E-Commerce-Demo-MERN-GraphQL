import React from 'react'
import {Styles} from '../General/StaticVariables/Styles.js'
import constants from './StaticVariables/StaticVariables.json'
export default class Footer extends React.Component {
  render() {
    return (    
        <body class="d-flex flex-column" style={{height: '100%'}}>
          <footer
            id="sticky-footer"
            class="py-4 bg-dark text-white-50"
            style={Styles.footer}
          >
            <div class="container text-center">
              <small>Copyright &copy; <a href={constants.personalLink} rel="noreferrer" target="_blank">Omar Saad</a></small>
            </div>
          </footer>
        </body>
    )
  }
}

