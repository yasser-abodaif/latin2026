import { getCampaigns } from './campaign.action'
import { CampaignTable } from './(components)'

export default async function CampaignPage() {
  const data = await getCampaigns()

  return <CampaignTable data={data.data} />
}
