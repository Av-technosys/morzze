import React from "react";
import { ContactLink } from "@/components/ContactLink";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: `Return and Exchange Policy | Easy Replacements | Morzze`,
  description: `Learn Morzze’s Return & Exchange policy to explore how to return or replace items easily. We’re committed to a smooth process and customer satisfaction.`,
  alternates: {
    canonical: "/return-exchange",
  },
}



const page = () => {
  return (
    <section className="w-full min-h-screen bg-black text-white  py-10">
      {/* Header */}
      <div className="text-center py-6 border-b border-[#FEFFF1] mb-8">
        <h1 className="text-3xl font-bold">Return & Exchange Policy</h1>
        <p className="text-sm mt-2">Effective Date: October 2, 2024</p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-sm leading-6 px-6 md:px-20 text-gray-300">
        <p>
          Thank you for choosing to shop at Morzze.com, the website owned and
          operated by Anupam Retail Limited. We are dedicated to providing you
          with a delightful shopping experience. To ensure clarity and
          transparency, we have outlined our Return and Exchange Policy below.
        </p>

        {/* 1 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            1. Returns and Exchanges Eligibility
          </h2>

          <p className="font-semibold text-white mt-2">
            1.1 Non-Personalized Products:
          </p>
          <p>
            We gladly accept returns and exchanges for non-personalized products
            if you are not entirely satisfied with your purchase. To be eligible
            for a return or exchange, please ensure the following conditions are
            met:
          </p>
          <ul className="list-disc ml-6">
            <li>
              The product must be in its original condition, unopened, unused,
              and in its original packaging.
            </li>
            <li>The product is purchased from Morzze.com only.</li>
            <li>
              The return or exchange request must be initiated within 3 days of
              receiving the product.
            </li>
            <li>
              Proof of purchase, such as the order number and purchase receipt,
              must be provided.
            </li>
          </ul>

          <p className="font-semibold text-white mt-4">
            1.2 Personalized Products:
          </p>
          <p>
            Due to the customized nature of personalized products, we can only
            accept returns or exchanges for these items if there is a defect or
            error in personalization. In such cases, please contact our customer
            support team for assistance.
          </p>
        </div>

        {/* 2 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            2. Return and Exchange Process
          </h2>

          <p className="font-semibold text-white mt-2">
            2.1 Initiate a Return or Exchange Request:
          </p>
          <p>
            To request a return or exchange for eligible products, please follow
            these steps:
          </p>
          <p>
            Contact our customer support team at{" "}
            <ContactLink type="email" value="info@morzze.com" /> or call us at{" "}
            <ContactLink type="phone" value="1800 11 0123" />. Provide details
            of your purchase, including the order number and the reason for your
            return or exchange request.
          </p>

          <p className="font-semibold text-white mt-4">
            2.2 Return Authorization:
          </p>
          <p>
            After receiving your return or exchange request, we will provide you
            with detailed instructions on how to return the product. Please
            package the product securely and include a copy of your purchase
            receipt.
          </p>

          <p className="font-semibold text-white mt-4">
            2.3 Inspection and Processing:
          </p>
          <p>
            Once we receive the returned product, our team will carefully
            inspect it to ensure it meets the eligibility criteria. If the
            product is in acceptable condition, we will proceed with the return
            or exchange process.
          </p>

          <p className="font-semibold    text-white mt-4">
            2.4 Refund or Exchange:
          </p>
          <p>
            You may choose between a refund or an exchange for an eligible
            product. Refunds will be processed using the original payment method
            used for the purchase. Please allow 10 business days for the refund
            to be credited to your account. Exchanges will be shipped to you
            free of charge.
          </p>
        </div>

        {/* 3 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            3. Non-Returnable Items
          </h2>
          <p>The following items are non-returnable:</p>
          <ul className="list-disc ml-6">
            <li>Personalized products (unless there is a defect or error)</li>
            <li>Gift cards or vouchers</li>
            <li>Products that have been used or damaged</li>
            <li>
              Products returned after the specified return and exchange period
            </li>
          </ul>
        </div>

        {/* 4 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            4. Return Shipping Costs
          </h2>
          <p>
            Return shipping costs are generally the responsibility of the
            customer, except when the return is due to a defect or error on our
            part. If you are returning a product due to a defect or error,
            please contact our customer support team for assistance with return
            shipping arrangements.
          </p>
        </div>

        {/* 5 */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            5. Contact Us
          </h2>
          <p>
            If you have any questions or need further assistance regarding our
            return and exchange policy, please do not hesitate to contact us at:
          </p>
          <p className="mt-2">Anupam Retail Limited</p>
          <p>
            Email: <ContactLink type="email" value="info@morzze.com" />
          </p>
          <p>
            Helpline: <ContactLink type="phone" value="1800 11 0123" />
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-400 pt-4 border-t border-gray-700">
          By shopping at Morzze.com, you acknowledge that you have read and
          understood this Return & Exchange Policy and agree to its terms and
          conditions. If you do not agree with any aspect of this policy, please
          refrain from making purchases on our website.
        </p>
      </div>
    </section>
  );
};

export default page;
