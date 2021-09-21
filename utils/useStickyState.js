import {useEffect, useState} from 'react'

export default function useStickyState(key, defaultValue) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true);
  }, [])

  const [value, setValue] = useState(() => {
    if (!hasMounted) {
      return defaultValue
    } else {
      const stickyValue = window.localStorage.getItem(key)
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}