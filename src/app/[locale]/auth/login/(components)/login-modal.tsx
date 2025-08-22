'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { logout } from '../login.action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LogIn, LogOut } from 'lucide-react'
import { LoginForm } from './login-form'
import { LoginResponse } from './login.interface'
import { getToken } from '../../token.action'
import Image from 'next/image'
import logo from '@/assets/logo-1.webp'

type LoginModalProps = {
  isIcon?: boolean
}

export function LoginModal({ isIcon = true }: LoginModalProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const t = useTranslations('auth')
  useEffect(() => {
    getToken()
      .then((cookieToken) => {
        setToken(cookieToken as string)
      })
      .catch(console.error)
  }, [])
  const handleLogin = (response: LoginResponse) => {
    setOpen(false)
    router.refresh()
  }

  const handleLogout = async () => {
    await logout()
    router.refresh()
    toast.success(t('logoutSuccess'))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={isIcon ? 'icon' : 'default'} variant={'ghost'}>
          {token ? isIcon ? <LogOut /> : t('logout') : isIcon ? <LogIn /> : t('login')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center">
            <Image
              src={logo}
              alt="logo"
              width={100}
              height={100}
              className="mb-8 rounded-full border shadow"
            />
          </div>
          <DialogTitle className="text-center">{token ? t('logout') : t('login')}</DialogTitle>
          <DialogDescription className="text-center">
            {token ? t('logoutDescription') : t('loginDescription')}
          </DialogDescription>
        </DialogHeader>
        {token ? (
          <div className="flex w-full items-center justify-center gap-2">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleLogout}>{t('logout')}</Button>
          </div>
        ) : (
          <LoginForm hideHeader={true} loginSuccess={(response) => handleLogin(response)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
