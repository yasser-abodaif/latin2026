'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReceiptSchema } from '@/lib/schema'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getStudentBalance, getStudents } from '../../students/student.action'
import { IStudent } from '../../students/(components)/student.interface'
import { createReceipt } from '../receipt.action'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { IStudentBalance } from './receipt.interface'
import { Badge } from '@/components/ui/badge'

export default function ReceiptForm() {
  const t = useTranslations('receipt')
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<IStudent[]>([])
  const [enrollments, setEnrollments] = useState<IStudentBalance[]>([])

  const form = useForm<ReceiptSchema>({
    resolver: zodResolver(ReceiptSchema),
    defaultValues: {
      amount: 0,
    },
  })

  const receiptType = form.watch('receiptType')
  const studentId = form.watch('studentId')
  const enrollmentId = form.watch('enrollmentId')
  const amount = form.watch('amount')

  const enrollment = enrollments?.find(
    (enrollment) => Number(enrollment?.enrollmentId) === Number(enrollmentId)
  )

  useEffect(() => {
    const fetchStudentBalance = async () => {
      try {
        setIsLoading(true)
        const res = await getStudentBalance(studentId!)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    if (studentId) {
      fetchStudentBalance()
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [studentId])

  useEffect(() => {
    getStudents().then((res) => setStudents(res.data))
  }, [])

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (studentId && receiptType === 'student_payment') {
        try {
          setIsLoading(true)
          const res = await getStudentBalance(studentId)
          setEnrollments(res)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setEnrollments([])
      }
    }
    fetchEnrollments()
  }, [studentId, receiptType])

  const onSubmit = async (data: ReceiptSchema) => {
    try {
      setIsLoading(true)
      await createReceipt(data)
      toast.success('Success', {
        description: 'Receipt created successfully.',
      })

      form.reset()
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to create receipt.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('student')}</FormLabel>
                <Select onValueChange={field.onChange} value={String(field?.value)}>
                  <FormControl>
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder={t('selectStudent')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={String(student.id)}>
                        {student.name}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </motion.div>

        {/* <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('date')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        /> */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FormField
            control={form.control}
            name="receiptType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('receiptType')}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.setValue('amount', 0)
                    form.setValue('enrollmentId', undefined)
                    form.setValue('serviceType', '')
                    setEnrollments([])
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectReceiptType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student_payment">
                      {t('receiptTypeStudentPayment')}
                    </SelectItem>
                    <SelectItem value="service_charge">{t('receiptTypeServiceCharge')}</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </motion.div>

        <AnimatePresence>
          {receiptType === 'service_charge' && (
            <motion.div
              initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, width: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1"
            >
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="whitespace-nowrap">{t('serviceType')}</FormLabel>
                    <Input type="text" {...field} className="w-40" />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {receiptType === 'student_payment' && (
            <motion.div
              initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, width: 160, overflow: 'visible' }}
              exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1"
            >
              <FormField
                control={form.control}
                name="enrollmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('enrollment')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectEnrollment')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enrollments.map((enrollment) => (
                          <SelectItem
                            key={enrollment.enrollmentId}
                            value={String(enrollment.enrollmentId)}
                          >
                            {enrollment.groupName} - {enrollment.courseName} -{' '}
                            {enrollment.levelName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <AnimatePresence>
            {receiptType === 'student_payment' && enrollmentId && (
              <motion.div
                initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, width: 'auto', overflow: 'visible' }}
                exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-between gap-2"
              >
                <h4 className="text-sm font-medium">{t('paid')}</h4>
                <Badge className="mb-2" variant="outline">
                  {enrollment?.paidAmount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('amountPaid')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="w-32"
                      value={amount}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (receiptType === 'student_payment' && enrollmentId) {
                          if (value > (enrollment?.remainingBalance ?? 0)) {
                            toast.error('Amount is greater than remaining balance')
                            field.onChange(enrollment?.remainingBalance ?? 0)
                          } else {
                            field.onChange(value)
                          }
                        } else {
                          field.onChange(value)
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          <AnimatePresence>
            {receiptType === 'student_payment' && enrollmentId && (
              <motion.div
                initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, width: 'auto', overflow: 'visible' }}
                exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-between gap-2"
              >
                <h4 className="text-sm font-medium">{t('paid')}</h4>
                <Badge className="mb-2" variant="outline">
                  {enrollment?.remainingBalance ? enrollment?.remainingBalance - amount : 0}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-end"
        >
          <Button type="submit" className="justify-end self-end" disabled={isLoading}>
            <span className="flex items-center gap-2">
              <SaveIcon className="h-4 w-4" />
              {t('save')}
            </span>
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}
