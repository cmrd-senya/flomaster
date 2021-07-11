const initialState = {
  past: [],
  present: {
    arrows: [],
    lines: []
  },
  future: []
}

const startNewHistoryPoint = (state, newPresent) => ({
  past: [
    ...state.past.slice(-10),
    state.present
  ],
  present: newPresent,
  future: []
})

export const drawingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_LINE': {
      return startNewHistoryPoint(state, {
        ...state.present,
        lines: [
          ...state.present.lines,
          action.payload
        ]
      })
    }
    case 'ADD_LINE_POINT': {
      const lastLine = state.present.lines[state.present.lines.length - 1]

      return {
        ...state,
        present: {
          ...state.present,
          lines: [
            ...state.present.lines.slice(0, -1),
            {
              ...lastLine,
              points: [
                ...lastLine.points,
                ...action.payload
              ]
            }
          ]
        }
      }
    }
    case 'ADD_ARROW': {
      return startNewHistoryPoint(state, {
        ...state.present,
        arrows: [
          ...state.present.arrows,
          action.payload
        ]
      })
    }
    case 'UNDO': {
      if (state.past.length === 0) { return state }
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [
          state.present,
          ...state.future
        ]
      }
    }
    case 'REDO': {
      if (state.future.length === 0) { return state }
      return {
        past: [
          ...state.past,
          state.present
        ],
        present: state.future[0],
        future: state.future.splice(1)
      }
    }
    case 'CLEAR': {
      return initialState
    }
    default:
      return state
  }
}
