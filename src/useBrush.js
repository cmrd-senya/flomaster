import { useRef, useState } from 'react'

export const useBrush = (imageRef) => {
  const [lines, setLines] = useState([])
  const isDrawing = useRef(false)

  const handleMouseDown = () => {
    isDrawing.current = true
    const pos = imageRef.current.getRelativePointerPosition()
    setLines([...lines, {  points: [pos.x, pos.y] }])
  }

  const handleMouseMove = () => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return
    }
    const point = imageRef.current.getRelativePointerPosition()
    let lastLine = lines[lines.length - 1]
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y])

    // replace last
    lines.splice(lines.length - 1, 1, lastLine)
    setLines(lines.concat())
  }

  const handleMouseUp = () => {
    isDrawing.current = false
  }

  const clear = () => {setLines([])}

  return {
    lines,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clear
  }
}
