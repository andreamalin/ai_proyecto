import React from 'react'
import ReactDOM from 'react-dom'
import Board from './Board'
import './index.scss'

const App = () => (
  <>
    <h1>Snake</h1>
    <Board width={20} height={20} />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
