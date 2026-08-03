import JoinUsHero from "@/components/career/banner";
import WorkCultureSection from "@/components/career/culture";
import CareersPositionsModal from "@/components/career/jobrole";
import CareersStorySection from "@/components/career/story";
import TeammatesVoiceSlider from "@/components/career/teamMates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Careers at Morzze | Join Our Innovative and Growing Team`,
  description: `Explore career opportunities at Morzze and become part of a growing and innovative brand. Apply now and take the next step in your professional journey.`,
  alternates: {
    canonical: "/career",
  },
}



const page = () => {
  return (
    <div>
      <JoinUsHero />
      <CareersStorySection />
      <TeammatesVoiceSlider />
      <WorkCultureSection />
      <CareersPositionsModal />
    </div>
  );
};

export default page;
