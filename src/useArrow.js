import { useRef, useState } from 'react'

export const useArrow = (imageRef) => {
  const [arrows, setArrows] = useState([])
  const isDrawing = useRef(false)
  
  const arrowInProgress = useArrow(null)

  return {
    arrows,
    arrowInProgress
  }
}