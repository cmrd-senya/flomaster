import { Arrow, Image, Layer, Line, Rect, Stage } from 'react-konva'
import { useBrush } from './useBrush'
import { useArrow } from './useArrow'
import { useRect } from './useRect'
import { useSelector } from 'react-redux'
import {
  arrowsSelector,
  linesSelector,
  rectanglesSelector,
  rectInProgressSelector,
  strokeWidthSelector
} from './selectors'
import { forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'
import { useImageExt } from './useImageExt'

const useTools = (imageRef, settings) => ({
  brush: useBrush(imageRef, settings),
  arrow: useArrow(imageRef, settings),
  rect: useRect(imageRef, settings)
})

export const Drawing = forwardRef(({
  width: canvasWidth,
  height: canvasHeight,
  activeTool
}, stageRef) => {
  const strokeWidth = useSelector(strokeWidthSelector)
  const imageRef = useRef(null)
  const [image, { width, height }] = useImageExt()

  const tools = useTools(imageRef, { strokeWidth })

  const scaleFactor = Math.min(canvasWidth / width, canvasHeight / height)

  const {
    arrow: { arrowInProgress }
  } = tools
  const rectInProgress = useSelector(rectInProgressSelector)
  const lines = useSelector(linesSelector)
  const arrows = useSelector(arrowsSelector)
  const rectangles = useSelector(rectanglesSelector)

  const { handleMouseDown, handleMouseUp, handleMouseMove } = tools[activeTool]

  return (
    <Stage
      ref={stageRef}
      width={canvasWidth}
      height={canvasHeight}
      scaleX={scaleFactor}
      scaleY={scaleFactor}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer>
        <Image ref={imageRef} image={image} />
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#df4b26"
            strokeWidth={line.strokeWidth}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation={
              // line.tool === 'eraser' ? 'destination-out' : 'source-over'
              'source-over'
            }
          />
        ))}
        {arrowInProgress && <Arrow
          points={arrowInProgress.points}
          stroke='red'
          strokeWidth={arrowInProgress.strokeWidth}
        />}
        {arrows.map((arrow, i) => (
          <Arrow
            key={i}
            points={arrow.points}
            stroke='red'
            strokeWidth={arrow.strokeWidth}
          />
        ))}
        {
          rectInProgress && <Rect
            stroke="#df4b26"
            {...rectInProgress}
          />
        }
        {rectangles.map((rectangle, i) => (
          <Rect
            key={i}
            stroke="#df4b26"
            {...rectangle}
          />
        ))}
      </Layer>
    </Stage>
  )
})

Drawing.propTypes = {
  activeTool: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
}
