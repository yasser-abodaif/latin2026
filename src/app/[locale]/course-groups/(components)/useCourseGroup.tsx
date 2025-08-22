import { useEffect, useState } from 'react'
import { getCourseGroups } from '../course-group.action'
import { ICourseGroup } from './course-group.interface'

export const useCourseGroup = () => {
  const [courseGroups, setCourseGroups] = useState<ICourseGroup[]>([])
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const fetchCourseGroups = async () => {
      try {
        const courseGroups = await getCourseGroups()
        if (!isMounted) return
        setCourseGroups(courseGroups.data)
      } catch (_) {
        // ignore
      }
    }
    fetchCourseGroups()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])
  return courseGroups
}
