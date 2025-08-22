import { useEffect, useState } from 'react'
import { getLecturers } from '../lecturer.action'
import { ILecturer } from './lecturer.interface'

export const useLecturers = () => {
  const [lecturers, setLecturers] = useState<ILecturer[]>([])
  useEffect(() => {
    const fetchLecturers = async () => {
      const lecturers = await getLecturers()
      setLecturers(lecturers.data)
    }
    fetchLecturers()
    return () => {
      setLecturers([])
    }
  }, [])
  return lecturers
}
