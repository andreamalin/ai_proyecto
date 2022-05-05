const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40
const INF = 9999
// const MAX_CHECKS = 10

const checkInBoard = (point, board) => {
  const { x, y } = point
  if (x < 0 || y < 0) return false
  if (x >= board[0].length || y >= board.length) return false
  return true
}

const checkIsSnake = (point, board) => {
  const { x, y } = point
  if (board[y][x] === 1) return true
  return false
}

const heuristic = (board, start, goal) => {
  if (!start || !goal || !board) return 0

  // Check if its wall or
  if (!checkInBoard(start, board) || checkIsSnake(start, board)) {
    return {
      ...start,
      distance: INF,
    }
  }

  // Get distance
  return {
    ...start,
    distance: Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y),
  }
}

const checkVertical = (board, start, direction = UP) => {
  const aux = direction === UP ? -1 : 1
  let currentPos = start
  let movesAvailables = 0
  while (true) {
    if (!checkInBoard(currentPos, board) || checkIsSnake(currentPos, board)) {
      return movesAvailables
    }
    currentPos = { ...currentPos, y: currentPos.y + aux }
    movesAvailables += 1
  }
}

const checkHorizontal = (board, start, direction = LEFT) => {
  const aux = direction === LEFT ? -1 : 1
  let currentPos = start
  let movesAvailables = 0
  while (true) {
    if (!checkInBoard(currentPos, board) || checkIsSnake(currentPos, board)) {
      return movesAvailables
    }
    currentPos = { ...currentPos, x: currentPos.x + aux }
    movesAvailables += 1
  }
}

const checkPosibleMove = (board, start, goal, lastMove, getInt) => {
  const { x, y } = start
  const possibleMoves = []

  // Checks all moves
  possibleMoves.push(heuristic(board, { x: x + 1, y }, goal)) // right
  possibleMoves.push(heuristic(board, { x: x - 1, y }, goal)) // left
  possibleMoves.push(heuristic(board, { x, y: y + 1 }, goal)) // up
  possibleMoves.push(heuristic(board, { x, y: y - 1 }, goal)) // down

  if (lastMove) {
    if ((lastMove === RIGHT && possibleMoves[0].distance === INF
      && checkInBoard(possibleMoves[2], board))
    || (lastMove === LEFT && possibleMoves[1].distance === INF
      && checkInBoard(possibleMoves[1], board))) { // right
      const upSpaces = checkVertical(board, start, UP)
      const downSpaces = checkVertical(board, start, DOWN)
      if (upSpaces < downSpaces) {
        return possibleMoves[2]
      }
      return possibleMoves[3]
    }
    if ((lastMove === DOWN && possibleMoves[2].distance === INF
      && checkInBoard(possibleMoves[2], board))
    || (lastMove === UP && possibleMoves[3].distance === INF
      && checkInBoard(possibleMoves[3], board))) {
      const leftSpaces = checkHorizontal(board, start, LEFT)
      const rightSpaces = checkHorizontal(board, start, RIGHT)
      if (leftSpaces < rightSpaces) {
        return possibleMoves[0]
      }
      return possibleMoves[1]
    }
  }

  return possibleMoves.sort((a, b) => a.distance - b.distance)[getInt]
}

const bfs = (board, snake, food, lastMove, getInt = 0) => {
  if (!board || !board[0] || !snake || !food) { return -1 }
  const headPos = snake.slice(-1)[0]
  return checkPosibleMove(board, headPos, food, lastMove, getInt)
}

export default bfs
