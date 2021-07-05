import './App.css'
import {Image, Layer, Stage} from 'react-konva'
import {useEffect, useRef, useState} from 'react'
import useImage from 'use-image'

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

  return (
    <div className="App">
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        scaleX={scaleFactor}
        scaleY={scaleFactor}
      >
        <Layer ref={setCanvas}>
          <Image ref={imageRef} image={image} />
        </Layer>
      </Stage>
      <input type="file" onChange={onFileSelect} />
    </div>
  )
}

export default App
