import { useEffect, useState } from 'react'
import { getCategories } from '../category.action'
import { ICategory } from './category.interface'

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([])
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        if (!isMounted) return
        setCategories(categories.data)
      } catch (_) {
        // ignore
      }
    }
    fetchCategories()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])
  return categories
}
