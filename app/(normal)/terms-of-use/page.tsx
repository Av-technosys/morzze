import React from "react";
import { ContactLink } from "@/components/ContactLink";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: `Terms of Use | Service Agreement & User Guidelines | Morzze`,
  description: `Review Morzze’s Terms of Use to understand the rules, responsibilities, and service agreement that define your access and use.`,
  alternates: {
    canonical: "/terms-of-use",
  },
}



const page = () => {
  return (
    <section className="w-full min-h-screen bg-black text-white  py-10">
      {/* Header */}

      <div className="text-center py-6 border-b border-[#FEFFF1] mb-8">
        <h1 className="text-3xl font-bold">Terms of Use</h1>
        <p className="text-sm mt-2">Effective Date: October 2, 2024</p>
      </div>
      <div className="px-6 md:px-20">
        {/* Content */}
        <div className="space-y-6 text-sm leading-6 text-gray-300">
          <p>
            Welcome to Morzze.com (the "Website"), owned and operated by Anupam
            Retail Limited ("Company", "we", "us", or "our"). Please read these
            Terms of Use ("Terms") carefully before using our Website.
          </p>

          <p>
            By accessing or using the Website, you agree to be bound by these
            Terms. If you do not agree to these Terms, please do not use our
            Website.
          </p>

          {/* 1 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              1.1 These Terms constitute a legally binding agreement between you
              and Anupam Retail Limited.
            </p>
            <p>
              1.2 We reserve the right to modify these Terms at any time without
              notice. Your continued use of the Website after such modifications
              will constitute your acknowledgment and acceptance of the revised
              Terms.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              2. User Registration
            </h2>
            <p>
              2.1 To access certain features of the Website, you may be required
              to register an account. You agree to provide accurate, current,
              and complete information during the registration process.
            </p>
            <p>
              2.2 You are responsible for maintaining the confidentiality of
              your account credentials and for all activities that occur under
              your account.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              3. Website Content
            </h2>
            <p>
              3.1 All content on the Website, including but not limited to text,
              graphics, images, videos, and software, is the property of Anupam
              Retail Limited and is protected by intellectual property laws.
            </p>
            <p>
              3.2 You may not reproduce, distribute, modify, or create
              derivative works from the content without prior written consent.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              4. User Conduct
            </h2>
            <p>
              4.1 You agree to use the Website for lawful purposes only and to
              comply with all applicable laws and regulations.
            </p>
            <p>
              4.2 You may not engage in any of the following prohibited
              activities:
            </p>
            <ul className="list-disc ml-6">
              <li>
                Posting or transmitting any unlawful, harmful, or offensive
                content
              </li>
              <li>
                Attempting to gain unauthorized access to the Website or its
                systems
              </li>
              <li>Interfering with the proper functioning of the Website</li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              5. Privacy
            </h2>
            <p>
              Your use of the Website is also governed by our Privacy Policy.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              6. Disclaimer of Warranties
            </h2>
            <p>
              The Website is provided "as is" and "as available" without
              warranties of any kind, either express or implied, including but
              not limited to implied warranties of merchantability or fitness
              for a particular purpose.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Anupam Retail Limited
              shall not be liable for any direct, indirect, incidental, special,
              consequential, or punitive damages arising out of or in connection
              with your use of the Website.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              8. Contact Information
            </h2>
            <p>
              If you have any questions or concerns about these Terms,
              please contact us at:{" "}
              <ContactLink type="email" value="info@morzze.com" />
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              9. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your access to
              the Website at our sole discretion, without notice, for any
              reason.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              10. Third-Party Links
            </h2>
            <p>
              The Website may contain links to third-party websites or
              resources. We are not responsible for the availability, accuracy,
              or content of these external sites.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              11. Changes to the Agreement
            </h2>
            <p>
              We reserve the right to modify or update these Terms at any
              time, and such modifications will be effective immediately upon
              posting on the Website.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              12. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless Anupam
              Retail Limited from any claims, damages, losses, or expenses
              arising out of your use of the Website.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              13. Notice
            </h2>
            <p>
              Any notices or communications will be provided via email or
              through the Website.
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              14. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms are governed by the laws of Delhi, India, and any
              disputes shall be subject to the exclusive jurisdiction of the
              courts in Delhi.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              15. Effective Date
            </h2>
            <p>
              These Terms are effective as of the date of your first use of
              the Website.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              16. Orders and Payments
            </h2>
            <p>
              Users agree to provide accurate billing and payment information. All payments are processed through secure third-party payment gateways. We reserve the right to refuse or cancel any order if fraudulent or unauthorized activity is suspected.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              17. Pricing and Availability
            </h2>
            <p>
              All prices displayed on the Website are subject to change without prior notice. We reserve the right to modify, discontinue, or limit the availability of any product or service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
