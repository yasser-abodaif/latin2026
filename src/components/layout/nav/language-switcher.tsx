'use client'

import { Button } from '../../ui/button'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import arFlag from '@/assets/ar-flag.webp'
import enFlag from '@/assets/en-flag.webp'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface LanguageSwitcherProps {
  isIcon?: boolean
}

export function LanguageSwitcher({ isIcon = true }: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <Link href={pathname.replace(locale === 'ar' ? 'ar' : 'en', locale === 'ar' ? 'en' : 'ar')}>
      <Button variant="ghost" size="sm" className="flex gap-3">
        {!isIcon && <p>{locale === 'ar' ? 'العربية' : 'English'}</p>}
        <Image src={locale === 'ar' ? arFlag : enFlag} alt="local-flag" height={20} />
      </Button>
    </Link>
  )
}
