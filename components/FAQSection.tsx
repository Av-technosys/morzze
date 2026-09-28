import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FaqItem[];
  heading?: string;
}

const FAQSection = ({ faqs, heading = "Frequently Asked Questions" }: FAQSectionProps) => {
  if (!faqs || faqs.length === 0) return null;

  // JSON-LD FAQ schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="space-y-16 bg-black py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2 className="text-3xl md:text-5xl font-bold text-center text-white font-montserrat uppercase tracking-tight">
        {heading}
      </h2>

      <div className="max-w-4xl mx-auto px-4">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-white/10 bg-[#111111] px-6 rounded-lg"
            >
              <AccordionTrigger className="text-white hover:no-underline text-base py-5 font-semibold text-left leading-7">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/90 text-base leading-7 pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQSection;
