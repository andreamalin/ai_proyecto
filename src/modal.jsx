import React from 'react'
import reload from './utils/reload.png'
import './index.scss'

const Modal = () => (
  <div className="modal-container" id="modal_container">
    <div className="modal">
      <h1>You lost</h1>
      <button type="button" className="button" onClick={() => window.location.reload()}>
        <img src={reload} alt="reloadButton" />
      </button>
    </div>
  </div>
)

export default Modal
