import { LecturerTable } from './(components)/lecturer-table'
import { getLecturers } from './lecturer.action'

export default async function LecturersPage() {
  const lecturers = await getLecturers()

  return <LecturerTable data={lecturers.data} />
}
