"use client";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconSettings,
  IconBrandWhatsapp,
  IconPhoneFilled,
} from "@tabler/icons-react";

import Link from "@/hooks/appLink";

const SupportTabs = () => {
  const searchParams = useSearchParams();

  const defaultTab = searchParams.get("tab") || "";

  return (
    <section className="bg-black py-16 px-6 font-montserrat ">
      <Tabs defaultValue={defaultTab} className="max-w-7xl mx-auto">
        {/* --- GRID TABS LIST --- */}
        <TabsList
          className=" grid grid-cols-2 md:grid-cols-4
    w-fit mx-auto
    gap-4
    bg-transparent
    h-auto
    mb-20
    p-0"
        >
          {/* Tab 1: Callback */}
          <Link href="/call-request" className="flex w-full">
            <TabsTrigger value="callback" className="group p-0 border-none  ">
              <div
                className="
      bg-[#111] w-full aspect-square p-6 flex flex-col justify-between  relative overflow-hidden
      transition-colors
      
    "
              >
                {/* TEXT */}
                <span
                  className="
          text-white text-lg md:text-xl font-bold z-10
          
        "
                >
                  1. Request a <br /> Callback
                </span>

                {/* BIG ICON */}
                <IconPhoneFilled
                  className="
    !w-[260px] !h-[260px]   // 🔥 override size-4
    absolute -bottom-20 -left-20
    text-white/30
    pointer-events-none
    z-0 group-hover:scale-105
    
  "
                  stroke={2.5}
                />
              </div>
            </TabsTrigger>
          </Link>

          {/* Tab 2: FAQ */}
          <Link href="/faq" className="flex w-full">
            <TabsTrigger
              value="faq"
              className="group p-0 border-none data-active:ring-0"
            >
              <div
                className="
      bg-[#111] w-full aspect-square p-6 flex flex-col justify-between relative overflow-hidden
      transition-colors
      group-data-active:bg-[#FDB813]
    "
              >
                <span
                  className="
        text-white text-lg md:text-xl font-bold text-left leading-tight z-10
        transition-colors
        group-data-active:text-black
      "
                >
                  2. Frequently Asked <br /> Questions
                </span>

                <span
                  className="
        absolute -bottom-2 -left-2 text-7xl font-black opacity-10 text-white
        transition-all
        group-data-active:text-black
        group-data-active:opacity-20
        group-hover:scale-105
      "
                >
                  FAQ
                </span>
              </div>
            </TabsTrigger>
          </Link>

          {/* Tab 3: Service Request */}
          <Link href="/service-request" className="flex w-full">
            <TabsTrigger
              value="service"
              className="group p-0 border-none data-active:ring-0 transition-all"
            >
              <div
                className="
      bg-[#111] w-full aspect-square p-6 flex flex-col justify-between relative overflow-hidden
      transition-colors
      group-data-active:bg-[#FEFFF1]
    "
              >
                {/* TEXT */}
                <span
                  className="
        text-white text-lg md:text-xl font-bold text-left leading-tight z-10
        transition-colors
        group-data-active:text-black
      "
                >
                  3. Service <br /> Request
                </span>

                {/* BIG BACKGROUND ICON */}
                <IconSettings
                  className="
        !w-[200px] !h-[200px]
        absolute -bottom-9 -left-9
        text-white/30
        pointer-events-none
        z-0
        transition-all duration-300
        group-data-active:text-black/30
        group-hover:scale-105
      "
                  stroke={2}
                />
              </div>
            </TabsTrigger>
          </Link>

          {/* Tab 4: Whatsapp */}
          <Link href="/whatsapp-chat" className="flex w-full">
            <TabsTrigger
              value="whatsapp"
              className="group p-0 border-none data-active:ring-0 transition-all"
            >
              <div
                className="
      bg-[#111] w-full aspect-square p-6 flex flex-col justify-between relative overflow-hidden
      transition-colors
      group-data-active:bg-[#25D366]
    "
              >
                {/* TEXT */}
                <span
                  className="
        text-white text-lg md:text-xl font-bold text-left leading-tight z-10
        transition-colors
        group-data-active:text-black
      "
                >
                  4. WhatsApp
                </span>

                {/* BIG BACKGROUND ICON */}
                <IconBrandWhatsapp
                  className="
        !w-[200px] !h-[200px]
        absolute -bottom-6 -left-6
        text-white/30
        pointer-events-none
        z-0
        transition-all duration-300
        group-data-active:text-black/30
        group-hover:scale-105
      "
                  stroke={2}
                />
              </div>
            </TabsTrigger>
          </Link>
        </TabsList>

        {/* --- TABS CONTENT --- */}
        <div className="md:mt-50 mt-70 ">
          <TabsContent value="callback">{/* <CallbackForm /> */}</TabsContent>

          <Link href="/faq">
            <TabsContent value="faq">{/* <FAQSection /> */}</TabsContent>
          </Link>
          <TabsContent value="service">{/* <ServiceRequest /> */}</TabsContent>

          <TabsContent value="whatsapp">{/* <WhatsappChat /> */}</TabsContent>
        </div>
      </Tabs>
    </section>
  );
};

export default SupportTabs;
