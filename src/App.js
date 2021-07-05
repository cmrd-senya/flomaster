import './App.css'
import {Image, Layer, Stage} from 'react-konva'
import {useEffect, useRef, useState} from 'react'
import useImage from 'use-image'

function App() {
  const canvasRef = useRef(null)
  const { innerWidth: winWidth, innerHeight: winHeight } = window
  const [currentFile, setCurrentFile] = useState(null)
  const [image] = useImage(currentFile)
  const width = (image && image.width) || 100
  const height = (image && image.height) || 100
  const onFileSelect = (event) => {
    const fr = new FileReader()
    fr.onloadend = () => {
      setCurrentFile(fr.result)
    }
    fr.readAsDataURL(event.target.files[0])
  }

  useEffect(() => {
    if (canvasRef.current) {
      const scaleFactor = winWidth / width
      const ctx = canvasRef.current.getContext('2d')
      ctx.scale(scaleFactor,scaleFactor)
    }
  }, [width, winWidth])

  return (
    <div className="App">
      <Stage width={width} height={height}>
        <Layer ref={canvasRef}>
          <Image image={image} />
        </Layer>
      </Stage>
      <input type="file" onChange={onFileSelect} />
    </div>
  )
}

export default App
