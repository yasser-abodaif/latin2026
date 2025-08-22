import ReceiptForm from './(components)/receipt-form'
import { ReceiptTable } from './(components)/receipt-table'
// import { getReceipts } from './receipt.action'

export default async function ReceiptPage() {
  // const receipts = await getReceipts()

  return (
    <div className="flex grow flex-col gap-4">
      <ReceiptForm />
      <ReceiptTable data={[]} />
    </div>
  )
}
