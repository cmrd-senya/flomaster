import styled from 'astroturf/react'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'

const MenuBar = styled('div')`
  padding: 2px 0;
`

const FlexBox = styled('div')`
  display: flex;
  align-items: center;
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
  onFileSelect,
  onClear,
  onToolChange,
  onSave
}, ref) => {
  return (
    <div ref={ref}>
      <MenuBar>
        <input type="file" onChange={onFileSelect} />
      </MenuBar>
      <FlexBox>
        <ToolbarElement>
          <button onClick={onSave}>Export</button>
        </ToolbarElement>
        <ToolbarElement>
          <button onClick={onClear}>Reset</button>
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
          Stroke width: <NumberInput type="number" max={100} />
        </ToolbarElement>
      </FlexBox>
    </div>
  )
})

Header.displayName = 'Header'
Header.propTypes = {
  activeTool: PropTypes.string,
  onFileSelect: PropTypes.function,
  onClear: PropTypes.function,
  onToolChange: PropTypes.function,
  onSave: PropTypes.function
}
