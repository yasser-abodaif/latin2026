'use client'

import { useEffect, useState } from 'react'
import { getAgreements } from '../agreement.action'
import { IAgreement } from './agreement.interface'

export const useAgreements = () => {
  const [agreements, setAgreements] = useState<IAgreement[]>([])
  useEffect(() => {
    const fetchAgreements = async () => {
      const agreements = await getAgreements()
      setAgreements(agreements.data)
    }
    fetchAgreements()
    return () => {
      setAgreements([])
    }
  }, [])
  return agreements
}
