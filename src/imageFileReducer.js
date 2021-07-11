const initialState = {
  image: null
}

export const imageFileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IMAGE': {
      return {
        ...state,
        image: action.payload
      }
    }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}
