'use client'
import { useEffect, useState } from 'react'

export const useWindowSize = () => {
  const [width, setWidth] = useState(!!window ? window.innerWidth : 0)
  const [height, setHeight] = useState(!!window ? window.innerHeight : 0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { width, height }
}
