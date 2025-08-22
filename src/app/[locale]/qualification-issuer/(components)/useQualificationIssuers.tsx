'use client'

import { useEffect, useState } from 'react'
import { getQualificationIssuers } from '../qualification-issuer.action'
import { IQualificationIssuer } from './qualification-issuer.interface'

export const useQualificationIssuers = () => {
  const [qualificationIssuers, setQualificationIssuers] = useState<IQualificationIssuer[]>([])
  useEffect(() => {
    const fetchQualificationIssuers = async () => {
      const qualificationIssuers = await getQualificationIssuers()
      setQualificationIssuers(qualificationIssuers.data)
    }
    fetchQualificationIssuers()
    return () => {
      setQualificationIssuers([])
    }
  }, [])
  return qualificationIssuers
}
