import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addArrow } from './actions'

export const useArrow = (imageRef, { strokeWidth }) => {
  const dispatch = useDispatch()
  const isDrawing = useRef(false)

  // tools reducers?
  const [arrowInProgress, setArrowInProgress] = useState(null)

  const handleMouseDown = () => {
    isDrawing.current = !isDrawing.current

    if (!isDrawing.current) {
      dispatch(addArrow(arrowInProgress))
      setArrowInProgress(null)
      return
    }

    const pos = imageRef.current.getRelativePointerPosition()
    setArrowInProgress({  points: [pos.x, pos.y], strokeWidth })
  }

  const handleMouseMove = () => {
    // no drawing - skipping
    if (!isDrawing.current) { return }
    const point = imageRef.current.getRelativePointerPosition()

    setArrowInProgress((previous) => ({
      strokeWidth,
      points: [
        previous.points[0], previous.points[1],
        point.x, point.y
      ]
    }))
  }

  return {
    arrowInProgress,
    handleMouseDown,
    handleMouseMove
  }
}
