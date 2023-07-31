import React, { useRef, useEffect } from 'react'

const useOutsideAlerter = (_ref, _onOutside) => {
  useEffect(() => {
    const handleClickOutside = (_event) => {
      if (_ref.current && !_ref.current.contains(_event.target)) {
        _onOutside()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [_ref, _onOutside])
}

export default function OutsideAlerter({ children, onOutside = () => null }) {
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, onOutside)
  return <div ref={wrapperRef}>{children}</div>
}
