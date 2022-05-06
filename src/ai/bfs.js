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
      distance: 9999,
    }
  }

  // Get distance
  return {
    ...start,
    distance: Math.abs(goal.x - start.x) + Math.abs(goal.y - start.y),
  }
}

const checkPosibleMove = (board, start, goal, iteration) => {
  const { x, y } = start
  const possibleMoves = []

  // Checks all moves
  possibleMoves.push(heuristic(board, { x: x + 1, y }, goal)) // right
  possibleMoves.push(heuristic(board, { x: x - 1, y }, goal)) // left
  possibleMoves.push(heuristic(board, { x, y: y + 1 }, goal)) // up
  possibleMoves.push(heuristic(board, { x, y: y - 1 }, goal)) // down
  return possibleMoves.sort((a, b) => a.distance - b.distance)[iteration]
}

const bfs = (board, snake, food, iteration) => {
  if (!board || !board[0] || !snake || !food) { return -1 }
  const headPos = snake.slice(-1)[0]

  return checkPosibleMove(board, headPos, food, iteration)
}

export default bfs
