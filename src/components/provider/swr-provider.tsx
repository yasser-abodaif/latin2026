import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/swr-fetchers'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 5000,
        errorRetryCount: 3,
        shouldRetryOnError: false,
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  )
}
