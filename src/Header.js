import styled from 'astroturf/react'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { redo, setStrokeWidth, undo } from './actions'
import { futureHistoryEmpty, pastHistoryEmpty, strokeWidthSelector } from './selectors'

const FlexBox = styled('div')`
  display: flex;
  align-items: center;
`

const MenuBar = styled(FlexBox)`
  padding: 2px 0;
`

const ToolBar = styled(FlexBox)`
  padding-bottom: 2px;
`

const ToolBox = styled(FlexBox)`
  margin: 0 10px;
  padding: 0 12px;
  border-left: 2px black solid;
  border-right: 2px black solid;
`

const ToolbarElement = styled('div')`
  padding: 0 2px;
`

const NumberInput = styled('input')`
  width: 48px;
  margin-left: 8px;
`

const UndoButton = (props) => (
  <button {...props} title="Undo">↶</button>
)

const RedoButton = (props) => (
  <button {...props} title="Redo">↷</button>
)


const Tool = ({ id, label, ...inputProps }) => (
  <FlexBox>
    <input name="tool" type="radio" id={id} value={id} {...inputProps} />
    <label htmlFor={id}>{label}</label>
  </FlexBox>
)
Tool.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
}

const ToolsListWrap = styled(FlexBox)`
  flex-wrap: wrap;
`

export const ToolsList = [
  {
    id: 'brush',
    label: 'Brush'
  },
  {
    id: 'arrow',
    label: 'Arrow'
  },
  {
    id: 'rect',
    label: 'Rectangle'
  }
]

export const Header = forwardRef(({
  imageWidth,
  imageHeight,
  activeTool,
  onFileSelect,
  onClear,
  onToolChange,
  onCopy,
  onSave
}, ref) => {
  const dispatch = useDispatch()
  const strokeWidth = useSelector(strokeWidthSelector)

  return (
    <div ref={ref}>
      <MenuBar>
        <ToolbarElement>
          <button onClick={onSave}>Export</button>
        </ToolbarElement>
        <ToolbarElement>
          <input type="file" onChange={onFileSelect} />
        </ToolbarElement>
        <ToolbarElement>
          <button onClick={onCopy}>Copy to Clipboard</button>
        </ToolbarElement>
      </MenuBar>
      <ToolBar>
        <ToolbarElement>
          <button onClick={onClear}>Reset</button>
        </ToolbarElement>
        <ToolbarElement>
          <UndoButton
            disabled={useSelector(pastHistoryEmpty)}  
            onClick={() => {
              dispatch(undo())
            }} 
          />
          <RedoButton
            disabled={useSelector(futureHistoryEmpty)}
            onClick={() => {
              dispatch(redo())
            }}
          />
        </ToolbarElement>
        <ToolbarElement>
          <ToolBox>
            Tools:
            <ToolsListWrap>
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
            </ToolsListWrap>
          </ToolBox>
        </ToolbarElement>
        <ToolbarElement>
          Stroke width:
          <NumberInput
            value={strokeWidth}
            type="number"
            min={0}
            max={100}
            onChange={(event) => {
              dispatch(setStrokeWidth(event.target.value))
            }}
          />
        </ToolbarElement>
        <ToolbarElement>
          Image size: {imageWidth}x{imageHeight}
        </ToolbarElement>
      </ToolBar>
    </div>
  )
})

Header.displayName = 'Header'
Header.propTypes = {
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  activeTool: PropTypes.string,
  onFileSelect: PropTypes.func,
  onClear: PropTypes.func,
  onToolChange: PropTypes.func,
  onCopy: PropTypes.func,
  onSave: PropTypes.func
}
