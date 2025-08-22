import axios from 'axios'
import { apis } from '@/lib/const/api.enum'

// Determine runtime (client vs server)
const isClient = typeof window !== 'undefined'

// Client requests use relative /api/ proxy (configured in next.config.ts)
// Server requests use the real API_URL from env; fallback to apis.baseUrl if not provided
const serverBase = process.env.API_URL ?? apis.baseUrl
// Ensure no double slashes issues
const normalize = (u: string) => u.replace(/\/+$/, '') + '/'
const baseURL = isClient ? '/api/' : normalize(serverBase)

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add a request interceptor that only attempts to read server-only cookies on the server.
axiosInstance.interceptors.request.use(
  async (config) => {
    if (!isClient) {
      try {
        // dynamic import to avoid bundling server-only modules into client
        const { getToken } = await import('@/app/[locale]/auth/token.action')
        const token = await getToken()
        if (token) {
          // ensure headers object exists
          config.headers = config.headers ?? {}
          // set auth header for server-side requests
          ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
        }
      } catch (e) {
        // swallow — on server we try best-effort to attach token
        console.error('axiosInstance request interceptor error:', e)
      }
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
      if (!isClient) {
        // server-side: dynamic import server helpers
        const { getLocale } = await import('next-intl/server')
        const { redirect } = await import('next/navigation')
        const locale = await getLocale()
        if (error.response?.status === 401) {
          redirect(`/${locale}/auth/login`)
        }
      } else {
        // client-side: simple redirect to login on 401
        if (error.response?.status === 401) {
          // attempt to preserve locale from path (assumes /{locale}/...)
          const parts = window.location.pathname.split('/')
          const locale = parts.length > 1 ? parts[1] : ''
          window.location.href = `/${locale}/auth/login`
        }
      }
    } catch (e) {
      console.error('axiosInstance response interceptor error:', e)
    }
    return Promise.reject(error)
  }
)
