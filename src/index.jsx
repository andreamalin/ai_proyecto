import React from 'react'
import ReactDOM from 'react-dom'
import Board from './Board'
import reload from './utils/reload.png'
import './index.scss'

const App = () => (
  <>
    <h1>Snake</h1>
    <button type="button" className="button" onClick={() => window.location.reload()}>
      <img src={reload} alt="reloadButton" />
    </button>
    <Board width={15} height={8} />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
