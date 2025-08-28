import axios from 'axios'
import { apis } from '@/lib/const/api.enum'

// Determine runtime (client vs server)
const isClient = typeof window !== 'undefined'

// Client requests use relative /api/proxy/ server-side proxy which attaches
// Authorization header from httpOnly cookies. Server requests use the real API_URL from env.
// Server requests use the real API_URL from env; fallback to apis.baseUrl if not provided
const serverBase = process.env.API_URL ?? apis.baseUrl
// Ensure no double slashes issues
const normalize = (u: string) => u.replace(/\/+$/, '') + '/'
const baseURL = isClient ? '/api/proxy/' : normalize(serverBase)

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Debug: log baseURL on server start
if (!isClient) {
  console.log('axiosInstance running on server. baseURL=', baseURL)
}

// Request interceptor: add auth token on both client and server
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { getToken } = await import('@/app/[locale]/auth/token.action')
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log(' Token attached to request:', token.substring(0, 20) + '...')
      } else {
        console.warn(' No token found for request')
      }
    } catch (error) {
      console.error(' Failed to get token:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 differently on server and client
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      // Try to refresh token first on 401
      if (error.response?.status === 401) {
        try {
          // Try to get refresh token
          const { getRefreshToken } = await import('@/app/[locale]/auth/token.action')
          const refreshToken = await getRefreshToken()
          
          console.log('Attempting token refresh, refreshToken present:', Boolean(refreshToken))

          if (refreshToken) {
            // Use the correct base URL for refresh endpoint
            // On client, use the proxy; on server, use the actual API URL
            const refreshBaseURL = isClient ? '/api/proxy/' : normalize(serverBase)
            const refreshUrl = `${refreshBaseURL}auth/refresh`
            
            console.log('Token refresh URL:', refreshUrl)
            
            // Try to refresh the token
            const response = await axios.post(refreshUrl, {
              refreshToken,
            }, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              }
            })

            if (response.data?.accessToken) {
              console.log('Token refresh successful')
              
              // Save the new tokens to cookies if we have the helper functions
              try {
                const { setToken, setRefreshToken } = await import('@/app/[locale]/auth/token.action')
                if (setToken && response.data.accessToken) {
                  await setToken(response.data.accessToken)
                }
                if (setRefreshToken && response.data.refreshToken) {
                  await setRefreshToken(response.data.refreshToken)
                }
              } catch (tokenSaveError) {
                console.warn('Could not save new tokens to cookies:', tokenSaveError)
              }
              
              // Update auth header with new token
              error.config.headers.Authorization = `Bearer ${response.data.accessToken}`
              // Retry original request
              return axiosInstance(error.config)
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          // Clear invalid tokens
          try {
            const { clearTokens } = await import('@/app/[locale]/auth/token.action')
            if (clearTokens) {
              await clearTokens()
            }
          } catch (clearError) {
            console.warn('Could not clear tokens:', clearError)
          }
        }

        // If refresh failed or no refresh token, redirect to login
        const currentPath = isClient ? window.location.pathname : ''
        const parts = currentPath.split('/')
        const locale = parts.length > 1 ? parts[1] : 'ar' // Default to Arabic
        const returnUrl = encodeURIComponent(currentPath)

        if (!isClient) {
          const { redirect } = await import('next/navigation')
          redirect(`/${locale}/auth/login?returnUrl=${returnUrl}`)
        } else {
          window.location.href = `/${locale}/auth/login?returnUrl=${returnUrl}`
        }
      }
    } catch (e) {
      console.error('axiosInstance response interceptor error:', e)
    }
    return Promise.reject(error)
  }
)
