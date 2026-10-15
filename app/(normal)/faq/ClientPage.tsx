"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { LinkifiedContactText } from "@/components/ContactLink";

// 1. Data ko bahar nikal lo handle karne ke liye
const FAQ_CONTENT = {
  General: [
    {
      q: "What’s your helpline number?",
      a: "You can contact us at 1800 110 123 from Monday to Saturday (9:30am to 7:00pm).",
    },
    {
      q: "What’s your support email ID?",
      a: "Our support mail ID is info@morzze.com.",
    },
    {
      q: "Where can I get your catalogue?",
      a: "To get our catalogue, just give a missed call to (91) 87503 13000 and you will get it immediately on WhatsApp.",
    },
    {
      q: "I am interested in dealerships or distributorships.",
      a: "Please contact our customer care number 1800 110 123 or visit https://morzze.com/dealer/",
    },
    {
      q: "Are Morzze’s kitchen sinks scratch free?",
      a: "No, kitchen sinks are not completely scratch-free. While some materials, such as granite composite, may be more resistant to scratches than others, it's still possible for any sink surface to get scratched over time with regular use. Factors such as the hardness of the materials used, the sharpness of utensils, and the care taken during cleaning can all contribute to the likelihood of scratches appearing on a sink. To minimize the risk of scratches, it's essential to use gentle cleaning methods and avoid using abrasive materials or harsh chemicals on your sink. Additionally, using sink grids or mats at the bottom of the sink can provide a buffer between dishes and the sink surface, helping to prevent scratches. .",
    },
    {
      q: "My tap/faucet is leaking, what should I do?",
      a: "Please contact our customer service at 1800 110 123 or lodge a complaint through https://morzze.com/service-request/",
    },
    {
      q: "My sink is leaking, what should I do?",
      a: "Please contact our customer service at 1800 110 123 or lodge a complaint through https://morzze.com/service-request/",
    },
    {
      q: "Where are you located?",
      a: "Our headquarter is in New Delhi, but our presence is all over India.",
    },
    {
      q: "Do you have a dealer in my city?",
      a: "To find a dealer, kindly visit https://morzze.com/stores/",
    },
    {
      q: "How do I get a call back?",
      a: "Schedule a call from https://morzze.com/call-request/",
    },
    {
      q: "What’s your mobile or phone number?",
      a: "You can contact us at 011-45458822 from Monday to Saturday between 9:30am to 6:30pm.",
    },
    {
      q: "I want to submit feedback regarding your services or products.",
      a: "You can submit feedback through https://morzze.com/feedback/",
    },
    {
      q: "I am facing some issues with my Morzze product, how to register service/complaint requests?",
      a: "You can register your service request/complaint by https://morzze.com/service-request/.",
    },
    {
      q: "Can I buy products online?",
      a: "You can register your new Morzze product at https://morzze.com/register-a-product/",
    },
    {
      q: "How to contact Morzze?",
      a: "You can contact us here https://morzze.com/contact/",
    },
    {
      q: "What is the shipping cost and estimated delivery time?",
      a: "Shipping is free for orders above ₹5,000. Estimated delivery time is 7-10 days.",
    },
    {
      q: "Can I return or exchange a product if I'm not satisfied?",
      a: "Yes, if you contact us within 24 hours of receiving the product, we will refund or exchange it.",
    },
    {
      q: "How many liters of water does a kitchen sink hold?",
      a: "To find the litre capacity of a sink, you multiply the length by width by depth (L x W x D) of your sink bowl and divide the answer by 63, which is the cubic volume by inches in a litre. The length is the measurement of the bowl from right to left. The width is the measurement from back to front.",
    },
    {
      q: "How do I choose a kitchen sink size?",
      a: "Experts recommend at least 22 to 27-inches in length, which also works for small kitchens and 40 to 50 inches for large kitchens. Although the size of the sink totally depends on your requirement and space. Length is one factor, but you also have to consider the depth of the sink. Kitchen sinks should be at least 8 to 9 inches deep; anything less and your dishes will quickly pile up and reach the faucet.",
    },
    {
      q: "Which type of mounting is better – Top mount or undermount sink?",
      a: "Undermount sinks are generally preferred as they are easier to clean and provide a more seamless look.",
    },
    {
      q: "How do I measure sink depth?",
      a: "Lay a straight edge across the top surface of the sink rim. Then use a ruler to measure the distance between the bottom edge of the straight edge and bowl bottom, as close to the drain as possible.",
    },
    {
      q: "How do I compare sink size and capacity?",
      a: "Bowl depth, taper and radius are the three basic sink measurements for comparing sink sizes. Depth, of course, is the distance from the top of the rim to the bottom of the sink next to the drain. Bowl taper is the inward slope of each side of the sink from rim to bottom. Radius is the measure of the bowl's corners & bottoms where the sides and bottom meet. The point to remember is this: the deeper the bowl, the straighter the slope, the smaller the radius, the more useful the sink capacity.",
    },
  ],
  "Stainless Steel Sink": [
    {
      q: "What’s the warranty on sinks?",
      a: "Morzze sinks are warranted for two years from the date of purchase against any manufacturing defect on normal residential use only. No warranty will stand if used in a commercial area. Kindly click https://morzze.com/warranty/ to check warranty conditions.",
    },
    {
      q: "How do I clean the surface of Morzze Aura Collection Stainless Steel Sink?",
      a: "Morzze Aura Collection stainless steel sinks are extremely easy to clean. Please see our care and cleaning instructions with this link https://morzze.com/care/ or download our care and cleaning instruction manual by using this link https://anpm.in/qBfL.",
    },
    {
      q: "Which chemicals are harmful for the sink?",
      a: "Acid, toilet cleaners, or any alkaline cleaners can harm the surface of the sink. Using any of these will void the warranty of the product.",
    },
    {
      q: "How many finishes are available in kitchen sinks?",
      a: "We have a matte finish in stainless steel sinks and three colors in granite sinks: Black, Grey, and Beige.",
    },
    {
      q: "How important is the undercoating?",
      a: "It's extremely important because it absorbs sound, protects against condensation, and helps maintain sink water temperature. All Morzze Stainless Sinks are spray-coated with exclusive undercoating. With our Sound Guard Undercoating, available on all models, an additional sound-deadening pad is applied before spraying.",
    },
    {
      q: "Are there different types of stainless steel for sinks?",
      a: "Yes. That's why some steel sinks look bright and shiny at first but soon rust or corrode. The premium-grade steel we select for our high-end residential sinks is stainless steel Type SUS 304. It combines chromium and nickel in exactly the right proportions for superior corrosion resistance and durability. This blend allows the sink to be formed into the dramatic shapes you'll find in the Morzze line. You'll also find that this steel gives a little, reducing the chance of dish breakage.",
    },
    {
      q: "What’s the life of a kitchen sink in normal working condition?",
      a: "Morzze stainless steel sinks will work for at least 25 to 30 years in normal residential use.",
    },
    {
      q: "Is PVD coating or any colour coating suitable on kitchen sinks?",
      a: "We do not recommend any colour coating on kitchen sinks because no coating is long-lasting when washing utensils.",
    },
    {
      q: "How to remove scaling from my sink?",
      a: "Use Morzze’s Mettloshine® to remove scaling from the sink, or you can remove scale using white vinegar and baking soda by following these steps Clean the sink with hot water. Spray white vinegar on it. Sprinkle baking soda Wait for 15 minutes Clean with a scrubber Once youve removed the deposits clean your sink regularly and dry it after each use to prevent scale from accumulating again. Dont scrub stainless steel with abrasive cleaners or brushes, as this can damage the finish.",
    },
    {
      q: "Which grade of stainless steel do you use?",
      a: "We use SUS-304 grade stainless steel in the Aura Collection.",
    },
    {
      q: "What’s the thickness of kitchen sinks?",
      a: "We use 1.0mm thick stainless steel for the bowl and 3mm for the frame construction in the Aura Collection.",
    },
    {
      q: "Do sinks scratch easily?",
      a: "The appearance of minor scratches within the first few weeks of use is absolutely normal and to be expected. Do not be alarmed if small scratches or scuffs appear in your new sink, as they are often superficial scratches that will become less noticeable with age.",
    },
    {
      q: "How do I stop my sink from scratching?",
      a: "Install a stainless steel bottom grid in your sink to protect the basin from scratches. Don't use rubber mats because corrosive chemicals can become trapped between the mat and the sink. Bottom grids allow a free flow of water to keep the basin clean.",
    },
    {
      q: "Why is my new sink rusting?",
      a: "When water evaporates, it leaves a residue that dries on the sink's surface, turning rusty in color. Another common cause of surface rust is chlorides left on the sink surface, which are found in many common detergents, soaps, and cleaners.",
    },
    {
      q: "How do I keep my kitchen sink from rusting?",
      a: "Rinse your fixtures thoroughly after every use. Clean all stainless steel fixtures at least once a week. Avoid cleaners containing chloride (bleach), as they can corrode the fixture. Use mild cleaners.",
    },
    {
      q: "What should you not use on stainless steel?",
      a: "Avoid using the following cleaning products on stainless steel:",
    },
    {
      q: "Why is stainless steel good for the kitchen sink?",
      a: "It's the most popular sink material in home kitchens for very good reasons: stainless steel sinks are durable, low-maintenance, heat- and stain-resistant, affordable, and impervious to chipping and cracking.",
    },
    {
      q: "What size is a standard sink tap hole?",
      a: "Standard taps and spouts generally require a hole of at least 22mm in diameter for single inlet water taps, with most requiring a 35mm diameter hole.",
    },
    {
      q: "What does minimum cabinet size mean for sinks?",
      a: "A sink's minimum cabinet size is a measurement indicating the least amount of under-cabinet and top counter space required for the sink to fit properly.",
    },
    {
      q: "Where should a sink be placed on a countertop?",
      a: "Position the sink so it is centered on the sink cabinet and is at least 1 1/2 inches back from the countertop's front edge. If your countertop is deeper than 24 inches, place it farther back, but not more than 4 inches.",
    },
    {
      q: "What size cabinet do I need for a 36-inch sink?",
      a: "You will need a cabinet that is at least 36 inches wide to accommodate a 36-inch sink.",
    },
    {
      q: "Will a 30-inch sink fit in a 30-inch cabinet?",
      a: "To determine the maximum sink size for your base cabinet, measure the interior of your cabinet and subtract two to three inches from each dimension. A 36″ base cabinet can handle a 33″ sink at most; a 30″ cabinet should be fitted with a sink no larger than 27″ wide.",
    },
    {
      q: "Can we replace a sink without replacing the countertop?",
      a: "It's possible for a plumber to make that switch with the sinks without too much trouble, although your sink will have to be out of service for a day or two.Undermounted sinks are generally held tight against the countertop with mounting clips that are installed beneath the counters.",
    },
  ],
  Faucets: [
    {
      q: "What’s the warranty on faucets?",
      a: "Morzze faucets are warranted for one year and five years on cartridge from the date of purchase against any manufacturing defect for normal residential use only. No warranty stands if used in a commercial place. Check warranty conditions by using this link https://morzze.com/warranty/",
    },
    {
      q: "What’s the flow of kitchen faucets?",
      a: "Flow from kitchen faucets is an average of 10 liters per minute.",
    },
    {
      q: "What’s the life of a faucet in normal working conditions?",
      a: "Morzze faucets will work for at least 10 years in normal and standard residential use.",
    },
    {
      q: "Which chemicals can harm kitchen faucets?",
      a: "Never use acid, toilet cleaner, drain cleaner, bleach, chlorine products, hard water, harsh abrasives, steel wool, ammonia, iodine, or any harsh chemicals.",
    },
    {
      q: "How to remove scaling from my kitchen faucet?",
      a: "As a natural cleaner, vinegar is one of the most recommended substances for care and cleaning of chrome-finished faucets and fixtures. Vinegar is tough enough to combat even the most difficult mineral deposits and food stains while being gentle enough to protect the chrome finish. It is recommended to dilute vinegar with water 1:1 for everyday cleaning, but undiluted vinegar may be used for tougher deposits and water spots.",
    },
    {
      q: "Is Chrome or Stainless Steel finish better for a Kitchen Faucet?",
      a: "Choosing the finish for your kitchen faucet should depend on the design of your kitchen. Stainless steel and chrome are two of the most durable finishes for high-traffic faucets in the kitchen. Chrome is suitable for traditional kitchen/bathroom designs, while stainless steel is a smart choice for contemporary kitchen designs. Morzze’s stainless steel finish blends well with traditional stainless steel kitchen appliances.",
    },
  ],
  "Food Waste Disposal": [
    {
      q: "What’s the warranty on Food waste disposals?",
      a: "Morzze Food Waste Disposal is warranted for two years from the date of purchase against any manufacturing defect on normal residential use only. No warranty stands if used in a commercial place. Check warranty conditions https://morzze.com/warranty/",
    },
    {
      q: "How to Unclog a Kitchen Sink with a Garbage Disposal?",
      a: "To unclog a kitchen sink with a garbage disposal, follow these steps:",
    },
    {
      q: "What are the common causes of garbage disposal clogs?",
      a: "Common causes of garbage disposal clogs include hair, food particles, and other debris that get stuck in the disposal unit.",
    },
  ],
  Accessories: [
    {
      q: " What’s the length of the tube of the hand shower?",
      a: " 1.5 meter",
    },
    {
      q: " What’s the warranty on Accessories?",
      a: " All accessories if sold separately are warranted for one year against any manufacturing defect. Kindly click https://morzze.com/warranty/ to read the terms and conditions to avail the warranty.",
    },
    {
      q: " How to clean drain pipes?",
      a: " Use a container or a small bucket to scoop out as much water as possible; wear gloves to protect your hands. Check the clogged drain for debris, fluff, soap scum, and pieces, paste build-up, etc., and remove any debris as best you can. Push 1 cup of baking soda down the sink drain. Use a spatula to force the baking soda into the opening, if necessary. Pour 2 cups of vinegar into the drain opening. Put the stopper into the sink so that the vinegar is forced toward the clog. Wait 15 minutes to allow the solution to work on the clog. Run boiling water into the sink to see if the clog disappears f the sink is still clogged, then apply the baking soda and vinegar solution again.",
    },
  ],
} as const; // 'as const' use karne se types rigid ho jate hain

