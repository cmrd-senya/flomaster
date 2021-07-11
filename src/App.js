import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

const Main = ({ file: launchFile }) => {
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

  const readFile = useCallback((file) => {
    const fr = new FileReader()
    fr.onloadend = () => {
      dispatch(setImage(fr.result))
    }
    fr.readAsDataURL(file)
  }, [dispatch])

  const onFileSelect = (event) => {
    readFile(event.target.files[0])
  }

  useEffect(() => {
    if (!launchFile) { return }
    readFile(launchFile)
  }, [readFile, launchFile])

  useLayoutEffect(() => {
    setInitialHeaderSize(headerRef.current.offsetHeight)
  }, [])

  const onSave = () => {
    downloadURI(stageRef.current.toDataURL(), 'flomaster-image.png')
  }

  const onCopy = () => {
    if (typeof ClipboardItem === 'undefined') {
      alert('Error: Clipboard API is not fully supported in your browser! Cannot copy.')
      return
    }

    stageRef.current.toCanvas().toBlob(async (blob) => {
      const cbItem = new ClipboardItem({ // eslint-disable-line no-undef
        'image/png': blob
      })
      await navigator.clipboard.write([cbItem])
      console.log('Copied!') // TODO: add visible status
    })
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
        onCopy={onCopy}
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
Main.propTypes = {
  file: PropTypes.object
}

const App = (props) => (
  <Wrapper>
    <Main {...props} />
  </Wrapper>
)

export default App
