/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */
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
  console.time('startTiming')

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
    setCounter(1)
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
  const checkDeath = (newHead, snakeBody, isReal) => {
    snakeBody.map((cell) => {
      if (newHead.x === cell.x && newHead.y === cell.y) {
        if (isReal) {
          console.timeEnd('startTiming')
          setHasLost(true)
        }
      }
      return cell
    })
  }

  /**
   * Function to check if the border was touched
   * @param key direction pressed
   * @param head current head
   */
  const checkBorder = (key, head, isReal) => {
    switch (key) {
      case RIGHT:
        if (head.x + 1 >= board[0].length) {
          if (isReal) {
            console.timeEnd('startTiming')
            setHasLost(true)
          }
        }
        break
      case LEFT:
        if (head.x - 1 < 0) {
          if (isReal) {
            console.timeEnd('startTiming')
            setHasLost(true)
          }
        }
        break
      case UP:
        if (head.y - 1 < 0) {
          if (isReal) {
            console.timeEnd('startTiming')
            setHasLost(true)
          }
        }

        break
      case DOWN:
        if (head.y + 1 >= board.length) {
          if (isReal) {
            console.timeEnd('startTiming')
            setHasLost(true)
          }
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

    checkBorder(key, head, isReal)
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

    checkDeath(head, snake, isReal) // check if snake is toching the body
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
        alert('stop')
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

  /**
   * This functions checks in all directions to find the concentration of snake
   * @param head -> Snake Head
   */
  const checkSnakeDispersion = (snakeToCheck, keys) => {
    const copyBoard = updateBoard(snakeToCheck)
    const copyHead = snakeToCheck.slice(-1)[0]

    const snakeHeadX = copyHead.x
    const snakeHeadY = copyHead.y

    /* Conseguir proporcion de cantidad de serpiente y espacios libres,
      vertical, horizontal y en cuadrantes. */
    /* On tuple, x = snake, y = board */
    const above = [0, 0, 0]
    const below = [0, 0, 0]
    const right = [0, 0, 0]
    const left = [0, 0, 0]
    copyBoard.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (rowIndex < snakeHeadY) {
          if (cell === 1) {
            above[0] += (20 + 30 * Math.random()) + Math.abs(snakeHeadY - rowIndex)
          } else {
            if (cell === 2) {
              above[1] += 20
            }
            above[1] += 1
          }
          if (columnIndex < snakeHeadX) {
            if (cell === 1) {
              left[0] += (20 + 30 * Math.random()) + Math.abs(snakeHeadX - columnIndex)
            } else {
              if (cell === 2) {
                left[1] += 20
              }
              left[1] += 1
            }
          } else if (columnIndex > snakeHeadX) {
            if (cell === 1) {
              right[0] += (20 + 30 * Math.random()) + Math.abs(snakeHeadX - columnIndex)
            } else {
              if (cell === 2) {
                right[1] += 20
              }
              right[1] += 1
            }
          }
        } else if (rowIndex > snakeHeadY) {
          if (cell === 1) {
            below[0] += (20 + 30 * Math.random()) + Math.abs(snakeHeadY - rowIndex)
          } else {
            if (cell === 2) {
              below[1] += 20
            }
            below[1] += 1
          }
          if (columnIndex < snakeHeadX) {
            if (cell === 1) {
              left[0] += (20 + 30 * Math.random()) + Math.abs(snakeHeadX - columnIndex)
            } else {
              if (cell === 2) {
                left[1] += 20
              }
              left[1] += 1
            }
          } else if (columnIndex > snakeHeadX) {
            if (cell === 1) {
              right[0] += (20 + 30 * Math.random()) + Math.abs(snakeHeadX - columnIndex)
            } else {
              if (cell === 2) {
                right[1] += 20
              }
              right[1] += 1
            }
          }
        }
      })
    })
    above[2] = 3 * above[1] - 2.5 * above[0]
    below[2] = 3 * below[1] - 2.5 * below[0]
    right[2] = 3 * right[1] - 2.5 * right[0]
    left[2] = 3 * left[1] - 2.5 * left[0]

    console.log('above', above[2])
    console.log('below', below[2])
    console.log('right', right[2])
    console.log('left', left[2])
    // retornando la prioridad de la primera tecla a ejecutar
    if (keys[0] === UP) {
      return above[2]
    } if (keys[0] === DOWN) {
      return below[2]
    } if (keys[0] === LEFT) {
      return left[2]
    } if (keys[0] === RIGHT) {
      return right[2]
    }
  }

  const ai = (snake, current) => {
    if (hasLost) return

    const nextMove = bfs(updateBoard(snake), snake, food, current)
    if (!nextMove || nextMove.distance === 9999) return true

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
      // eslint-disable-next-line consistent-return
      return -1
    }

    moveSnake({ keyCode: action }, snake, false)
    // eslint-disable-next-line consistent-return
    return action
  }

  useEffect(async () => {
    const snakeCopy1 = [...snakeCopy]
    const snakeCopy2 = [...snakeCopy]
    const snakeCopy3 = [...snakeCopy]

    if (snakeCopy?.slice(-1)[0] && !hasLost) {
      let tryHasLost = false
      let keys = []
      const keys1 = []
      const keys2 = []
      const keys3 = []

      // Realizando los 3 posibles caminos
      for (let j = 0; j < 3; j += 1) {
        // Revisando las siguientes 5 iteraciones
        for (let i = 0; i < 8; i += 1) {
          // Creando las 3 posibles copias de la serpiente
          if (j === 0) {
            keys1.push(ai(snakeCopy1, j))
            if (food.y === snakeCopy1.slice(-1)[0].y && food.x === snakeCopy1.slice(-1)[0].x) {
              break
            }
          }
          if (j === 1) {
            keys2.push(ai(snakeCopy2, j))
            if (food.y === snakeCopy2.slice(-1)[0].y && food.x === snakeCopy2.slice(-1)[0].x) {
              break
            }
          }
          if (j === 2) {
            keys3.push(ai(snakeCopy3, j))
            if (food.y === snakeCopy3.slice(-1)[0].y && food.x === snakeCopy3.slice(-1)[0].x) {
              break
            }
          }
        }
      }

      /*
       Si incluye un true significa que la serpiente muere en cierto punto,
       por lo que elegimos la siguiente posible respuesta
       */
      const possibleKeys = []
      if (!keys1.includes(true)) {
        console.log('keys1', keys1)
        possibleKeys.push({
          snake: snakeCopy1,
          keys: keys1,
          score: checkSnakeDispersion(snakeCopy1, keys1),
        })
      }
      if (!keys2.includes(true)) {
        console.log('keys2', keys2)
        possibleKeys.push({
          snake: snakeCopy2,
          keys: keys2,
          score: checkSnakeDispersion(snakeCopy2, keys2),
        })
      }
      if (!keys3.includes(true)) {
        console.log('keys3', keys3)
        possibleKeys.push({
          snake: snakeCopy3,
          keys: keys3,
          score: checkSnakeDispersion(snakeCopy3, keys3),
        })
      }

      console.log(possibleKeys)

      if (possibleKeys.length === 0) {
        // si ninguna de las 3 sirve, la serpiente ha perdido
        tryHasLost = true

        console.timeEnd('startTiming')
        setHasLost(true)
      } else {
        for (let k = 0; k < possibleKeys.length; k += 1) {
          if (possibleKeys[k].keys.length < 8) {
            console.log('ENTRA EN MENOS DE 8 KEYS', possibleKeys[k].keys)
            setSnakeCopy([...possibleKeys[k].snake])
            keys = possibleKeys[k].keys
            break
          }
        }
        if (keys.length === 0) {
          // obtener el path donde la primera tecla tenga el mejor score
          const higherValue = possibleKeys.reduce(
            (prev, current) => ((prev.score > current.score) ? prev : current), 1,
          )
          console.log('higherValue', higherValue.score)
          setSnakeCopy([...higherValue.snake])
          keys = higherValue.keys
          // console.log('keys', keys)
        }
      }

      // Si no ha muerto, movemos la serpiente real
      if (!tryHasLost) {
        for (let i = 0; i < keys.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(15)
          moveSnake({ keyCode: keys[i] }, realSnake, true)
          setRealSnake([...realSnake]) // Render DOM
          setBoard(updateBoard(realSnake))
        }
      }
      if (!tryHasLost) setCounter(counter + 1)
    }
  }, [counter])

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
