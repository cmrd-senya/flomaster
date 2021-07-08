import { Arrow, Image, Layer, Line, Stage } from 'react-konva'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useImage from 'use-image'
import { useBrush } from './useBrush'
import { useArrow } from './useArrow'
import { Header, ToolsList } from './Header'

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

const useTools = (imageRef) => ({
  brush: useBrush(imageRef),
  arrow: useArrow(imageRef)
})

function App() {
  const [headerSize, setHeaderSize] = useState(49)
  const [activeTool, setActiveTool] = useState(ToolsList[0].id)
  const stageRef = useRef(null)

  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const headerRef = useRef(null)
  const tools = useTools(imageRef)
  const {
    brush: { lines },
    arrow: { arrowInProgress, arrows }
  } = tools
  const { width: winWidth, height: winHeight } = useWindowDimensions()
  const canvasWidth = winWidth
  const canvasHeight = winHeight - headerSize
  const [currentFile, setCurrentFile] = useState(null)
  const [image] = useImage(currentFile)
  const width = (image && image.width) || 1000
  const height = (image && image.height) || 1000
  const scaleFactor = Math.min(canvasWidth / width, canvasHeight / height)
  const onFileSelect = (event) => {
    const fr = new FileReader()
    fr.onloadend = () => {
      setCurrentFile(fr.result)
    }
    fr.readAsDataURL(event.target.files[0])
  }

  useLayoutEffect(() => {
    console.log('header size', headerRef.current.offsetHeight)
    setHeaderSize(headerRef.current.offsetHeight)
  }, [])

  console.log('canvasWidth', canvasWidth)
  console.log('canvasHeight', canvasHeight)

  const setCanvas = (val) => {
    // console.log('render canvas', val)
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
    <div>
      <Header
        ref={headerRef}
        activeTool={activeTool}
        onFileSelect={onFileSelect}
        onClear={onClear}
        onToolChange={onToolChange}
        onSave={onSave}
      />

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
          {arrowInProgress && <Arrow
            points={arrowInProgress.points}
            stroke='red'
            strokeWidth={10}
          />}
          {arrows.map((arrow, i) => (
            <Arrow
              key={i}
              points={arrow.points}
              stroke='red'
              strokeWidth={10}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default App
