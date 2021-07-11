import { combineReducers } from 'redux'
import { drawingReducer } from './drawingReducer'
import { toolsReducer } from './toolsReducer'

export const reducer = combineReducers({
  drawing: drawingReducer,
  tools: toolsReducer
})
