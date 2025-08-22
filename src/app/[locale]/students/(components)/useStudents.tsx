import { useEffect, useState } from 'react'
import { getStudents } from '../student.action'
import { IStudent } from './student.interface'

export const useStudents = () => {
  const [students, setStudents] = useState<IStudent[]>([])
  useEffect(() => {
    const fetchStudents = async () => {
      const students = await getStudents()
      setStudents(students.data)
    }
    fetchStudents()
    return () => {
      setStudents([])
    }
  }, [])
  return students
}
