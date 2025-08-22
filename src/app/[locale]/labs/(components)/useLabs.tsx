import { useEffect, useState } from 'react'
import { getLabs } from '../lab.action'
import { ILab } from './lab.interface'

export const useLabs = () => {
  const [labs, setLabs] = useState<ILab[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchLabs = async () => {
      setIsLoading(true)
      const labs = await getLabs()
      setLabs(labs.data)
      setIsLoading(false)
    }
    fetchLabs()
    return () => {
      setLabs([])
    }
  }, [])
  return { labs, isLoading }
}
