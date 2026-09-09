import { BadgeCheck, CircleAlert, CircleCheck, TrendingUp } from "lucide-react";

const challenges = [
  "Difficulty sourcing reliable, high-quality products",
  "Long delivery times & broken supply chains",
  "Limited access to innovative, premium products",
  "Inconsistent product quality and standards",
];

const solutions = [
  {
    title: "In-house Manufacturing",
    description: "Complete control on quality and lead times",
  },
  {
    title: "Broad Product Portfolio",
    description: "Sinks, basins, faucets, disposers & more",
  },
  {
    title: "Attractive Margins",
    description: "Competitive pricing with healthy profit margins",
  },
  {
    title: "Complete Support",
    description: "Marketing, training & after-sales assistance",
  },
];

export function ChallengeAndSolution() {
  return (
    <section className="min-h-screen  bg-[#111111] px-5 py-16 text-white md:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4d4028] bg-[#211e18] px-5 py-2.5 text-sm font-semibold text-[#cba966] md:text-base">
            <TrendingUp className="size-5" />
            Market Opportunity
          </div>

          <h1 className="mx-auto mt-7 max-w-7xl text-4xl font-bold tracking-tight md:text-5xl lg:leading-[1.1]">
            The Premium Kitchen &amp; Bath Market is Booming
          </h1>

          <p className="mx-auto mt-5 max-w-4xl text-base leading-relaxed text-[#9d9d9d] md:text-lg">
            Rising demand in residential and commercial sectors creates
            unprecedented opportunities for dealers
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-2">
          {/* Challenges */}
          <article className="rounded-2xl border border-[#5a2424] bg-gradient-to-br from-[#211819] to-[#191616] p-6 md:p-8">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-1 size-10 shrink-0 text-[#ff4d52]" />

              <div>
                <h2 className="text-xl font-bold">Market Challenges</h2>
                <p className="mt-0.5 text-base  text-[#a4a4a4]">
                  Common pain points for local dealers
                </p>
              </div>
            </div>

            <ul className="mt-8 space-y-5">
              {challenges.map((challenge) => (
                <li
                  key={challenge}
                  className="flex items-start gap-4 text-base text-[#e1e1e1]"
                >
                  <span className="mt-2.5 size-2.5 shrink-0 rounded-full bg-[#ff4d52]" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Solution */}
          <article className=" rounded-2xl border border-[#51452d] bg-gradient-to-br from-[#201f1b] to-[#1b1a17] p-6 md:p-8">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-1 size-10 shrink-0 text-[#cba966]" />

              <div>
                <h2 className="text-xl font-bold">Morzze Solution</h2>
                <p className=" text-base text-[#a4a4a4]">
                  Why partnering with Morzze is your competitive advantage
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-7">
              {solutions.map((solution) => (
                <div key={solution.title} className="flex items-start gap-3">
                  <CircleCheck className="mt-1 size-6 shrink-0 text-[#cba966]" />

                  <div>
                    <h3 className="text-base font-semibold ">
                      {solution.title}
                    </h3>
                    <p className=" text-xs text-[#a4a4a4] ">
                      {solution.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
