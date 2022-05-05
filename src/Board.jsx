/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import bfs from './ai/bfs'
import sleep from './utils/others'
import Modal from './modal'
import './index.scss'

const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40

const Board = ({ width, height }) => {
  const [board, setBoard] = useState([])
  const [realSnake, setRealSnake] = useState([])
  const [snakeCopy, setSnakeCopy] = useState([])

  const [food, setFood] = useState({ x: 0, y: 0 })
  const [lastKey, setLastKey] = useState()
  const [hasLost, setHasLost] = useState(false)
  const [score, setScore] = useState(0)
  const [counter, setCounter] = useState(0)

  // Fill new board
  useEffect(() => {
    // Fill board with -1 values
    const x = new Array(height)
    for (let i = 0; i < x.length; i += 1) {
      x[i] = new Array(width).fill(-1)
    }

    // Initial pos will be the center of the board
    const initialPos = Math.ceil(height / 2)

    x[initialPos].fill(1, 2, 6) // 1->Snake
    x[initialPos][width - 4] = 2 // 2->Apple

    // Initial food values
    setFood({ x: width - 4, y: initialPos })
    window.food = [width - 4, initialPos]
    // Initial snake coordinates
    setRealSnake([
      {
        x: 2,
        y: initialPos,
        isHead: false,
        direction: 'right',
      },
      {
        x: 3,
        y: initialPos,
        isHead: false,
        direction: 'right',
      },
      {
        x: 4,
        y: initialPos,
        isHead: false,
        direction: 'right',
      },
      {
        x: 5,
        y: initialPos,
        isHead: true,
        direction: 'right',
      },
    ])
    // Initial snake coordinates
    setSnakeCopy([
      {
        x: 2,
        y: initialPos,
        isHead: false,
        direction: 'right',
      },
      {
        x: 3,
        y: initialPos,
        isHead: false,
        direction: 'right',
      },
      {
        x: 4,
        y: initialPos,
        isHead: false,
        direction: 'right',
      },
      {
        x: 5,
        y: initialPos,
        isHead: true,
        direction: 'right',
      },
    ])
    // Set complete board
    setBoard(x)
  }, [])

  /**
   * Function to check if head is on food position
   * @param head -> snake head
   */
  const checkFood = (head, snake, isReal) => {
    // If food coordinates are the same as head coordinates
    if (food.y === head.y && food.x === head.x) {
      if (!hasLost) setScore(score + 1)

      // Get tail
      const tail = { ...snake[0] }
      // Add a new value at the first position of the snake (new tail)
      let xMove
      let yMove
      if (tail.direction === 'right') {
        xMove = tail.x - 1
      } else if (tail.direction === 'left') {
        xMove = tail.x + 1
      } else {
        xMove = tail.x
      }

      if (tail.direction === 'up') {
        yMove = tail.y + 1
      } else if (tail.direction === 'down') {
        yMove = tail.y - 1
      } else {
        yMove = tail.y
      }
      snake.unshift({
        x: xMove,
        y: yMove,
        isHead: false,
        direction: tail.direction,
      })
      if (isReal) {
        setRealSnake([...snake]) // Render DOM
      } else {
        setSnakeCopy([...snake]) // Render DOM
      }

      if (isReal) {
        // Set food in new coordinates
        let isSet = false
        while (!isSet) {
          const xVal = Math.floor(Math.random() * board[0].length)
          const yVal = Math.floor(Math.random() * board.length)
          const inSnake = []
          snake.forEach((square, index) => {
            if (square.x === xVal && square.y === yVal) {
              inSnake[index] = true
            } else {
              inSnake[index] = false
            }
          })
          if (!inSnake.includes(true)) {
            isSet = true
            setFood({ x: xVal, y: yVal })
          }
        }
      }
    }
  }

  /**
   * Function to check if new head is toching the snake body
   * @param newHead newHead position
   * @param snakeBody snake body position
   */
  const checkDeath = (newHead, snakeBody) => {
    snakeBody.map((cell) => {
      if (newHead.x === cell.x && newHead.y === cell.y) {
        // eslint-disable-next-line no-console
        setHasLost(true)
      }
      return cell
    })
  }

  /**
   * Function to check if the border was touched
   * @param key direction pressed
   * @param head current head
   */
  const checkBorder = (key, head) => {
    switch (key) {
      case RIGHT:
        // eslint-disable-next-line no-alert
        if (head.x + 1 >= board[0].length) {
          // eslint-disable-next-line no-console
          setHasLost(true)
        }
        break
      case LEFT:
        // eslint-disable-next-line no-alert
        if (head.x - 1 < 0) {
          // eslint-disable-next-line no-console
          setHasLost(true)
        }
        break
      case UP:
        // eslint-disable-next-line no-alert
        if (head.y - 1 < 0) {
          // eslint-disable-next-line no-console
          setHasLost(true)
        }

        break
      case DOWN:
        // eslint-disable-next-line no-alert
        if (head.y + 1 >= board.length) {
          // eslint-disable-next-line no-console
          setHasLost(true)
        }
        break
      default:
        break
    }
  }

  /**
   * Function to change snake current position
   * @param key -> key keyCode
   */
  const updateSnake = (key, snake, isReal) => {
    // Move all the values one position
    snake.shift()
    // The last value wont be a head anymore
    // eslint-disable-next-line no-param-reassign
    snake[snake.length - 1].isHead = false
    // Get new head
    const head = { ...snake[snake.length - 1] }
    head.isHead = true

    checkBorder(key, head)
    // Depending the key update coordinate of new head
    switch (key) {
      case RIGHT:
        head.x += 1
        head.direction = 'right'
        break
      case LEFT:
        head.x -= 1
        head.direction = 'left'
        break
      case UP:
        head.y -= 1
        head.direction = 'up'
        break
      case DOWN:
        head.y += 1
        head.direction = 'down'
        break
      default:
        break
    }

    checkDeath(head, snake) // check if snake is toching the body
    snake.push(head) // Update snake with new head

    checkFood(head, snake, isReal) // Check if new head is touching food
    setLastKey(key) // Save last keydown
  }

  // Movement
  const moveSnake = (event, snake, isReal = false) => {
    switch (event.keyCode) {
      case RIGHT: {
        if (lastKey !== LEFT) {
          updateSnake(RIGHT, snake, isReal)
        }
        break
      }
      case UP: {
        if (lastKey !== DOWN) {
          updateSnake(UP, snake, isReal)
        }
        break
      }
      case LEFT: {
        if (lastKey !== RIGHT) {
          updateSnake(LEFT, snake, isReal)
        }
        break
      }
      case DOWN: {
        if (lastKey !== UP) {
          updateSnake(DOWN, snake, isReal)
        }
        break
      }
      default:
        break
    }
  }

  const updateBoard = (snake) => {
    if (hasLost) return
    // New empty board
    const x = new Array(height)

    for (let i = 0; i < x.length; i += 1) {
      x[i] = new Array(width).fill(-1)
    }

    snake.forEach((item) => {
      x[item.y][item.x] = 1 // 1->Snake
    })

    x[food.y][food.x] = 2 // 2->Snake

    // eslint-disable-next-line consistent-return
    return x
  }

  const ai = (snake) => {
    if (hasLost) return

    const nextMove = bfs(updateBoard(snake), snake, food)
    if (nextMove.distance === 9999) setHasLost(true)
    if (nextMove === -1) return
    const head = snake.slice(-1)[0]
    let action = -1

    // Gets the move key
    if (nextMove.x - head.x < 0) { // right
      action = LEFT
    } else if (nextMove.x - head.x > 0) { // left
      action = RIGHT
    } else if (nextMove.y - head.y < 0) { // up
      action = UP
    } else if (nextMove.y - head.y > 0) { // down
      action = DOWN
    }

    if (action === -1) {
      // eslint-disable-next-line no-console
      console.log('action -1')
      return
    }

    moveSnake({ keyCode: action }, snake)
    // eslint-disable-next-line consistent-return
    return action
  }

  useEffect(() => {
    if (snakeCopy?.slice(-1)[0]) {
      const keys = []
      for (let i = 0; i < 100; i += 1) {
        keys.push(ai(snakeCopy))
        setSnakeCopy([...snakeCopy]) // Render DOM
        if (food.y === snakeCopy.slice(-1)[0].y && food.x === snakeCopy.slice(-1)[0].x) {
          break
        }
      }

      for (let i = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line no-loop-func
        sleep(20).then(() => {
          moveSnake({ keyCode: keys[i] }, realSnake, true)
          setRealSnake([...realSnake]) // Render DOM
          setBoard(updateBoard(realSnake))
        })
      }
    }
  }, [food])

  return (
    <>
      {
      hasLost ? <Modal width={width * 50} height={height * 50} score={score} />
        : (
          <div className="board" onKeyDown={moveSnake} tabIndex="0">
            {board?.map((row, rowIndex) => (
              <div className="row" key={`row-${rowIndex}`}>
                {row?.map((cell, cellIndex) => (
                  <>
                    {cell === 1
                      ? <div className="snake" key={`cell-${rowIndex}-${cellIndex}`} />
                      : <></>}

                    {cell === 2
                      ? <div className="cell" key={`cell-${rowIndex}-${cellIndex}`}><div className="apple" /></div>
                      : <></>}

                    {cell === -1
                      ? <div className="cell" key={`cell-${rowIndex}-${cellIndex}`} />
                      : <></>}
                  </>
                ))}
              </div>
            ))}
          </div>
        )
    }
    </>
  )
}

Board.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Board
