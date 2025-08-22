import { LabTable } from './(components)'
import { getLabs } from './lab.action'

export default async function LabsPage() {
  const labs = await getLabs()
  return <LabTable data={labs.data} />
}
