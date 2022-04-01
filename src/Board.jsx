/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40

const Board = ({ width, height }) => {
  const [board, setBoard] = useState([])
  const [snake, setSnake] = useState([])
  const [food, setFood] = useState({ x: 0, y: 0 })
  const [lastKey, setLastKey] = useState()

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
    // Initial snake coordinates
    setSnake([
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
  const checkFood = (head) => {
    // If food coordinates are the same as head coordinates
    if (food.y === head.y && food.x === head.x) {
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
      // Set food in new coordinates
      setFood({ x: 0, y: 0 })
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
        // eslint-disable-next-line no-alert
        alert('you are dead')
      }
      return cell
    })
    snake.push(newHead) // Update snake with new head
  }

  /**
   * Function to change snake current position
   * @param key -> key keyCode
   */
  const updateSnake = (key) => {
    // Move all the values one position
    snake.shift()
    // The last value wont be a head anymore
    snake[snake.length - 1].isHead = false
    // Get new head
    const head = { ...snake[snake.length - 1] }
    head.isHead = true
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

    checkFood(head) // Check if new head is touching food
    setLastKey(key) // Save last keydown
    setSnake([...snake]) // Render DOM
  }

  // Movement
  const moveSnake = (event) => {
    switch (event.keyCode) {
      case RIGHT: {
        if (lastKey !== LEFT) {
          updateSnake(RIGHT)
        }
        break
      }
      case UP: {
        if (lastKey !== DOWN) {
          updateSnake(UP)
        }
        break
      }
      case LEFT: {
        if (lastKey !== RIGHT) {
          updateSnake(LEFT)
        }
        break
      }
      case DOWN: {
        if (lastKey !== UP) {
          updateSnake(DOWN)
        }
        break
      }
      default:
        break
    }
  }

  useEffect(() => {
    // New empty board
    const x = new Array(height)

    for (let i = 0; i < x.length; i += 1) {
      x[i] = new Array(width).fill(-1)
    }

    snake.forEach((item) => {
      x[item.y][item.x] = 1 // 1->Snake
    })

    x[food.y][food.x] = 2 // 2->Snake

    setBoard(x)
  }, [snake])

  return (
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

Board.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Board
