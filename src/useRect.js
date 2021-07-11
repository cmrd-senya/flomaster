import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { commitRectangle, startRectangle, updateRectangleCorner } from './actions'
import { rectInProgressSelector } from './selectors'

export const useRect = (imageRef, { strokeWidth }) => {
  const dispatch = useDispatch()
  const isDrawing = useRef(false)
  const rectInProgress = useSelector(rectInProgressSelector)

  const handleMouseDown = () => {
    isDrawing.current = !isDrawing.current

    if (!isDrawing.current) {
      dispatch(commitRectangle(rectInProgress))
      return
    }

    const pos = imageRef.current.getRelativePointerPosition()
    dispatch(startRectangle({
      x: pos.x,
      y: pos.y,
      strokeWidth
    }))
  }

  const handleMouseMove = () => {
    // no drawing - skipping
    if (!isDrawing.current) { return }
    const point = imageRef.current.getRelativePointerPosition()

    dispatch(updateRectangleCorner(point))
  }

  return {
    handleMouseDown,
    handleMouseMove
  }
}
