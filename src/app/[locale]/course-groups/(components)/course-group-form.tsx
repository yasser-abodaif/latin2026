'use client'

import { courseGroupSchema, CourseGroupSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Link, useRouter } from '@/i18n/routing'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useLocale, useTranslations } from 'next-intl'
import { formMode } from '@/lib/const/form-mode.enum'
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createCourseGroup, updateCourseGroup } from '../course-group.action'
import { useCourses } from '../../courses/(components)/useCourses'
import { useInstructorsLevels } from '../../help-tables/(components)'
import { ICourseGroup } from './course-group.interface'
import { DatePicker } from '@/components/ui/date-picker'
import { useLabs } from '../../labs/(components)/useLabs'
import { useGroupStatus } from './useGroupStatus'
import { CourseGroupDays } from './group-days'
import { CourseGroupStudents } from './group-students'
import { useHoursList } from '@/lib/hooks/useHoursList'
import { formatToAmPm } from '@/lib/formatToAmPm'
import { parseTime } from '@/lib/parse-time'
import { addHoursToTime } from '@/lib/addHourToTIme'
import { useGroupDays } from './useGroupDays'
type Props = {
  mode?: formMode
  data?: ICourseGroup
}

export const CourseGroupForm = ({ mode = formMode.create, data }: Props) => {
  const locale = useLocale()
  const hourseList = useHoursList({
    startHour: 6,
    endHour: 5.3,
    intervalMinutes: 30,
  })
  const t = useTranslations('courseGroup')
  const [maxStudents, setMaxStudents] = useState(100)
  const courses = useCourses()
  const { labs } = useLabs()
  const groupStatus = useGroupStatus()
  const router = useRouter()
  const [price, setPrice] = useState(0)

  const defaultValues: CourseGroupSchema = {
    id: data?.id ?? undefined,
    name: data?.name ?? '',
    courseId: data?.courseId ?? 0,
    startDate: data?.startDate ? new Date(data.startDate) : new Date(),
    endDate: data?.endDate ? new Date(data.endDate) : new Date(),
    instructorId: data?.instructorId ?? 0,
    statusId: data?.statusId ?? 1,
    studentIds: data?.students?.map((student) => student.id) ?? [],
    levelId: data?.levelId ?? 0,
    roomId: data?.roomId ?? 0,
    days: data?.daysArray ?? [],
    startTime: data?.startTime ? formatToAmPm(data.startTime) : '',
    endTime: data?.endTime ? formatToAmPm(data.endTime) : '',
    price: data?.price ?? 0,
    levelName: data?.levelName ?? '',
    levelCode: data?.levelCode ?? '',
    levelDuration: data?.levelDuration ?? 0,
    levelSessionsCount: data?.levelSessionsCount ?? 0,
    levelPrice: data?.levelPrice ?? 0,
  }

  const methods = useForm<CourseGroupSchema>({
    resolver: zodResolver(courseGroupSchema),
    defaultValues,
    disabled: mode === formMode.view,
  })

  const { control, handleSubmit, reset, setValue } = methods
  const courseId = useWatch({ control, name: 'courseId' })
  const { data: instructorsLevelsData, isLoading: isInstructorsLevelsLoading } =
    useInstructorsLevels(courseId)

  const levelId = useWatch({ control, name: 'levelId' })
  useEffect(() => {
    const level = courses
      ?.find((course) => course.id === courseId)
      ?.levels.find((level) => level.id === levelId)
    setPrice(level?.price ?? 0)
    setValue('price', level?.price ?? 0)
  }, [levelId, courseId, courses, setValue])

  const days = useGroupDays()

  const selectedDays = useWatch({ control, name: 'days' })
  const startDate = useWatch({ control, name: 'startDate' })
  const [startDateError, setStartDateError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedDays && selectedDays.length > 0 && startDate) {
      const startDay = new Date(startDate).getDay()
      const calenderDays = [6, 0, 1, 2, 3, 4, 5]
      const serverDays = [1, 2, 4, 8, 16, 32, 64]
      const startDayIndex = calenderDays.indexOf(startDay)

      const isDayValid = selectedDays.some((day, index) => {
        return startDayIndex === index
      })

      if (!isDayValid) {
        setStartDateError(
          t('startDateMustMatchSelectedDays', {
            default: 'Start date must match one of the selected days.',
          })
        )
      } else {
        setStartDateError(null)
      }
    } else {
      setStartDateError(null)
    }
  }, [selectedDays, startDate, t])

  useEffect(() => {
    if (startDate && levelId && selectedDays && selectedDays.length > 0) {
      const level = courses
        ?.find((course) => course.id === courseId)
        ?.levels.find((lvl) => lvl.id === levelId)
      if (level) {
        const endDate = new Date(startDate as Date)
        const totalDays = selectedDays.length
        const weeksNeeded = level.sessionsCount / totalDays
        endDate.setDate(endDate.getDate() + weeksNeeded * 7)
        setValue('endDate', endDate)
      } else {
        setValue('endDate', new Date())
      }
    }
  }, [startDate, levelId, selectedDays, courses, courseId, setValue])

  const startTimeVal = useWatch({ control, name: 'startTime' })
  useEffect(() => {
    if (startTimeVal && levelId) {
      const level = courses
        ?.find((course) => course.id === courseId)
        ?.levels.find((lvl) => lvl.id === levelId)
      if (level && level.sessionsDiortion && level.sessionsDiortion > 0) {
        const startTime = parseTime(startTimeVal as string)
        const endTime = addHoursToTime(startTime, level.sessionsDiortion)
        setValue('endTime', formatToAmPm(endTime))
      }
    }
  }, [startTimeVal, levelId, courseId, courses, setValue])

  useEffect(() => {
    setValue('instructorId', 0)
    setValue('levelId', 0)
    setPrice(0)
  }, [courseId, setValue])

  const onSubmit = async (values: CourseGroupSchema) => {
    try {
      toast.info(t('creating'))
      if (mode === formMode.edit && data?.id) {
        await updateCourseGroup(data.id, values)
        toast.success(t('editSuccess'))
      } else {
        await createCourseGroup(values)
        toast.success(t('addSuccess'))
      }

      router.push(`/course-groups`)
    } catch (error) {
      console.error(error)
      toast.error('something went wrong')
    }
  }

  const getFormTitle = () => {
    if (mode === formMode.create) return t('create')
    if (mode === formMode.edit) return t('edit')
    return t('view')
  }

  return (
    <Form {...methods}>
      <form className="mt-10 w-full" onSubmit={handleSubmit(onSubmit, console.error)}>
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <h3 className="text-lg font-semibold md:text-2xl">{getFormTitle()}</h3>
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
              <Link href={`/course-groups`}>
                <Button type="button" variant={'destructive'} size={'sm'}>
                  {t('cancel')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-3 grid-cols-1 gap-4 space-y-3 rounded-xl border p-4 shadow-lg md:grid md:grid-cols-2 md:space-y-0">
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
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('course')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={mode !== formMode.create}
                    value={
                      field.value !== undefined && field.value !== null ? String(field.value) : ''
                    }
                    onValueChange={(e) => {
                      field.onChange(+e)
                    }}
                  >
                    <SelectTrigger disabled={mode !== formMode.create}>
                      <SelectValue placeholder={t('selectCoursePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id + ''}>
                          {course.name}
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
            name="instructorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('lecturer')}</FormLabel>
                <FormControl>
                  <Select
                    value={
                      field.value !== undefined && field.value !== null ? String(field.value) : ''
                    }
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode === formMode.view || !courseId || isInstructorsLevelsLoading}
                  >
                    <SelectTrigger
                      disabled={mode === formMode.view || !courseId || isInstructorsLevelsLoading}
                    >
                      <SelectValue placeholder={t('selectLecturerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {instructorsLevelsData?.instructors?.map((lecturer) => (
                        <SelectItem key={lecturer.instructorId} value={lecturer.instructorId + ''}>
                          {lecturer.name}
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
            name="levelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('level')}</FormLabel>
                <FormControl>
                  <Select
                    value={
                      field.value !== undefined && field.value !== null ? String(field.value) : ''
                    }
                    onValueChange={(e) => field.onChange(+e)}
                    disabled={mode !== formMode.create || !courseId || isInstructorsLevelsLoading}
                  >
                    <SelectTrigger
                      disabled={mode !== formMode.create || !courseId || isInstructorsLevelsLoading}
                    >
                      <SelectValue placeholder={t('selectLevelPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {instructorsLevelsData?.levels?.map((level) => (
                        <SelectItem key={level.id} value={level.id + ''}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Level Details Fields */}
          <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <FormLabel>{t('levelCode', { default: 'Level Code' })}</FormLabel>
              <Input
                value={`CRS${courseId.toString().padStart(3, '0')}-${levelId || ''}`}
                disabled
              />
            </div>
            <div>
              <FormLabel>{t('levelDuration', { default: 'Duration' })}</FormLabel>
              <Input
                value={
                  courses?.find((c) => c.id === courseId)?.levels.find((l) => l.id === levelId)
                    ?.sessionsDiortion || 0
                }
                disabled
              />
            </div>
            <div>
              <FormLabel>{t('levelSessionsCount', { default: 'Sessions Count' })}</FormLabel>
              <Input
                value={
                  courses?.find((c) => c.id === courseId)?.levels.find((l) => l.id === levelId)
                    ?.sessionsCount || 0
                }
                disabled
              />
            </div>
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('price', { default: 'Price' })}</FormLabel>
                  <FormControl>
                    <Input {...field} value={price} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="days"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('days')}</FormLabel>
                <FormControl>
                  <CourseGroupDays
                    disabled={mode === formMode.view}
                    selectedDaysIds={field.value}
                    setSelectedDaysIds={(daysIds) => {
                      field.onChange(daysIds)
                    }}
                    days={days}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t('startDate')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      isRTL={locale === 'ar'}
                      btnClassName="w-full"
                      disabled={mode === formMode.view}
                      className="w-full"
                      value={field.value as Date}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  {startDateError && (
                    <div className="mt-1 text-xs text-red-500">{startDateError}</div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t('endDate')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      isRTL={locale === 'ar'}
                      btnClassName="w-full"
                      disabled={true}
                      className="w-full"
                      value={field.value as Date}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('startTime')}</FormLabel>
                  <FormControl>
                    <Select
                      value={
                        field.value !== undefined && field.value !== null ? String(field.value) : ''
                      }
                      onValueChange={(e) => field.onChange(e + '')}
                    >
                      <SelectTrigger disabled={mode === formMode.view}>
                        <SelectValue placeholder={t('startTime')} />
                      </SelectTrigger>
                      <SelectContent>
                        {hourseList.map((hour) => (
                          <SelectItem key={hour} value={hour + ''}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('endTime')}</FormLabel>
                  <FormControl>
                    <Select
                      disabled
                      value={
                        field.value !== undefined && field.value !== null ? String(field.value) : ''
                      }
                      onValueChange={(e) => field.onChange(e + '')}
                    >
                      <SelectTrigger disabled={mode === formMode.view}>
                        <SelectValue placeholder={t('endTime')} />
                      </SelectTrigger>
                      <SelectContent>
                        {hourseList.map((hour) => (
                          <SelectItem key={hour} value={hour + ''}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('lab')}</FormLabel>
                <FormControl>
                  <Select
                    value={
                      field.value !== undefined && field.value !== null ? String(field.value) : ''
                    }
                    onValueChange={(e) => {
                      field.onChange(+e)
                      setMaxStudents(labs?.find((lab) => lab.id + '' === e + '')?.capacity ?? 100)
                    }}
                  >
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('selectLabPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {labs?.map((lab) => (
                        <SelectItem key={lab.id} value={lab.id + ''}>
                          {lab.name}
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
            name="statusId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <FormControl>
                  <Select
                    disabled
                    value={
                      field.value !== undefined && field.value !== null ? String(field.value) : ''
                    }
                    // onValueChange={(e) => field.onChange(+e)}
                  >
                    <SelectTrigger disabled={mode === formMode.view}>
                      <SelectValue placeholder={t('selectStatusPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {groupStatus?.map((status) => (
                        <SelectItem key={status.id} value={status.id + ''}>
                          {status.name}
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
            name="studentIds"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t('students')}</FormLabel>
                <CourseGroupStudents
                  disabled={mode === formMode.view}
                  selectedStudents={field.value}
                  setSelectedStudents={(students) => field.onChange(students.map((id) => id))}
                  maxStudents={maxStudents}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
