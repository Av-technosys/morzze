import AnimatedCounterBar from "@/components/dealer/counterBar";
import FAQSection from "@/components/dealer/dealerFAQ";
import DealerApplicationForm from "@/components/dealer/dealerForm";
import DealerHero from "@/components/dealer/dealerHero";
import ContactCTASection from "@/components/dealer/dealerQuery";
import MorzzePartnerSection from "@/components/dealer/partnerMorzze";
import TerritoryCoverageSection from "@/components/dealer/territoryPage";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: `Join the Morzze Dealer Network for Kitchen & Bathroom sink`,
  description: 'Partner with Morzze and become a part of our mission to deliver premium kitchen and bathroom solutions that combine innovation, quality, and sustainability.',
  alternates: {
    canonical: "/dealer",
  },
}




const page = () => {
  return (
    <div>
      <DealerHero />
      <AnimatedCounterBar />
      <MorzzePartnerSection />
      <TerritoryCoverageSection />
      <DealerApplicationForm />
      <FAQSection />
      <ContactCTASection />
    </div>
  );
};

export default page;
