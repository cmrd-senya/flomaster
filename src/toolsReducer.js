const initialState = {
  strokeWidth: 4,
  rectangle: null
}

export const toolsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STROKE_WIDTH': 
      return {
        ...state,
        strokeWidth: action.payload 
      }
    case 'START_RECTANGLE': {
      const { strokeWidth, x: x1, y: y1 } = action.payload
      return {
        ...state,
        rectangle: {
          strokeWidth,
          x1, y1
        }
      }
    }
    case 'UPDATE_RECTANGLE_CORNER': {
      const { x: x2, y: y2 } = action.payload
      return {
        ...state,
        rectangle: {
          ...state.rectangle,
          x2, y2
        }
      }
    }
    case 'COMMIT_RECTANGLE': {
      return {
        ...state,
        rectangle: null
      }
    }
    default:
      return state
  }
}
