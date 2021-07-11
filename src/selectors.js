import { createSelector } from 'reselect'

const drawingSelector = ({ drawing }) => drawing

const presentSelector = createSelector(
  drawingSelector,
  ({ present }) => present
)

export const linesSelector = createSelector(
  presentSelector,
  ({ lines }) => lines
)

export const arrowsSelector = createSelector(
  presentSelector,
  ({ arrows }) => arrows
)

export const rectanglesSelector = createSelector(
  presentSelector,
  ({ rectangles }) => rectangles
)

export const pastHistoryEmpty = createSelector(
  drawingSelector,
  ({ past }) => past.length === 0
)

export const futureHistoryEmpty = createSelector(
  drawingSelector,
  ({ future }) => future.length === 0
)

const toolsSelector = ({ tools }) => tools

export const rectInProgressSelector = createSelector(
  toolsSelector,
  ({ rectangle }) => {
    if (!rectangle) { return null }

    const { strokeWidth, x1, y1, x2, y2 } = rectangle
    return ({
      strokeWidth,
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x1 - x2),
      height: Math.abs(y1 - y2)
    })
  }
)

export const strokeWidthSelector = createSelector(
  toolsSelector,
  ({ strokeWidth }) => strokeWidth
)

export const imageSelector = ({ image: { image } }) => image
