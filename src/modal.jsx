/* eslint-disable react/prop-types */
import React from 'react'
import reload from './utils/reload.png'
import './index.scss'

const Modal = ({ width, height, score }) => (
  <div className="modal-container" id="modal_container" style={{ width, height }}>
    <div className="modal">
      <h1>You lost</h1>
      <h1>
        Score:
        {score}
      </h1>
      <button type="button" className="button" onClick={() => window.location.reload()}>
        <img src={reload} alt="reloadButton" />
      </button>
    </div>
  </div>
)

export default Modal
