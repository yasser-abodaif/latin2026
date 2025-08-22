'use server'

import { apis } from '@/lib/const/api.enum'
import { IBranch } from './(components)'
import { BranchSchema } from '@/lib/schema'
import { IResponse } from '@/lib/AbstractApi'
import { axiosInstance } from '@/lib/axiosInstance'

const url = `${apis.branches}`

export async function getBranches() {
  const res = await axiosInstance.get(`${url}/${apis.pagination}`)
  return res.data as IResponse<IBranch[]>
}

export async function getBranch(id: number) {
  const res = await axiosInstance.get(`${url}/${id}`)
  return res.data.data as IBranch
}

export async function createBranch(data: BranchSchema) {
  const res = await axiosInstance.post(url, data)
  return res.data as IBranch
}

export async function updateBranch(id: number, data: BranchSchema) {
  const res = await axiosInstance.put(`${url}/${id}`, data)
  return res.data as IBranch
}

export async function deleteBranch(id: number) {
  const res = await axiosInstance.delete(`${url}/${id}`)
  return res.data
}

export async function restoreBranch(id: number) {
  const res = await axiosInstance.put(`${url}/${id}`)
  return res.data as IBranch
}
