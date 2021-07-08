import { useRef, useState } from 'react'

export const useArrow = (imageRef, { strokeWidth }) => {
  const [arrows, setArrows] = useState([])
  const isDrawing = useRef(false)
  
  const [arrowInProgress, setArrowInProgress] = useState(null)

  const handleMouseDown = () => {
    isDrawing.current = !isDrawing.current

    if (!isDrawing.current) {
      setArrows([
        ...arrows,
        arrowInProgress
      ])
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
    arrows,
    arrowInProgress,
    handleMouseDown,
    handleMouseMove,
    clear: () =>{
      setArrows([])
    }
  }
}
