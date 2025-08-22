import { CourseGroupMainView } from './(components)/course-group-main-view'
import { getCourseGroups } from './course-group.action'
import { getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'

export default async function CourseGroupsPage() {
  try {
    const groups = await getCourseGroups()
    return <CourseGroupMainView data={groups.data} />
  } catch (error: any) {
    const locale = await getLocale()
    if (error?.response?.status === 401) {
      redirect(`/${locale}/auth/login`)
    }
    throw error
  }
}
