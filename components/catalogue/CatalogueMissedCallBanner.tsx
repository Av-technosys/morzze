import { PhoneCall } from "lucide-react";

export default function CatalogueMissedCallBanner() {
  const phoneNumber = "8750313000";
  const whatsappText = encodeURIComponent(
    "Give a missed call on 87503 13000 to get catalogue on WhatsApp",
  );

  return (
    <section className="w-full bg-black pt-5 pb-12">
      <div className="px-4 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[26px] border border-[#3a3220] bg-[#121212] px-5 py-5 md:px-8 md:py-7 shadow-[0_0_0_1px_rgba(214,165,53,0.06),0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-full w-40 bg-linear-to-r from-[#d39b10]/10 to-transparent" />
            <div className="absolute right-0 top-0 h-full w-40 bg-linear-to-l from-[#36d26b]/10 to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d39b10]/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex-1">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="-mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d39b10]/30 bg-[#d39b10]/10 text-[#d39b10]">
                    <PhoneCall size={18} />
                  </div>

                  <p className="max-w-3xl text-[13px] leading-7 text-[#efefef]/92 md:text-[17px]">
                    Give a missed call on <span className="font-semibold text-white">87503 13000</span> to get catalogue on WhatsApp
                  </p>
                </div>

                <div className="flex items-center gap-3 md:gap-4 md:pl-4">
                  <a
                    href={`tel:${phoneNumber}`}
                    className="inline-flex h-12 w-36.5 items-center justify-center rounded-full bg-white px-6 text-[13px] font-semibold text-[#121212] transition hover:bg-[#f2f2f2]"
                  >
                    Missed Call
                  </a>

                  <a
                    href={`https://wa.me/91${phoneNumber}?text=${whatsappText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 w-36.5 items-center justify-center rounded-full bg-[#2fd466] px-6 text-[13px] font-semibold text-white transition hover:bg-[#24c25a]"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}