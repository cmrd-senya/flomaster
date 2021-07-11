export const startLine = (payload) => ({
  type: 'START_LINE',
  payload
})

export const addLinePoint = (payload) => ({
  type: 'ADD_LINE_POINT',
  payload
})

export const addArrow = (payload) => ({
  type: 'ADD_ARROW',
  payload
})

export const startRectangle = (payload) => ({
  type: 'START_RECTANGLE',
  payload
})

export const updateRectangleCorner = (payload) => ({
  type: 'UPDATE_RECTANGLE_CORNER',
  payload
})

export const commitRectangle = (payload) => ({
  type: 'COMMIT_RECTANGLE',
  payload
})

export const undo = () => ({
  type: 'UNDO'
})

export const redo = () => ({
  type: 'REDO'
})

export const clear = () => ({
  type: 'CLEAR'
})
