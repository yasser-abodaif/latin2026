'use server'

import { apis } from '@/lib/const/api.enum'
import { IEmployee } from './(components)/employee.interface'
import { employeeSchema } from '@/lib/schema/employee.schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'
import { revalidatePath } from 'next/cache'

const url = `${apis.employees}`

export async function getEmployees() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IEmployee[]>
}

export async function getEmployee(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IEmployee
}

export async function createEmployee(data: typeof employeeSchema._type) {
  const res = await axiosInstance.post(url, data)
  return res.data as IEmployee
}

export async function updateEmployee(id: number, data: typeof employeeSchema._type) {
  const { email, ...rest } = data
  const res = await axiosInstance.put(`${url}/${id}`, rest)
  return res.data as IEmployee
}

export async function deleteEmployee(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data as IEmployee
}

export async function restoreEmployee(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IEmployee
}
