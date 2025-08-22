import { AgreementTable } from './(components)/agreement-table'
import { getAgreements } from './agreement.action'

export default async function AgreementsPage() {
  const agreements = await getAgreements()
  return <AgreementTable data={agreements.data} />
}
