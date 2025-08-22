import { LectureTable, TodaySessions } from './(components)'
import { LectureCalender } from './(components)/lecture-calender'
import { getLectureCalender, getLectures } from './lecture.action'

export default async function LecturesPage() {
  // const lectures = await getLectures()
  const sessions = await getLectureCalender()
  return <LectureCalender sessions={sessions} />

  // return <LectureTable data={lectures.data} />
}

// {
//   /* <LectureTable data={lectures.data} /> */
// }
