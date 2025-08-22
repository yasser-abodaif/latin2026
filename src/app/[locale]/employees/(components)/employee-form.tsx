'use client'

import React from 'react'
import { employeeSchema, EmployeeSchema } from '@/lib/schema/employee.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { createEmployee, updateEmployee } from '../employee.action'
import { routes } from '@/lib/const/routes.enum'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formMode } from '@/lib/const/formMode.enum'
import { IEmployee } from './employee.interface'
import { useCities } from '../../cities/(components)/useCities'
import { useSalaryTypes } from '@/components/hooks/useSalaryType'
import { Link, useRouter } from '@/i18n/routing'
import { PasswordInput } from '@/components/ui/password-input'

type Props = {
  mode?: formMode
  data?: IEmployee
}

export const EmployeeForm = ({ mode = formMode.create, data }: Props) => {
  const t = useTranslations('employee')
  const cities = useCities()
  const { salaryTypes } = useSalaryTypes()
  const router = useRouter()

  const defaultValues: EmployeeSchema = {
    id: data?.id ? data.id : undefined,
    name: data?.name ?? '',
    email: data?.email ?? '',
    password: '',
    phone: data?.phone ?? '',
    address: data?.address ?? '',
    nationalId: data?.nationalId ?? '',
    cityId: data?.cityId ?? 0,
    department: data?.department ?? '',
    salary: data?.salary ?? 0,
    salaryTypeId: data?.salaryTypeId ?? 1,
    jobTitle: data?.jobTitle ?? '',
  }

  const methods = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset } = methods

  const onSubmit = async (values: EmployeeSchema) => {
    toast.info(t('creating'))
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateEmployee(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createEmployee(values)
        toast.success(t('addSuccess'))
      }
      router.push(`/${routes.employees}`)
    } catch (error) {
      console.error(error)
    }
  }

  const getFormTitle = () => {
    if (mode === formMode.create) return t('create')
    if (mode === formMode.edit) return t('edit')
    return t('view')
  }

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{getFormTitle()}</h3>
          <div>
            <div className="mt-4 flex items-center justify-start gap-3 [&_button]:px-10">
              {mode !== formMode.view && (
                <>
                  <Button type="submit" variant={'default'} size={'sm'}>
                    {t('submit')}
                  </Button>
                  <Button
                    onClick={() => reset(defaultValues)}
                    type="reset"
                    variant={'secondary'}
                    size={'sm'}
                  >
                    {t('reset')}
                  </Button>
                </>
              )}
              <Link href={`/${routes.employees}`}>
                <Button type="button" variant={'destructive'} size={'sm'}>
                  {t('cancel')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl border p-4 shadow-lg md:grid-cols-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('name')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            disabled={mode !== formMode.create}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('email')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {mode === formMode.create && ( */}
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder={t('password')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* )} */}

          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('phone')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('phone')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('address')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="nationalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('nationalId')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('nationalId')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('cityId')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('cityId')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((area) => (
                        <SelectItem key={area.id} value={area.id + ''}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('department')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('department')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('jobTitle')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('jobTitle')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('salary')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('salary')}
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="salaryTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('salaryType')}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value + ''}
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('salaryType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id + ''}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
