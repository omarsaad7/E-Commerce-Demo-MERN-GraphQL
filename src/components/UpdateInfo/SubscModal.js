import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import staticVariables from '../General/StaticVariables/StaticVariables.json'

const KeyModal = (props) => {
  // const [show, setShow] = useState(props.show);
  var show = props.show
  const handleClose = () => 
    (sendDataToParentComponent(false))
  const sendDataToParentComponent = (data) => {
    props.parentCallback(data)
  }
    return (
      <Modal
        show={show}
        // onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>Info Updated Successfully</Modal.Title>
        </Modal.Header>
      </Modal>
    )
  
}

export default KeyModal
