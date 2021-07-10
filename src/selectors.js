import { createSelector } from 'reselect'

const drawingSelector = ({ drawing }) => drawing

export const linesSelector = createSelector(
  drawingSelector,
  ({ present: { lines } }) => lines
)

export const pastHistoryEmpty = createSelector(
  drawingSelector,
  ({ past }) => past.length === 0
)

export const futureHistoryEmpty = createSelector(
  drawingSelector,
  ({ future }) => future.length === 0
)
