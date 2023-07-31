import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import Box from '../Box'

const ToggleSelect = forwardRef(({ initialValue, options = [], onChange = () => null }, _ref) => {
  const [selected, setSelected] = useState(initialValue || options[0])

  const onClick = useCallback(
    (_option) => {
      setSelected(_option)
      onChange(_option)
    },
    [onChange]
  )

  useImperativeHandle(_ref, () => {
    return {
      selected,
      setSelected: (_selected) => {
        setSelected(_selected)
      }
    }
  })

  return (
    <Box className={'p-0.5 rounded-lg g-2'}>
      {options.map((_option) => (
        <button
          key={`toggle_select_${_option}`}
          className={`${
            selected === _option ? 'bg-gray-100' : ''
          } pl-2 pt-1 pr-2 pb-1 rounded-lg text-gray-600 text-sm font-medium`}
          onClick={() => onClick(_option)}
        >
          {_option}
        </button>
      ))}
    </Box>
  )
})

export default ToggleSelect
