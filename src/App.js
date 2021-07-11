import { Arrow, Image, Layer, Line, Stage } from 'react-konva'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useImage from 'use-image'
import { useBrush } from './useBrush'
import { useArrow } from './useArrow'
import { Header, ToolsList } from './Header'
import { reducer } from './reducer'
import { createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { arrowsSelector, linesSelector } from './selectors'
import { clear } from './actions'

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

const useTools = (imageRef, settings) => ({
  brush: useBrush(imageRef, settings),
  arrow: useArrow(imageRef, settings)
})

const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const Wrapper = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
)
Wrapper.propTypes = {
  children: PropTypes.Node
}

const Main = () => {
  const dispatch = useDispatch()
  const [activeTool, setActiveTool] = useState(ToolsList[0].id)
  const [strokeWidth, setStrokeWidth] = useState(4)
  const stageRef = useRef(null)

  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const headerRef = useRef(null)
  const tools = useTools(imageRef, { strokeWidth })
  const {
    arrow: { arrowInProgress }
  } = tools
  const lines = useSelector(linesSelector)
  const arrows = useSelector(arrowsSelector)
  const { width: winWidth, height: winHeight } = useWindowDimensions()
  const canvasWidth = winWidth
  const [initialHeaderSize, setInitialHeaderSize] = useState(0)
  const headerSize = (headerRef.current && headerRef.current.offsetHeight) || initialHeaderSize
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

  console.log('canvasWidth', canvasWidth)
  console.log('canvasHeight', canvasHeight)

  useLayoutEffect(() => {
    setInitialHeaderSize(headerRef.current.offsetHeight)
  }, [])

  const setCanvas = (val) => {
    // console.log('render canvas', val)
    canvasRef.current = val
  }

  const { handleMouseDown, handleMouseUp, handleMouseMove } = tools[activeTool]

  const onSave = () => {
    downloadURI(stageRef.current.toDataURL(), 'flomaster-image.png')
  }

  const onClear = () => {
    if (!confirm('This will clear your canvas. U sure?')) {
      return
    }
    setCurrentFile(null)
    dispatch(clear())
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
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        onFileSelect={onFileSelect}
        onClear={onClear}
        onToolChange={onToolChange}
        onSave={onSave}
        imageWidth={width}
        imageHeight={height}
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
        </Layer>
      </Stage>
    </div>
  )
}

const App = () => (
  <Wrapper>
    <Main />
  </Wrapper>
)

export default App
