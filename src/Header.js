import styled from 'astroturf/react'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'

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
  <button {...props}>↶</button>
)

const RedoButton = (props) => (
  <button {...props}>↷</button>
)


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

export const ToolsList = [
  {
    id: 'brush',
    label: 'Brush'
  },
  {
    id: 'arrow',
    label: 'Arrow'
  }
]

export const Header = forwardRef(({
  activeTool,
  strokeWidth,
  onFileSelect,
  onClear,
  onToolChange,
  onStrokeWidthChange,
  onSave
}, ref) => {
  return (
    <div ref={ref}>
      <MenuBar>
        <ToolbarElement>
          <button onClick={onSave}>Export</button>
        </ToolbarElement>
        <ToolbarElement>
          <input type="file" onChange={onFileSelect} />
        </ToolbarElement>
      </MenuBar>
      <ToolBar>
        <ToolbarElement>
          <button onClick={onClear}>Reset</button>
        </ToolbarElement>
        <ToolbarElement>
          <UndoButton onClick={() => {}} />
          <RedoButton onClick={() => {}} />
        </ToolbarElement>
        <ToolbarElement>
          <ToolBox>
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
          </ToolBox>
        </ToolbarElement>
        <ToolbarElement>
          Stroke width:
          <NumberInput
            value={strokeWidth}
            type="number"
            max={100}
            onChange={(event) => {
              onStrokeWidthChange(event.target.value)
            }}
          />
        </ToolbarElement>
      </ToolBar>
    </div>
  )
})

Header.displayName = 'Header'
Header.propTypes = {
  activeTool: PropTypes.string,
  strokeWidth: PropTypes.number,
  onFileSelect: PropTypes.function,
  onClear: PropTypes.function,
  onToolChange: PropTypes.function,
  onStrokeWidthChange: PropTypes.function,
  onSave: PropTypes.function
}
