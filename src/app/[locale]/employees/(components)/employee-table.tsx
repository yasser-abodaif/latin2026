'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { AppTable } from '@/components/table/app-table'
import { IEmployee } from './employee.interface'

type Props = {
  data: IEmployee[]
}

export const EmployeeTable = ({ data }: Props) => {
  const t = useTranslations('employee')
  const columns: ColumnDef<IEmployee>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'email',
      header: t('email'),
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
    },
    {
      accessorKey: 'department',
      header: t('department'),
    },
    {
      accessorKey: 'jobTitle',
      header: t('jobTitle'),
    },
    {
      accessorKey: 'salary',
      header: t('salary'),
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.employees} />
}
