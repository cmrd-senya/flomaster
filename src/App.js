import './App.css'
import {Image, Layer, Line, Stage} from 'react-konva'
import {useEffect, useRef, useState} from 'react'
import useImage from 'use-image'

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

function App() {
  const [lines, setLines] = useState([])
  const isDrawing = useRef(false)

  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
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

  const onSave = () => {
    downloadURI(stageRef.current.toDataURL(), 'flomaster-image.png')
  }

  return (
    <div className="App">
      <div>
        <input type="file" onChange={onFileSelect} />
      </div>
      <button onClick={onSave}>Save</button>

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
