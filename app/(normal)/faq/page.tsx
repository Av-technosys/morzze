import React from 'react'
import FAQSection from './ClientPage'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: `Frequently Asked Questions | Morzze`,
  description: 'Morzze offers high-quality kitchen and bathroom sinks—stylish, functional, and designed to fit any decor. Explore our collection and transform your space today.',
  alternates: {
    canonical: "/faq",
  },
}



const page = () => {
  return (
    <FAQSection />
  )
}

export default page