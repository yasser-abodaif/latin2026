import { LeadTable } from './(components)'
import { getLeads } from './lead.action'

export default async function LeadsPage() {
  const leads = await getLeads()
  return <LeadTable data={leads.data} />
}
