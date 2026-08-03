import { Metadata } from 'next'
import React from 'react'
import ContactClient from './Client'


export const metadata: Metadata = {
  title: `Contact Morzze | Get in Touch with Us | Premium Service`,
  description: `Have questions or need assistance? Contact Morzze for support, inquiries, or dealership opportunities. We're here to provide top-notch service and solutions.`,
  alternates: {
    canonical: "/contact",
  },
}



const page = () => {
  return (
    <ContactClient />
  )
}

export default page
