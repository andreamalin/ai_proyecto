import React from 'react'
import ReactDOM from 'react-dom'
import Board from './Board'

const App = () => (
  <>
    <h1>Snake</h1>
    <Board width={15} height={8} />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
