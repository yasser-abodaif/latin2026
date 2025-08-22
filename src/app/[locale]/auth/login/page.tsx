import { Card } from '@/components/ui/card'
import { LoginForm } from './(components)/login-form'
import { cookies } from 'next/headers'
import { getCookie } from 'cookies-next/server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

export default async function LoginPage() {
  const locale = await getLocale()
  const token = await getCookie('token', { cookies })
  if (token) {
    redirect(`/${locale}`)
  }
  return (
    <div className="mt-8 flex w-full items-start justify-center">
      {/* <Card className="w-full max-w-[400px] p-4"> */}
      <div className="w-full max-w-[400px] p-4">
        <LoginForm />
      </div>
      {/* </Card> */}
    </div>
  )
}
