import { ArrowLeft, Check, CircleCheck, Mail, Phone } from "lucide-react";
import Link from "next/link";

const nextSteps = [
  "We may contact you if any additional details are required",
  "You will receive further updates through email or phone",
];

export default function ThankYouPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#10100f] px-4 py-10 text-white">
      <div className="pointer-events-none absolute h-[600px] w-[900px] rounded-full bg-[#d3ae69]/[0.03] blur-[120px]" />

      <section className="relative w-full max-w-[720px] rounded-2xl border border-[#403827] bg-[#191918] px-5 py-10 shadow-2xl sm:px-12 sm:py-12">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-[#2a271f]">
          <CircleCheck className="size-11 text-[#d3ae69]" />
        </div>

        <header className="mt-7 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Thank You for Your Submission!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#a7a7a7] sm:text-lg">
            Your form has been submitted successfully. We have received your
            information.
          </p>
        </header>

        <div className="mt-9 rounded-xl border border-[#4b422f] bg-[#24231f] p-5 sm:p-7">
          <h2 className="flex items-center justify-center gap-3 text-lg font-bold sm:text-xl">
            <Check className="size-5 rounded-full border border-[#FFBF3F] p-0.5 text-[#FFBF3F]" />
            What Happens Next?
          </h2>

          <ol className="mt-6 space-y-4">
            {nextSteps.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-4 text-sm leading-6 text-[#b1b1b1] sm:text-base"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#FFBF3F] text-sm font-bold text-[#1b1b19]">
                  {index + 1}
                </span>

                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        {/* Information cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={Mail}
            title="Check Your Email"
            description="We've sent a confirmation to your email address"
          />

          <InfoCard
            icon={Phone}
            title="Expect Our Call"
            description="Our team will contact you within 48 hours"
          />
        </div>

        <div className="mt-8 w-full">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 rounded-xl bg-[#FFBF3F] px-6 py-4 font-semibold text-[#171714] transition hover:bg-[#ffcb63] hover:shadow-[0_0_30px_rgba(211,174,105,0.28)]"
          >
            <ArrowLeft className="size-5" />
            Back to Home Page
          </Link>
        </div>
      </section>
    </main>
  );
}

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <article className="group rounded-xl border border-[#2d2d2a] bg-[#181817] p-5 text-center transition duration-300 hover:border-[#d3ae69]/50 hover:shadow-[0_0_25px_rgba(211,174,105,0.15)]">
      <Icon className="mx-auto size-7 text-[#FFBF3F]" />

      <h3 className="mt-3 font-bold">{title}</h3>

      <p className="mt-1 text-sm leading-5 text-[#9f9f9f]">{description}</p>
    </article>
  );
}
