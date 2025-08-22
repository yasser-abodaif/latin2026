'use client'

import { useEffect, useState } from 'react'
import { getQualificationTypes } from '../qualification-type.action'
import { IQualificationType } from './qualification-type.interface'

export const useQualificationTypes = () => {
  const [qualificationTypes, setQualificationTypes] = useState<IQualificationType[]>([])
  useEffect(() => {
    const fetchQualificationTypes = async () => {
      const qualificationTypes = await getQualificationTypes()
      setQualificationTypes(qualificationTypes.data)
    }
    fetchQualificationTypes()
    return () => {
      setQualificationTypes([])
    }
  }, [])
  return qualificationTypes
}
