export const getPath = (board) => {
  // Verify that has path
  if (!board[0]) { return -1 }

  const path = []
  const hamiltoninPath = {}
  // board.length y size
  // board[0].length x size

  // Gets first line
  for (let i = 0; i < board.length; i += 1) {
    path.push([0, i])
  }

  // Gets the rest of the path
  for (let i = board.length - 1; i > 0; i -= 2) {
    for (let j = 1; j < board[0].length; j += 1) {
      path.push([j, i])
    }

    for (let k = board[0].length - 1; k > 0; k -= 1) {
      path.push([k, i - 1])
    }
  }

  let key = path.slice(-1)[0]
  path.forEach((element) => {
    hamiltoninPath[`${key[0]}-${key[1]}`] = {
      x: element[0],
      y: element[1],
    }
    key = element
  })
  return hamiltoninPath
}

export const getMove = (path, snake) => {
  if (path === -1 || !snake || snake.length === 0) { return -1 }
  const key = snake.slice(-1)[0]
  const next = path[`${key.x}-${key.y}`]
  return next || -1
}
