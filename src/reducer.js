import { combineReducers } from 'redux'
import { drawingReducer } from './drawingReducer'
import { toolsReducer } from './toolsReducer'
import { imageFileReducer } from './imageFileReducer'

export const reducer = combineReducers({
  drawing: drawingReducer,
  image: imageFileReducer,
  tools: toolsReducer
})
