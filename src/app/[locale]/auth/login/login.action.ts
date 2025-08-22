'use server'

import { axiosInstance } from '@/lib/axiosInstance'
import { apis } from '@/lib/const/api.enum'
import { cookies } from 'next/headers'
import { setCookie, deleteCookie, getCookie, getCookies } from 'cookies-next/server'
import { LoginRequest, LoginResponse } from './(components)/login.interface'

async function saveTokenAndRefreshToken(response: LoginResponse, rememberMe: boolean) {
  // Remember preference cookie (non-HTTPOnly is fine, but keep server readable)
  await setCookie('rememberMe', rememberMe ? '1' : '0', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    cookies,
  })

  const tokenCookieBase = {
    httpOnly: true as const,
    path: '/',
    sameSite: 'lax' as const,
    cookies,
  }
  // If rememberMe is false => session cookie (no expires)
  await setCookie('token', response.accessToken, {
    ...tokenCookieBase,
    ...(rememberMe ? { expires: new Date(response.accessTokenExpires) } : {}),
  })
  await setCookie('refreshToken', response.refreshToken, {
    ...tokenCookieBase,
    ...(rememberMe ? { expires: new Date(response.refreshTokenExpires) } : {}),
  })
}

export async function login(data: LoginRequest, rememberMe: boolean = false) {
  try {
    const response = await axiosInstance.post<LoginResponse>(apis.login, data)
    await saveTokenAndRefreshToken(response.data, rememberMe)
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function refreshToken() {
  const refreshToken = await getCookie('refreshToken', { cookies })
  const rememberPref = await getCookie('rememberMe', { cookies })
  const rememberMe = String(rememberPref ?? '1') === '1'

  if (!refreshToken) {
    throw new Error('No refresh token found')
  }

  try {
    const response = await axiosInstance.post(`Auth/refresh`, {
      refreshToken,
    })
    await saveTokenAndRefreshToken(response.data, rememberMe)
    return response.data
  } catch (error) {
    await logout()
    throw error
  }
}

export async function logout() {
  await deleteCookie('token', { cookies })
  await deleteCookie('refreshToken', { cookies })
}
