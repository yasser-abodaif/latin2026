import { useEffect, useState } from 'react'
import { getSalaryTypes } from '@/app/[locale]/actions'
import { ISalaryType } from '../interface/salary-type.interface'

export const useSalaryTypes = () => {
  const [salaryTypes, setSalaryTypes] = useState<ISalaryType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchSalaryTypes = async () => {
      setIsLoading(true)
      const salaryTypes = await getSalaryTypes()
      setSalaryTypes(salaryTypes)
      setIsLoading(false)
    }
    fetchSalaryTypes()
    return () => {
      setSalaryTypes([])
    }
  }, [])
  return { salaryTypes, isLoading }
}
