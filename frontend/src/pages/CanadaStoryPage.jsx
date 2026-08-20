import React, { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hatch from "../components/Hatch";

// Canada story · sourcing · direction 1d.
// The handoff draws mobile 390 and desktop 1280 as separate frames; this is the
// one responsive page they describe — mobile stacks, lg: opens into the
// editorial spreads.

const stats = [
  { n: "3", label: "processors, all CFIA-audited" },
  { n: "100%", label: "lots traceable to farm" },
  { n: "7 yr", label: "working the same barns" },
];

const reasons = [
  {
    n: "01",
    head: "The climate does half the work",
    body: "Long cold winters mean lower disease pressure in the barns, which means less need for routine medication. Herd health is a side effect of geography before it is a marketing line.",
    proof: "Barns audited on ventilation, stocking density and mortality",
  },
  {
    n: "02",
    head: "Grading is a number, not an adjective",
    body: 'Every carcass is probed on the rail for fat depth and lean yield and assigned a class. Nobody writes "premium" on a manifest; they write an index and a millimetre reading.',
    proof: "Class and index printed on every lot manifest we receive",
  },
  {
    n: "03",
    head: "Oversight you can look up yourself",
    body: "Federally registered plants carry a CFIA establishment number. The register is public, the inspection findings are public, and we quote the numbers so you can check them without asking us.",
    proof: "EST 118 · EST 243 · EST 306 on the CFIA register",
  },
  {
    n: "04",
    head: "The rules are written down",
    body: "Ractopamine-free production for the export stream, codes of practice for handling and transport, antibiotic use recorded per barn. Written rules can be shown to a buyer; goodwill cannot.",
    proof: "Ractopamine-free declaration on every consignment",
  },
];

// The grading classes are live: pick a class to see what it measures and
// whether we buy it.
const grades = {
  "Canada 1": {
    title: "Canada 1",
    buy: true,
    body: "The leanest class. Dense, even muscling with a thin, uniform fat cap — the carcass a chop or a loin roast should come from.",
    rows: [
      ["Lean yield", "60 % and above"],
      ["Fat depth at last rib", "12 – 18 mm"],
      ["What we cut from it", "Loin, chops, tenderloin, schnitzel"],
      ["Share of our buy", "54 %"],
    ],
    verdictHead: "We buy it · standard",
    verdict:
      "Our default for everything sold as premium. Lean cuts have nowhere to hide, so we take the top class and pay for it.",
  },
  "Canada 2": {
    title: "Canada 2",
    buy: true,
    body: "Slightly fatter, slightly lower yield, and better eating for anything slow. Fat here is a feature, not a downgrade.",
    rows: [
      ["Lean yield", "55 – 59 %"],
      ["Fat depth at last rib", "18 – 24 mm"],
      ["What we cut from it", "Belly, shoulder, ribs, sausage"],
      ["Share of our buy", "41 %"],
    ],
    verdictHead: "We buy it · on purpose",
    verdict:
      "Bought deliberately, not as a saving. A Canada 1 belly makes thin, mean bacon; this class is what you actually want for slabs and racks.",
  },
  "Canada 3": {
    title: "Canada 3",
    buy: true,
    body: "Heavy fat cover and a lower lean yield. Useful in a narrow band of products, useless in most.",
    rows: [
      ["Lean yield", "50 – 54 %"],
      ["Fat depth at last rib", "24 – 32 mm"],
      ["What we cut from it", "Cure, charcuterie, rendered fat"],
      ["Share of our buy", "5 %"],
    ],
    verdictHead: "Case by case",
    verdict:
      "Only when a charcuterie recipe needs the fat, and only whole — never portioned into retail packs as though it were Canada 1.",
  },
  "Canada 4": {
    title: "Canada 4",
    buy: false,
    body: "Below the yield floor, or carrying a defect: soft fat, bruising, colour or pH outside range, PSE or DFD muscle.",
    rows: [
      ["Lean yield", "Under 50 %, or defect"],
      ["Fat depth at last rib", "Over 32 mm"],
      ["What we cut from it", "Nothing"],
      ["Share of our buy", "0 %"],
    ],
    verdictHead: "We don't buy it",
    verdict:
      "Not at a discount, not as trim, not for mince. It is the cheapest pork on any offer sheet, which is precisely the trap.",
  },
};

const route = [
  { place: "Barn · Fraser Valley", note: "lot code assigned at loading", day: "day 0" },
  { place: "Plant · EST 118", note: "graded, cut to our spec, blast frozen", day: "day 0 – 1" },
  { place: "Cold store · Vancouver", note: "held at −18 °C, probed twice daily", day: "day 3" },
  { place: "Reefer · sea leg", note: "set point −18 °C, GPS and door alarms", day: "day 3 – 21" },
  { place: "Port · Nhava Sheva", note: "customs, FSSAI sampling, seal intact", day: "day 24" },
  { place: "Our facility · Taloja", note: "receipt probe, then tempered to order", day: "day 26" },
];

const plants = [
  {
    name: "Fraser Valley",
    est: "EST 118",
    shot: "processing floor, boning line",
    body: "Our loin and leg supply. Family-held, third generation, and the plant that taught us how to write a cutting spec.",
    rows: [
      ["Region", "British Columbia"],
      ["Supplies", "Loin, leg, tenderloin"],
      ["Last audit", "18 Mar 2026"],
    ],
  },
  {
    name: "Maple Ridge",
    est: "EST 243",
    shot: "chilled belly slabs, racked",
    body: "Belly, ribs and shoulder. Larger operation, and the one that carries our cure programme for bacon and back bacon.",
    rows: [
      ["Region", "British Columbia"],
      ["Supplies", "Belly, ribs, shoulder"],
      ["Last audit", "02 Feb 2026"],
    ],
  },
  {
    name: "Red Deer",
    est: "EST 306",
    shot: "charcuterie room, hanging",
    body: "Charcuterie and cured product. Smallest of the three by volume and the only one we buy Canada 3 from, whole, for fat.",
    rows: [
      ["Region", "Alberta"],
      ["Supplies", "Cured, charcuterie, jowl"],
      ["Last audit", "27 Apr 2026"],
    ],
  },
];

const refusals = [
  {
    head: "Nothing re-frozen",
    body: "A lot that has been thawed and refrozen is invisible on a spec sheet and obvious on the plate. If the probe file shows it, we don't take the container.",
  },
  {
    head: "Nothing ungraded",
    body: 'No class on the manifest, no purchase order. "Mixed grade" is how Canada 4 travels in a Canada 1 box.',
  },
  {
    head: "No ractopamine",
    body: "Declared free on every consignment, at origin, in writing. Not a promise from a broker in the middle.",
  },
  {
    head: "No unnamed plants",
    body: "We buy from three establishments we have walked. Spot lots from unnamed cutting rooms are cheaper and we don't touch them.",
  },
];

const eyebrow = "font-archivo font-semibold text-[10px] lg:text-[11px] leading-none tracking-[.18em] lg:tracking-[.2em] uppercase";
const specKey = "font-archivo font-semibold text-[10px] lg:text-[11px] leading-[1.4] tracking-[.12em] uppercase text-sop-ink-50";
const specVal = "font-plex text-[12.5px] lg:text-[13px] leading-[1.4] text-sop-ink text-right";

const CanadaStoryPage = () => {
  const [grade, setGrade] = useState("Canada 1");

  const sel = grades[grade];

  return (
    <div className="min-h-screen bg-sop-bone-100 font-archivo text-sop-ink">
      <Navbar active="Canada story" />

      {/* ---------------------------- hero ----------------------------- */}
      <section className="grid lg:grid-cols-[1.02fr_.98fr]">
        <Hatch className="order-1 flex h-[300px] items-end border-b border-sop-bone-300 p-3.5 lg:order-2 lg:h-auto lg:min-h-[620px] lg:border-b-0 lg:p-5">
          <span className="font-plex text-[10px] lg:text-[11.5px] leading-[1.5] lg:leading-[1.6] text-sop-ink-50">
            documentary · Fraser Valley barn in winter
            <br />
            available light, no styling
            <span className="hidden lg:inline">, faces welcome</span>
            <br className="hidden lg:block" />
            <span className="lg:hidden"> · 4:5</span>
            <span className="hidden lg:inline">full-bleed 4:5</span>
          </span>
        </Hatch>

        <div className="order-2 flex flex-col justify-between border-b border-sop-bone-300 bg-sop-loin px-4 pb-[30px] pt-7 lg:order-1 lg:border-b-0 lg:px-11 lg:pb-[60px] lg:pt-16">
          <div>
            <span className={`${eyebrow} mb-[13px] block text-sop-rust lg:mb-[22px]`}>
              Sourcing · est. 2019
            </span>
            <h1 className="mb-4 font-display text-[42px] leading-[.95] tracking-[-.015em] text-sop-ink lg:mb-[22px] lg:text-[76px] lg:leading-[.9] lg:tracking-[-.025em]">
              We buy from Canada because the paperwork <span className="italic">is boring</span>
            </h1>
            <p className="mb-4 max-w-[34ch] text-[14.5px] leading-[1.6] text-sop-ink-70 lg:max-w-[44ch] lg:text-[17px] lg:leading-[1.55]">
              Every pork exporter tells you their pigs are happy. What we needed was a country
              where the claims are measured, numbered and published — so a small importer outside
              Mumbai can check them from six thousand miles away.
            </p>
            <p className="max-w-[34ch] text-[14.5px] leading-[1.6] text-sop-ink-70 lg:max-w-[44ch] lg:text-[17px] lg:leading-[1.55]">
              Canada grades every carcass on an index, gives every plant an establishment number,
              and puts the audits online. That is the whole reason we are here rather than
              somewhere cheaper.
            </p>
          </div>

          <div className="mt-8 flex gap-px bg-sop-ink lg:mt-10">
            {stats.map((s) => (
              <div key={s.label} className="flex-1 bg-sop-loin px-3.5 py-4">
                <span className="block font-display text-[32px] leading-none text-sop-ink lg:text-[42px]">
                  {s.n}
                </span>
                <span className="mt-1.5 block font-plex text-[10px] lg:text-[11px] leading-[1.4] text-sop-rust">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------ four reasons ------------------------- */}
      <section className="border-y border-sop-bone-300 bg-sop-bone-100 px-4 pb-[30px] pt-7 lg:px-11 lg:pb-[60px] lg:pt-14">
        <span className={`${eyebrow} mb-4 block text-sop-cured lg:mb-[26px]`}>Four reasons</span>
        <div className="grid gap-px border-t border-sop-ink bg-sop-bone-300 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            // four across on one row: pad off the dividers, first stays flush
            <div
              key={r.n}
              className="bg-sop-bone-100 py-[18px] lg:px-5 lg:py-6 lg:first:pl-0"
            >
              <span className="mb-2 block font-plex text-[11px] lg:text-xs leading-none text-sop-cured lg:mb-3.5">
                {r.n}
              </span>
              <h3 className="mb-2.5 font-display text-[26px] leading-[1.05] text-sop-ink lg:mb-3 lg:text-[32px] lg:leading-[1.02]">
                {r.head}
              </h3>
              <p className="mb-2.5 max-w-[34ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:mb-3.5 lg:max-w-none lg:text-[14.5px]">
                {r.body}
              </p>
              <span className="block font-plex text-[11px] lg:text-[11.5px] leading-[1.5] lg:leading-[1.55] text-sop-ink-50">
                {r.proof}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------- grading + barn to Taloja ---------------- */}
      <section className="grid lg:grid-cols-[.92fr_1.08fr]">
        {/* grading — the live classes */}
        <div className="border-b border-sop-bone-300 bg-sop-bone-200 px-4 pb-[30px] pt-7 lg:border-b-0 lg:border-r lg:px-11 lg:pb-[60px] lg:pt-14">
          <span className={`${eyebrow} mb-3 block text-sop-ink-50 lg:mb-4`}>
            Grading · what the number means
          </span>
          <h2 className="mb-2 font-display text-[30px] leading-none text-sop-ink lg:mb-3.5 lg:text-[52px] lg:leading-[.98]">
            A class, not
            <br />
            an adjective
          </h2>
          <p className="mb-[18px] max-w-[34ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:mb-6 lg:max-w-[38ch] lg:text-[16px]">
            Carcasses are graded on lean yield and fat depth, measured on the rail
            <span className="hidden lg:inline"> with a probe rather than judged by eye</span>. Tap
            a class to see what it is and what we do with it.
          </p>

          <div className="mb-[18px] flex gap-[7px] lg:mb-6 lg:gap-2">
            {Object.keys(grades).map((key) => {
              const on = key === grade;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setGrade(key)}
                  className={`flex-1 inline-flex min-h-[48px] items-center justify-center font-archivo font-semibold text-[11.5px] leading-none tracking-[.1em] uppercase lg:min-h-[50px] lg:text-xs ${
                    on
                      ? "bg-sop-ink text-sop-bone-100"
                      : "border border-sop-bone-400 bg-sop-bone-100 text-sop-ink-70 hover:border-sop-ink hover:text-sop-ink"
                  }`}
                  aria-pressed={on}
                >
                  {key.replace("Canada ", "Cda ")}
                </button>
              );
            })}
          </div>

          <div className="border border-sop-bone-300 bg-sop-bone-100">
            <div className="border-b border-sop-bone-300 px-[15px] pb-3.5 pt-4 lg:px-5 lg:pb-[18px] lg:pt-5">
              <span className="mb-1.5 block font-display text-[26px] leading-[1.05] text-sop-ink lg:mb-2 lg:text-[32px]">
                {sel.title}
              </span>
              <span className="block max-w-[42ch] text-[13.5px] leading-[1.6] text-sop-ink-70 lg:text-[14.5px]">
                {sel.body}
              </span>
            </div>

            {sel.rows.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-3.5 border-b border-sop-bone-200 px-[15px] py-[11px] lg:gap-4 lg:px-5 lg:py-[13px]"
              >
                <span className={specKey}>{k}</span>
                <span className={specVal}>{v}</span>
              </div>
            ))}

            {sel.buy ? (
              <div className="bg-sop-loin px-[15px] pb-[15px] pt-3.5 lg:px-5 lg:pb-5 lg:pt-[18px]">
                <span className="mb-[7px] block font-archivo font-semibold text-[10px] lg:text-[10.5px] leading-none tracking-[.16em] lg:tracking-[.18em] uppercase text-sop-rust lg:mb-2.5">
                  {sel.verdictHead}
                </span>
                <span className="block max-w-[44ch] text-[13px] leading-[1.55] text-sop-ink lg:text-[14px] lg:leading-[1.6]">
                  {sel.verdict}
                </span>
              </div>
            ) : (
              <div className="bg-sop-ink px-[15px] pb-[15px] pt-3.5 lg:px-5 lg:pb-5 lg:pt-[18px]">
                <span className="mb-[7px] block font-archivo font-semibold text-[10px] lg:text-[10.5px] leading-none tracking-[.16em] lg:tracking-[.18em] uppercase text-sop-loin lg:mb-2.5">
                  {sel.verdictHead}
                </span>
                <span className="block max-w-[44ch] text-[13px] leading-[1.55] text-sop-ash lg:text-[14px] lg:leading-[1.6]">
                  {sel.verdict}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* barn to Taloja */}
        <div className="bg-sop-ink px-4 pb-[30px] pt-7 lg:px-11 lg:pb-[60px] lg:pt-14">
          <span className={`${eyebrow} mb-3 block text-sop-chill lg:mb-4`}>Barn to Taloja</span>
          <h2 className="mb-2 font-display text-[30px] leading-none text-sop-bone-100 lg:mb-3.5 lg:text-[52px] lg:leading-[.98]">
            Twenty-six days,
            <br />
            seven signatures
          </h2>
          <p className="mb-[22px] max-w-[34ch] text-[13.5px] leading-[1.6] text-sop-ash lg:mb-7 lg:max-w-[44ch] lg:text-[15px]">
            The sea leg is long, which is exactly why the chain has to be boring. Days are
            cumulative from slaughter.
          </p>

          <div className="border-t border-sop-ink-70">
            {route.map((leg) => (
              <div
                key={leg.place}
                className="flex items-baseline justify-between gap-3.5 border-b border-sop-ink-70 py-3.5 lg:gap-5 lg:py-[15px]"
              >
                <div className="flex flex-col gap-1 lg:gap-[5px]">
                  <span className="font-archivo font-medium text-xs lg:text-[12.5px] leading-[1.2] tracking-[.1em] uppercase text-sop-bone-100">
                    {leg.place}
                  </span>
                  <span className="font-plex text-[10.5px] lg:text-[11.5px] leading-[1.45] text-sop-ink-40">
                    {leg.note}
                  </span>
                </div>
                <span className="flex-none whitespace-nowrap font-plex text-[15px] lg:text-[18px] leading-none text-sop-chill">
                  {leg.day}
                </span>
              </div>
            ))}
          </div>

          <p className="mb-5 mt-[18px] max-w-[34ch] text-[13.5px] leading-[1.6] text-sop-ash lg:mb-[26px] lg:mt-6 lg:max-w-[44ch] lg:text-[15px]">
            Probe readings for every leg are on the cold chain page, lot by lot, including the ones
            that failed.
          </p>
          <Link
            to="/cold-chain"
            className="inline-flex min-h-[48px] items-center bg-sop-loin px-5 font-archivo font-semibold text-xs leading-none tracking-[.1em] uppercase text-sop-ink hover:bg-sop-blush lg:min-h-[50px] lg:px-6 lg:text-[12.5px]"
          >
            See the temperature log
          </Link>
        </div>
      </section>

      {/* --------------------------- plants ---------------------------- */}
      <section className="border-b border-t border-sop-bone-300 bg-sop-bone-100 px-4 pb-[30px] pt-7 lg:px-11 lg:pb-[60px] lg:pt-14">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:mb-[26px] lg:flex-row lg:items-baseline">
          <div>
            <span className={`${eyebrow} mb-3 block text-sop-cured lg:mb-3.5`}>
              Three plants, that's all
            </span>
            <h2 className="font-display text-[30px] leading-none text-sop-ink lg:text-[52px]">
              Who actually cuts it
            </h2>
          </div>
          <span className="max-w-[36ch] font-plex text-xs leading-[1.6] text-sop-ink-50 lg:text-right">
            Establishment numbers are public. Look them up on the CFIA register before you believe
            us.
          </span>
        </div>

        <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3 lg:gap-3">
          {plants.map((p) => (
            <div key={p.est} className="border border-sop-bone-300">
              <Hatch
                from="#F7D9D3"
                to="#F3E3DE"
                className="flex h-[130px] items-end p-[9px] lg:h-[190px] lg:p-[11px]"
              >
                <span className="font-plex text-[9.5px] lg:text-[10px] leading-[1.4] lg:leading-[1.45] text-sop-rust">
                  {p.shot}
                </span>
              </Hatch>
              <div className="px-3.5 pb-4 pt-3.5 lg:px-[18px] lg:pb-5 lg:pt-[18px]">
                <div className="mb-[7px] flex items-baseline justify-between gap-3 lg:mb-2.5">
                  <span className="font-display text-[23px] leading-[1.05] text-sop-ink lg:text-[28px]">
                    {p.name}
                  </span>
                  <span className="flex-none font-plex font-medium text-[11px] lg:text-[11.5px] leading-none text-sop-cured">
                    {p.est}
                  </span>
                </div>
                <span className="mb-2.5 block text-[13px] leading-[1.55] text-sop-ink-70 lg:mb-3.5 lg:text-[14px] lg:leading-[1.6]">
                  {p.body}
                </span>
                <div className="border-t border-sop-bone-200">
                  {p.rows.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between gap-3 border-b border-sop-bone-200 py-2 lg:py-[9px]"
                    >
                      <span className="font-archivo font-semibold text-[10px] leading-[1.4] tracking-[.12em] uppercase text-sop-ink-50">
                        {k}
                      </span>
                      <span className="text-right font-plex text-[11.5px] lg:text-xs leading-[1.4] text-sop-ink">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------- refusals + the honest part ---------------- */}
      <section className="grid lg:grid-cols-[1.08fr_.92fr]">
        <div className="border-b border-sop-bone-300 bg-sop-blush px-4 pb-[30px] pt-7 lg:border-b-0 lg:px-11 lg:pb-[60px] lg:pt-14">
          <span className={`${eyebrow} mb-3 block text-sop-rust lg:mb-4`}>Our four refusals</span>
          <h2 className="mb-4 font-display text-[30px] leading-none text-sop-ink lg:mb-[26px] lg:text-[52px]">
            What we won't buy, at any price
          </h2>
          <div className="grid gap-px bg-sop-blush-edge sm:grid-cols-2">
            {refusals.map((r) => (
              // two across, two rows: every odd cell starts a row
              <div
                key={r.head}
                className="bg-sop-blush py-3.5 lg:px-5 lg:py-4 lg:odd:pl-0"
              >
                <span className="mb-1.5 block font-archivo font-semibold text-xs lg:text-[12.5px] leading-[1.3] tracking-[.12em] uppercase text-sop-ink lg:mb-2">
                  {r.head}
                </span>
                <span className="block max-w-[34ch] text-[13.5px] leading-[1.6] text-sop-ink-70 lg:max-w-none lg:text-[14px]">
                  {r.body}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center border-b border-sop-bone-300 bg-sop-bone-200 px-4 pb-[30px] pt-7 lg:border-b-0 lg:border-l lg:px-11 lg:pb-[60px] lg:pt-14">
          <span className={`${eyebrow} mb-3.5 block text-sop-ink-50 lg:mb-[18px]`}>
            The honest part
          </span>
          <p className="mb-3.5 max-w-[30ch] font-display text-[24px] leading-[1.2] text-sop-ink lg:mb-[18px] lg:text-[34px] lg:leading-[1.15]">
            Imported pork travels twenty-six days. That is the trade-off, and we would rather say
            it than hide it.
          </p>
          <p className="max-w-[34ch] text-[13.5px] leading-[1.6] text-sop-ink-70 lg:max-w-[40ch] lg:text-[15px]">
            Frozen at −18 °C the whole way, quality holds; broken once, it never comes back. So the
            cold chain is not marketing for us, it is the entire business. When Indian supply meets
            the same grading and the same audit trail, we will buy it here — we have looked, twice.
          </p>
        </div>
      </section>

      {/* --------------------------- two doors -------------------------- */}
      <section className="grid gap-px border-t border-sop-bone-300 bg-sop-bone-300 lg:grid-cols-2">
        <div className="bg-sop-bone-100 px-4 pb-7 pt-[26px] lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className={`${eyebrow} mb-2.5 block text-sop-cured lg:mb-3.5`}>For the home</span>
          <h2 className="mb-2.5 font-display text-[30px] leading-none text-sop-ink lg:mb-3.5 lg:text-[46px]">
            Shop the counter
          </h2>
          <p className="mb-4 max-w-[32ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:mb-6 lg:max-w-[40ch] lg:text-[16px]">
            Every pack carries its lot code, so the story above is checkable on your kitchen
            counter.
          </p>
          <Link
            to="/catalogue"
            className="inline-flex min-h-[48px] items-center bg-sop-ember px-5 font-archivo font-semibold text-xs leading-none tracking-[.1em] uppercase text-sop-bone-100 hover:bg-sop-ember-dark lg:min-h-[50px] lg:px-6 lg:text-[12.5px]"
          >
            Start shopping
          </Link>
        </div>

        <div className="bg-sop-ink px-4 pb-7 pt-[26px] lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className={`${eyebrow} mb-2.5 block text-sop-loin lg:mb-3.5`}>For kitchens</span>
          <h2 className="mb-2.5 font-display text-[30px] leading-none text-sop-bone-100 lg:mb-3.5 lg:text-[46px]">
            Sourcing documents
          </h2>
          <p className="mb-4 max-w-[32ch] text-[14px] leading-[1.6] text-sop-ash lg:mb-6 lg:max-w-[40ch] lg:text-[16px]">
            CFIA establishment listings, health certificates, grading manifests and our own audit
            pack — one folder, refreshed quarterly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/wholesale"
              className="inline-flex min-h-[48px] items-center bg-sop-loin px-5 font-archivo font-semibold text-xs leading-none tracking-[.1em] uppercase text-sop-ink hover:bg-sop-blush lg:min-h-[50px] lg:px-[22px] lg:text-[12.5px]"
            >
              Request the folder
            </Link>
            <Link
              to="/wholesale"
              className="hidden min-h-[50px] items-center border-[1.5px] border-sop-ink-50 px-[22px] font-archivo font-semibold text-[12.5px] leading-none tracking-[.1em] uppercase text-sop-bone-100 hover:border-sop-loin lg:inline-flex"
            >
              Talk to sourcing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CanadaStoryPage;
