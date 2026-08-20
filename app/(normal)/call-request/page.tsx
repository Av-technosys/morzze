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
      <div className="max-w-4xl mx-auto ">
        <RequestCallbackFrom />
      </div>
    </section>
  );
};

export default CallbackForm;
