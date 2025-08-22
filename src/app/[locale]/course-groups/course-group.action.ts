'use server'

import { apis } from '@/lib/const/api.enum'
import { ICourseGroup, ICourseGroupDay, ICourseGroupStatus } from './(components)'
import { CourseGroupSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { AxiosError } from 'axios'
import { parseTime } from '@/lib/parse-time'

const url = `${apis.courseGroups}`

export async function getCourseGroups() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ICourseGroup[]>
}

export async function getCourseGroup(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ICourseGroup
}

export async function createCourseGroup(data: CourseGroupSchema) {
  try {
    const res = await axiosInstance.post(url, {
      ...data,
      startTime: parseTime(data.startTime),
      endTime: parseTime(data.endTime),
    })
    return res.data as ICourseGroup
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data)
      throw new Error(error.response?.data)
    }
    throw new Error('Failed to create course group')
  }
}

export async function updateCourseGroup(id: number, data: CourseGroupSchema) {
  try {
    const res = await axiosInstance.put(`${url}/${id}`, {
      ...data,
      startTime: parseTime(data.startTime),
      endTime: parseTime(data.endTime),
    })
    return res.data as ICourseGroup
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data)
      throw new Error(error.response?.data)
    }
  }
}

export async function deleteCourseGroup(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreCourseGroup(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ICourseGroup
}

export async function getCourseGroupStatus() {
  const res = await axiosInstance.get(`${apis.groupStatus}`)
  return res.data as ICourseGroupStatus[]
}

export async function getCourseGroupDays() {
  const res = await axiosInstance.get(`${apis.groupDays}`)
  return res.data as ICourseGroupDay[]
}

export async function registerCampaignLead(data: {
  name: string
  email: string
  phone: string
  address: string
  areaId: number
  birthdate: string
  courseId: number
  branchId: number
}) {
  const res = await axiosInstance.post(`${apis.campaignLeads}`, data)
  return res.data
}

export async function closeGroup(groupId: number) {
  const res = await axiosInstance.post(`${url}/close-group`, { groupId })
  return res.data
}

export async function activateGroup(body: {
  groupId: number
  enrollments: { studentId: number; discount: number }[]
}) {
  const res = await axiosInstance.post(`${url}/activate`, body)

  return res.data
}

export async function deactivateGroup(groupId: number) {
  const res = await axiosInstance.post(`${url}/deactivate/${groupId}`)
  return res.data
}

export async function addExtraSession(groupId: number, sessionData: any) {
  const res = await axiosInstance.post(`${url}/add-extra-session`, { groupId, ...sessionData })
  return res.data
}

export async function enrollGroup(enrollmentId: number, groupId: number) {
  const res = await axiosInstance.post(`${url}/enroll/${enrollmentId}/group/${groupId}`)
  return res.data
}
