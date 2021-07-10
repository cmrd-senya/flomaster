import { combineReducers } from 'redux'
import { drawingReducer } from './drawingReducer'

export const reducer = combineReducers({
  drawing: drawingReducer
})
