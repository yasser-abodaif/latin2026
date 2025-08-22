'use server'

import { apis } from '@/lib/const/api.enum'
import { ILecture, TodaySessions } from './(components)'
import { LectureSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { AxiosError } from 'axios'

const url = `${apis.lectures}`

export async function getLectures() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<ILecture[]>
}

export async function getLecture(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as ILecture
}

export async function createLecture(data: LectureSchema) {
  try {
    const res = await axiosInstance.post(url, data)
    return res.data as ILecture
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data)
    }
  }
}

export async function updateLecture(id: number, data: LectureSchema) {
  try {
    const res = await axiosInstance.put(`${url}/${id}`, data)
    return res.data as ILecture
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data)
      throw new Error(error.response?.data.message)
    }
  }
}

export async function deleteLecture(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreLecture(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as ILecture
}

export const getLectureCalender = async () => {
  const res = await axiosInstance.get(`${apis.todaySessions}?branchId=1`)

  return res.data as TodaySessions[]
}
