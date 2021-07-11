import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Header, ToolsList } from './Header'
import { reducer } from './reducer'
import { createStore } from 'redux'
import { Provider, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { clear, setImage } from './actions'
import { Drawing } from './Drawing'
import { useImageExt } from './useImageExt'

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

const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const Wrapper = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
)
Wrapper.propTypes = {
  children: PropTypes.node
}

const Main = () => {
  const dispatch = useDispatch()
  const [activeTool, setActiveTool] = useState(ToolsList[0].id)
  const stageRef = useRef(null)

  const headerRef = useRef(null)
  const { width: winWidth, height: winHeight } = useWindowDimensions()
  const canvasWidth = winWidth
  const [initialHeaderSize, setInitialHeaderSize] = useState(0)
  const headerSize = (headerRef.current && headerRef.current.offsetHeight) || initialHeaderSize
  const canvasHeight = winHeight - headerSize
  const [, { width, height }] = useImageExt()
  const onFileSelect = (event) => {
    const fr = new FileReader()
    fr.onloadend = () => {
      dispatch(setImage(fr.result))
    }
    fr.readAsDataURL(event.target.files[0])
  }

  console.log('canvasWidth', canvasWidth)
  console.log('canvasHeight', canvasHeight)

  useLayoutEffect(() => {
    setInitialHeaderSize(headerRef.current.offsetHeight)
  }, [])

  const onSave = () => {
    downloadURI(stageRef.current.toDataURL(), 'flomaster-image.png')
  }

  const onClear = () => {
    if (!confirm('This will clear your canvas. U sure?')) {
      return
    }
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
        onFileSelect={onFileSelect}
        onClear={onClear}
        onToolChange={onToolChange}
        onSave={onSave}
        imageWidth={width}
        imageHeight={height}
      />
      <Drawing
        ref={stageRef}
        activeTool={activeTool}
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  )
}

const App = () => (
  <Wrapper>
    <Main />
  </Wrapper>
)

export default App
