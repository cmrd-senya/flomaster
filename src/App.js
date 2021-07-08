import './App.css'
import { Image, Layer, Line, Stage } from 'react-konva'
import { useEffect, useRef, useState } from 'react'
import useImage from 'use-image'
import styled from 'astroturf/react'
import PropTypes from 'prop-types'
import { useBrush } from './useBrush'
import { useArrow } from './useArrow'

// function from https://stackoverflow.com/a/15832662/512042
function downloadURI(uri, name) {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height
  }
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      console.log('handleResize')
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

const FlexBox = styled('div')`
  display: flex;
  align-items: center;
`

const ToolbarElement = styled('div')`
  padding: 0 2px;
`

const Tool = ({ id, label, ...inputProps }) => (
  <>
    <input name="tool" type="radio" id={id} value={id} {...inputProps} />
    <label htmlFor={id}>{label}</label>
  </>
)
Tool.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
}

const ToolsList = [
  {
    id: 'brush',
    label: 'Brush'
  },
  {
    id: 'arrow',
    label: 'Arrow'
  }
]

const useTools = (imageRef) => ({
  brush: useBrush(imageRef),
  arrow: useArrow(imageRef)
})

function App() {
  const [activeTool, setActiveTool] = useState(ToolsList[0].id)
  const stageRef = useRef(null)

  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const tools = useTools(imageRef)
  const { brush: { lines } } = tools
  const { width: winWidth, height: winHeight } = useWindowDimensions()
  const canvasWidth = winWidth
  const canvasHeight = winHeight - 50
  const [currentFile, setCurrentFile] = useState(null)
  const [image] = useImage(currentFile)
  const width = (image && image.width) || 100
  const height = (image && image.height) || 100
  const scaleFactor = Math.min(canvasWidth / width, canvasHeight / height)
  const onFileSelect = (event) => {
    const fr = new FileReader()
    fr.onloadend = () => {
      setCurrentFile(fr.result)
    }
    fr.readAsDataURL(event.target.files[0])
  }

  console.log('canvasWidth', canvasWidth)
  console.log('canvasHeight', canvasHeight)

  const setCanvas = (val) => {
    console.log('render canvas', val)
    canvasRef.current = val
  }

  const { handleMouseDown, handleMouseUp, handleMouseMove } = tools[activeTool]

  const onSave = () => {
    downloadURI(stageRef.current.toDataURL(), 'flomaster-image.png')
  }

  const onClear = () => {
    setCurrentFile(null)
    Object.values(tools).forEach(({ clear }) => clear())
  }

  const onToolChange = ({ target: { value } }) => {
    console.log(value)
    setActiveTool(value)
  }

  return (
    <div className="App">
      <div>
        <input type="file" onChange={onFileSelect} />
      </div>
      <FlexBox>
        <ToolbarElement>
          <button onClick={onSave}>Export</button>
        </ToolbarElement>
        <ToolbarElement>
          <button onClick={onClear}>Reset</button>
        </ToolbarElement>
        <ToolbarElement>
          <FlexBox>
          Tools:
            <div>
              {
                ToolsList.map(({ id, label }) => (
                  <Tool
                    key={id}
                    id={id}
                    label={label}
                    checked={id === activeTool}
                    onChange={onToolChange}
                  />
                ))
              }
            </div>
          </FlexBox>
        </ToolbarElement>
      </FlexBox>

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
        <Layer ref={setCanvas}>
          <Image ref={imageRef} image={image} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                // line.tool === 'eraser' ? 'destination-out' : 'source-over'
                'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default App
