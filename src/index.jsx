import React from 'react'
import ReactDOM from 'react-dom'
import Board from './Board'
import './index.scss'

const App = () => (
  <>
    <h1>Snake</h1>
    <Board width={10} height={10} />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
