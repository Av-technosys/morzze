import React from "react";
import { ContactLink } from "@/components/ContactLink";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: `Privacy Policy | Data Protection & Security | Morzze`,
  description: `Read Morzze’s Privacy Policy to learn how we collect, use, and protect your data. We’re committed to transparency, security, and protecting your privacy.`,
  alternates: {
    canonical: "/privacy-policy",
  },
}



const page = () => {
  return (
    <section className="w-full min-h-screen bg-black text-white  py-10">
      {/* Header */}
      <div className="text-center py-6 border-b border-[#FEFFF1] mb-8">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm mt-2">Effective Date: October 2, 2024
          Last Updated: June 18, 2026</p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-sm leading-6 px-6 md:px-20 text-gray-300">
        <p>
          Welcome to Morzze.com, an online platform provided by Anupam Retail
          Limited. This Privacy Policy is designed to help you understand how we
          collect, use, disclose, and safeguard your personal information. By
          using Morzze.com, you agree to the terms outlined in this policy.
        </p>

        {/* Information We Collect */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Information We Collect
          </h2>

          <p className="font-medium text-white">1. Personal Information</p>
          <p>
            We may collect the following personal information when you use
            Morzze.com:
          </p>
          <ul className="list-disc ml-6">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information</li>
            <li>Demographic information</li>
          </ul>

          <p className="font-medium text-white mt-4">2. Usage Information</p>
          <p>
            We collect information about how you interact with Morzze.com,
            including pages visited, products viewed, and actions taken.
          </p>

          <p className="font-medium text-white mt-4">3. Device Information</p>
          <p>
            We may collect information about the device you use to access
            Morzze.com, including the device type, operating system, browser
            type, and IP address.
          </p>

          <p className="font-medium text-white mt-4">
            4. Cookies and Tracking Technologies
          </p>
          <p>
            We use cookies and similar tracking technologies to enhance your
            experience on Morzze.com and for analytics purposes. You can
            control cookies through your browser settings.
          </p>
        </div>

        {/* How We Use */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            How We Use Your Information
          </h2>
          <ul className="list-disc ml-6">
            <li>To provide and maintain Morzze.com services</li>
            <li>To process and fulfill orders</li>
            <li>
              To communicate with you about orders, products, promotions, and
              updates
            </li>
            <li>To improve our services</li>
          </ul>
        </div>

        {/* Information Sharing */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Information Sharing
          </h2>
          <p>
            We may share your information with third parties in the following
            circumstances:
          </p>
          <ul className="list-disc ml-6">
            <li>
              With service providers who assist us in operating Morzze.com and
              providing services
            </li>
            <li>
              With trusted partners for marketing and promotional purposes, but
              only with your explicit consent
            </li>
            <li>
              In response to legal requests, such as a court order or government
              investigation
            </li>
          </ul>
        </div>

        {/* Your Choices */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Your Choices
          </h2>
          <p>
            You can access, update, or delete your personal information through
            your Morzze.com account settings. You can opt out of receiving
            marketing communications from us by following the unsubscribe
            instructions included in emails.
          </p>
        </div>

        {/* Security */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Security</h2>
          <p>
            We take appropriate measures to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>

        {/* Governing Law */}
        <div>
          <p>
            This Privacy Policy is governed by and construed in accordance with
            the laws of India. Any disputes arising under or in connection with
            this Privacy Policy shall be subject to the exclusive jurisdiction
            of the competent courts in Delhi, India.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Data Retention
          </h2>
          <p>
            We retain your personal information only as long as necessary to provide
            services, comply with legal obligations, resolve disputes, and enforce our
            agreements.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Payment Information
          </h2>
          <p>
            Payments are processed securely through authorized payment gateway providers
            including Razorpay. We do not store card numbers, CVV, UPI PINs, or other
            sensitive payment credentials on our servers.
          </p>
        </div>

        {/* Changes */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Changes to this Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and the effective date will be updated
            accordingly.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:{" "}
            {/* <ContactLink type="email" value="info@morzze.com" /> */}
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-400 pt-4 border-t border-gray-700">
          By using our services, you acknowledge that you have read and
          understood this Privacy Policy and agree to our practices regarding
          your personal information. Please check this Privacy Policy regularly
          for updates. Your continued use of Morzze.com after changes to this
          policy will signify your acceptance of those changes.
        </p>
      </div>
    </section>
  );
};

export default page;
