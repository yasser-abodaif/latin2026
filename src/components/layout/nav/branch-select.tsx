'use client'

import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useBranches } from '@/app/[locale]/branches/(components)/useBranches'
import { IBranch } from '@/app/[locale]/branches/(components)/branch.interface'

const LOCAL_STORAGE_KEY = 'defaultBranchId'
const COOKIE_KEY = 'defaultBranchId'

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

export const BranchSelect = () => {
  const branches = useBranches()
  const [selected, setSelected] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Check localStorage and cookies for saved branch
    const local = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null
    const cookie = typeof document !== 'undefined' ? getCookie(COOKIE_KEY) : null
    if (local) setSelected(local)
    else if (cookie) setSelected(cookie)
  }, [])

  const handleChange = (value: string) => {
    setSelected(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, value)
    }
    setCookie(COOKIE_KEY, value)
  }

  return (
    <Select value={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select branch" />
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch: IBranch) => (
          <SelectItem key={branch.id} value={branch.id.toString()}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
