import FeaturesGrid from '@/components/warranty/FeaturesGrid'
import HowWarrantyWorks from '@/components/warranty/HowWarrantyWorks'
import NeedHelp from '@/components/warranty/NeedHelp'
import WarrantyBanner from '@/components/warranty/WarrantyBanner'
import WarrantyCoverageGrid from '@/components/warranty/WarrantyCoverageGrid'
import WarrantyServices from '@/components/warranty/WarrantyServices'
import WarrantyTermsSection from '@/components/warranty/WarrantyTermsSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Warranty | Product Guarantee & Support | Morzze`,
  description: `Explore Morzze’s Warranty policy to understand our product guarantee, support process, and defect handling process. We’re dedicated to quality & customer care.`,
  alternates: {
    canonical: "/warranty",
  },
}




const page = () => {
  return (
    <div>
      <WarrantyBanner />
      {/* <WarrantyCoverageGrid /> */}
      <HowWarrantyWorks />
      {/* <WarrantyTermsSection /> */}
      <WarrantyServices />
      <FeaturesGrid />
      <NeedHelp />
    </div>
  )
}

export default page