// 2. Keys ki type nikal lo (General | Faucets etc.)
type CategoryType = keyof typeof FAQ_CONTENT;

const FAQSection = () => {
  // 3. State ko batao ki wo sirf CategoryType hi ho sakta hai
  const [activeCategory, setActiveCategory] = useState<CategoryType>("General");

  const categories = Object.keys(FAQ_CONTENT) as CategoryType[];

  return (
    <div className="space-y-16 bg-black py-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center text-white font-montserrat uppercase tracking-tight">
        Frequently Asked Questions
      </h1>
      <div className="flex justify-center gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
              activeCategory === cat
                ? "bg-[#FDB813] text-black border-[#FDB813]"
                : "bg-transparent text-white/90 border-white/20 hover:border-white/50 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <h3 className="text-center text-white font-bold tracking-[4px] text-base uppercase">
            {activeCategory}
          </h3>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {/* Ab yahan Red Line nahi aayegi kyunki TS ko pata hai activeCategory valid key hai */}
            {FAQ_CONTENT[activeCategory].map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-white/10 bg-[#111111] px-6 rounded-lg"
              >
                <AccordionTrigger className="text-white hover:no-underline text-base py-5 font-semibold text-left leading-7">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/90 text-base leading-7 pb-5 [&_a]:text-[#FDB813] [&_a]:font-semibold [&_a]:underline-offset-4 hover:[&_a]:underline">
                  {/* <LinkifiedContactText text={item.a} /> */}
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
