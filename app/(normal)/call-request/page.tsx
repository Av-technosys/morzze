import { Metadata } from "next";
import { RequestCallbackFrom } from "./RequestCallBackForm";

export const metadata: Metadata = {
  title: `Talk to a Morzze Expert – Request a Callback Today`,
  description: `Have questions before you buy? Let a Morzze expert guide you. Request a callback and get personalised advice on sinks, faucets & more. Free support.`,
  alternates: {
    canonical: "/call-request",
  },
};

const CallbackForm = () => {
  return (
    <section className="w-full h-full bg-black py-10">
      <div className="max-w-4xl mx-auto bg-[#0A0A0A] border border-white/5 p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Connect with Us
          </h1>
          <h2 className="text-white/80 text-sm mt-2">
            Reach out for personalised support.
          </h2>
        </div>

        <RequestCallbackFrom />
      </div>
    </section>
  );
};

export default CallbackForm;
