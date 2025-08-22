'use server'

import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'

export async function getToken() {
  const token = await getCookie('token', { cookies })
  return token
}

export async function getRefreshToken() {
  const refreshToken = await getCookie('refreshToken', { cookies })
  return refreshToken
}
