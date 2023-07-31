import { useCallback, useState } from 'react'

const Toggle = ({ value, onChange = () => null }) => {
  const [enabled, setEnabled] = useState(value)

  const onClick = useCallback(() => {
    setEnabled(!enabled)
    onChange(!enabled)
  }, [enabled, onChange])

  return (
    <div className="flex">
      <label class="inline-flex relative items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={enabled} readOnly />
        <div
          onClick={onClick}
          className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
        ></div>
      </label>
    </div>
  )
}

export default Toggle
