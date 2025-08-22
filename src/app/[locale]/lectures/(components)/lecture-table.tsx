'use client'
import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { AppTable } from '@/components/table/app-table'
import { ILecture } from './lecture.interface'

type Props = {
  data: ILecture[]
}

export const LectureTable = ({ data }: Props) => {
  const t = useTranslations('lecture')
  const columns: ColumnDef<ILecture>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => {
        return (
          <div>
            {row.original.id} - {row.original.groupName}
          </div>
        )
      },
    },
    {
      accessorKey: 'groupName',
      header: t('group'),
    },
    {
      accessorKey: 'roomName',
      header: t('lab'),
    },
    {
      accessorKey: 'instructorName',
      header: t('lecturer'),
    },
    {
      accessorKey: 'notes',
      header: t('notes'),
      cell: ({ row }) => {
        return <div className="px-5">{row.original.notes}</div>
      },
    },
  ]
  return <AppTable title={t('title')} columns={columns} data={data} mainRoute={routes.lectures} />
}
