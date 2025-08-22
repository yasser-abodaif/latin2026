'use client'

import { useEffect, useState } from 'react'
import { getQualificationDescriptions } from '../qualification-description.action'
import { IQualificationDescription } from './qualification-description.interface'

export const useQualificationDescriptions = () => {
  const [qualificationDescriptions, setQualificationDescriptions] = useState<
    IQualificationDescription[]
  >([])
  useEffect(() => {
    const fetchQualificationDescriptions = async () => {
      const qualificationDescriptions = await getQualificationDescriptions()
      setQualificationDescriptions(qualificationDescriptions.data)
    }
    fetchQualificationDescriptions()
    return () => {
      setQualificationDescriptions([])
    }
  }, [])
  return qualificationDescriptions
}
