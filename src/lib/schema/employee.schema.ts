import { z } from 'zod'

export const employeeSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().optional(),
  phone: z.string(),
  address: z.string().nonempty(),
  nationalId: z.string().nonempty(),
  cityId: z.number(),
  department: z.string().nonempty(),
  salary: z.number(),
  salaryTypeId: z.number(),
  jobTitle: z.string().nonempty(),
})

export type EmployeeSchema = z.infer<typeof employeeSchema>
