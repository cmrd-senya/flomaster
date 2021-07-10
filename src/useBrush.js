import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addLinePoint, startLine } from './actions'

export const useBrush = (imageRef, { strokeWidth }) => {
  const dispatch = useDispatch()
  const isDrawing = useRef(false)

  const handleMouseDown = () => {
    isDrawing.current = true
    const pos = imageRef.current.getRelativePointerPosition()
    dispatch(startLine({ points: [pos.x, pos.y], strokeWidth }))
  }

  const handleMouseMove = () => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return
    }
    const point = imageRef.current.getRelativePointerPosition()

    dispatch(addLinePoint([point.x, point.y]))
  }

  const handleMouseUp = () => {
    isDrawing.current = false
  }

  const clear = () => {
    // TODO: remove
  }

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clear
  }
}
