import React from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hatch from "../components/Hatch";

// About · our story.
// Everything marked <Tbc> is a placeholder waiting on a real value. Marked
// loudly on purpose: this page is the one a trade buyer reads to decide whether
// to believe the rest of the site, so a plausible-looking invented licence
// number is worse than an obvious gap.
const Tbc = ({ children = "to confirm" }) => (
  <span className="inline-flex items-center border border-dashed border-sop-cured bg-sop-blush px-1.5 py-0.5 font-plex text-[10px] leading-none tracking-[.08em] uppercase text-sop-rust">
    {children}
  </span>
);

const credentials = [
  ["Registered entity", <Tbc key="e">legal name to confirm</Tbc>],
  ["FSSAI licence", <Tbc key="f" />],
  ["GSTIN", <Tbc key="g" />],
  ["Facility", "Taloja, Maharashtra"],
  ["Facility address", <Tbc key="a">plot and pin to confirm</Tbc>],
  ["HACCP plan", <Tbc key="h">on file · reference to confirm</Tbc>],
  ["Trading since", "2019"],
];

const timeline = [
  {
    year: "2019",
    head: "We start importing",
    body: "Slice of Pink opens as an importer rather than a reseller, on the argument that provenance you cannot check is not provenance at all.",
  },
  {
    year: <Tbc key="t2">year</Tbc>,
    head: "The Taloja cold room",
    body: "Frozen store, temper rooms and a cutting floor under one roof, so nothing is thawed anywhere we cannot probe it.",
  },
  {
    year: <Tbc key="t3">year</Tbc>,
    head: "Trade accounts open",
    body: "Case sizes, rate cards and spec sheets for kitchens, alongside the retail counter.",
  },
  {
    year: "2026",
    head: "Where we are now",
    body: "Three audited Canadian plants, one cold room, and a temperature log that is published whether it flatters us or not.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar active="About" />

      {/* draft notice — remove once the real values land */}
      <div className="border-b border-sop-bone-300 bg-sop-blush px-4 py-2.5 lg:px-11">
        <span className="font-plex text-[11px] leading-[1.6] text-sop-rust">
          Draft page. Anything marked <Tbc /> is a placeholder, not a claim — licence numbers, the
          facility address and the team are still to be supplied.
        </span>
      </div>

      {/* ---------------------------- hero ----------------------------- */}
      <section className="grid lg:grid-cols-[1.05fr_.95fr]">
        <div className="px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-16">
          <span className="sop-eyebrow mb-3.5 block text-sop-cured lg:mb-5">
            About · est. 2019
          </span>
          <h1 className="mb-4 font-display text-[42px] leading-[.95] tracking-[-.015em] text-sop-ink lg:mb-5 lg:text-[76px] lg:leading-[.9] lg:tracking-[-.025em]">
            One cold room, three plants, and a promise about temperature
          </h1>
          <p className="mb-4 max-w-[34ch] text-[15px] leading-[1.6] text-sop-ink-70 lg:max-w-[44ch] lg:text-[17px] lg:leading-[1.55]">
            Slice of Pink began in 2019 out of a plain frustration: you could buy imported pork in
            India, but you could not find out which farm it came from, how the carcass had been
            graded, or whether the chain had held on the way over.
          </p>
          <p className="max-w-[34ch] text-[15px] leading-[1.6] text-sop-ink-70 lg:max-w-[44ch] lg:text-[17px] lg:leading-[1.55]">
            Nobody would tell us, so we became the importer we wanted to buy from.
          </p>
        </div>

        <Hatch className="flex h-[280px] items-end p-3.5 lg:h-auto lg:min-h-[520px] lg:p-5">
          <span className="font-plex text-[10px] leading-[1.5] text-sop-ink-50 lg:text-[11.5px] lg:leading-[1.6]">
            documentary · the cutting floor mid-shift
            <br />
            available light, no styling, faces welcome
            <br />
            full-bleed 4:5
          </span>
        </Hatch>
      </section>

      {/* --------------------- importer, not reseller ------------------- */}
      <section className="border-t border-sop-bone-300 bg-sop-bone-200 px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
        <span className="sop-eyebrow mb-3.5 block text-sop-ink-50 lg:mb-4">
          Why an importer, not a distributor
        </span>
        <h2 className="mb-5 font-display text-[32px] leading-none text-sop-ink lg:mb-6 lg:text-[52px] lg:leading-[.98]">
          A distributor moves boxes.
          <br />
          We buy the animal.
        </h2>

        <div className="grid gap-px border-t border-sop-ink bg-sop-bone-300 lg:grid-cols-3">
          {[
            {
              n: "01",
              head: "We choose the plant",
              body: "Three establishments, all audited, all named on the site. A distributor takes what the offer sheet has that week; we buy from rooms we have walked.",
            },
            {
              n: "02",
              head: "We own the chain",
              body: "From the plant to the container to our own cold room — one custody trail, probed at every handover, published lot by lot.",
            },
            {
              n: "03",
              head: "We cut to spec",
              body: "Thickness, portion weight and slice thickness are ours to hold, because the cutting floor is ours. That is what a chef is actually buying.",
            },
          ].map((c) => (
            <div
              key={c.n}
              className="bg-sop-bone-200 py-[18px] lg:px-6 lg:py-6 lg:[&:nth-child(3n+1)]:pl-0"
            >
              <span className="mb-2.5 block font-plex text-[11px] leading-none text-sop-cured lg:mb-3.5">
                {c.n}
              </span>
              <h3 className="mb-2.5 font-display text-[26px] leading-[1.05] text-sop-ink lg:text-[32px]">
                {c.head}
              </h3>
              <p className="text-[14px] leading-[1.6] text-sop-ink-70 lg:text-[14.5px]">{c.body}</p>
            </div>
          ))}
        </div>

        <Link to="/canada-story" className="sop-btn-outline mt-6">
          Read where the meat comes from
        </Link>
      </section>

      {/* -------------------------- the facility ------------------------ */}
      <section className="grid border-t border-sop-bone-300 lg:grid-cols-[.95fr_1.05fr]">
        <Hatch
          from="#F7D9D3"
          to="#F3E3DE"
          className="flex h-[240px] items-end p-3.5 lg:order-2 lg:h-auto lg:min-h-[420px] lg:p-5"
        >
          <span className="font-plex text-[10px] leading-[1.5] text-sop-rust lg:text-[11.5px] lg:leading-[1.6]">
            facility · cold store door, pallets racked
            <br />
            honest light, lot labels legible
            <br />
            16:9
          </span>
        </Hatch>

        <div className="px-4 pb-8 pt-7 lg:order-1 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-cured lg:mb-4">The facility</span>
          <h2 className="mb-4 font-display text-[32px] leading-none text-sop-ink lg:mb-5 lg:text-[52px] lg:leading-[.98]">
            Taloja, Maharashtra
          </h2>
          <p className="mb-5 max-w-[40ch] text-[14.5px] leading-[1.6] text-sop-ink-70 lg:text-[16px]">
            Frozen store, temper rooms and the cutting floor sit under one roof, which is the only
            way to keep a chain honest: nothing is thawed, cut or packed anywhere we cannot probe it
            and write the reading down.
          </p>

          <div className="border-t border-sop-ink">
            {[
              ["Address", <Tbc key="a">plot and pin to confirm</Tbc>],
              ["Cold store capacity", <Tbc key="c" />],
              ["Temper rooms", <Tbc key="t" />],
              ["Dispatch bays", <Tbc key="d" />],
              ["Cities served", "Mumbai · Bengaluru"],
            ].map(([k, v]) => (
              <div key={k} className="sop-row">
                <span className="sop-key">{k}</span>
                <span className="sop-val">{v}</span>
              </div>
            ))}
          </div>

          <Link to="/cold-chain" className="sop-btn-outline mt-6">
            See a lot log
          </Link>
        </div>
      </section>

      {/* --------------------------- the people ------------------------- */}
      <section className="border-t border-sop-bone-300 bg-sop-ink px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
        <span className="sop-eyebrow mb-3.5 block text-sop-loin lg:mb-4">Who you deal with</span>
        <h2 className="mb-6 font-display text-[32px] leading-none text-sop-bone-100 lg:mb-8 lg:text-[52px] lg:leading-[.98]">
          A person, not a helpdesk
        </h2>

        <div className="grid gap-4 lg:grid-cols-[.5fr_.5fr] lg:gap-6">
          <div className="border border-sop-ink-70 p-4 lg:p-6">
            <div className="mb-4 flex items-start gap-4">
              <Hatch
                from="#2A2523"
                to="#221E1C"
                className="h-20 w-20 flex-none border border-sop-ink-70 lg:h-24 lg:w-24"
              />
              <div>
                <span className="block font-display text-[28px] leading-none text-sop-bone-100 lg:text-[34px]">
                  Kamal Ratreja
                </span>
                <span className="mt-2 block font-plex text-[11px] leading-[1.5] text-sop-loin">
                  Founder · the trade line
                </span>
              </div>
            </div>
            <p className="mb-4 text-[14px] leading-[1.6] text-sop-ash lg:text-[15px]">
              Every trade account is issued with a named contact rather than a ticket queue. For now
              that contact is Kamal — he signs off the QA on lots, and he answers the trade line.
            </p>
            <div className="border-t border-sop-ink-70">
              {[
                ["Trade line", "+91 98217 00016"],
                ["Email", "trade@sliceofpink.in"],
                ["Hours", <Tbc key="h" />],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-sop-ink-70 py-2.5"
                >
                  <span className="font-archivo font-semibold text-[10.5px] leading-[1.4] tracking-[.12em] uppercase text-sop-ink-40">
                    {k}
                  </span>
                  <span className="text-right font-plex text-[12.5px] leading-[1.4] text-sop-bone-100">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-dashed border-sop-ink-50 p-4 lg:p-6">
            <span className="sop-eyebrow mb-3 block text-sop-ink-40">The rest of the bench</span>
            <p className="mb-4 text-[14px] leading-[1.6] text-sop-ash lg:text-[15px]">
              Cutting floor, QA and dispatch each have a name against them in practice. Those names
              are still to be supplied, so this panel is deliberately empty rather than filled with
              invented staff.
            </p>
            <div className="flex flex-wrap gap-2">
              <Tbc>head butcher</Tbc>
              <Tbc>QA lead</Tbc>
              <Tbc>dispatch</Tbc>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------- credentials ------------------------- */}
      <section className="grid border-t border-sop-bone-300 lg:grid-cols-2">
        <div className="border-b border-sop-bone-300 px-4 pb-8 pt-7 lg:border-b-0 lg:border-r lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-cured lg:mb-4">Credentials</span>
          <h2 className="mb-4 font-display text-[30px] leading-none text-sop-ink lg:mb-5 lg:text-[46px]">
            The paperwork, on the record
          </h2>
          <p className="mb-5 max-w-[40ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:text-[15px]">
            A trade buyer is vetting a supplier, not browsing. These are the numbers a kitchen needs
            before it puts you on an invoice list — published rather than sent on request.
          </p>
          <div className="border-t border-sop-ink">
            {credentials.map(([k, v]) => (
              <div key={k} className="sop-row">
                <span className="sop-key">{k}</span>
                <span className="sop-val">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------- timeline -------------------------- */}
        <div className="bg-sop-bone-200 px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-ink-50 lg:mb-4">The road so far</span>
          <h2 className="mb-5 font-display text-[30px] leading-none text-sop-ink lg:mb-6 lg:text-[46px]">
            Seven years of buying the same way
          </h2>
          <div className="border-t border-sop-ink">
            {timeline.map((entry, i) => (
              <div key={i} className="border-b border-sop-bone-300 py-4">
                <span className="mb-2 block font-plex text-[12px] leading-none text-sop-cured">
                  {entry.year}
                </span>
                <span className="mb-1.5 block font-display text-[24px] leading-[1.05] text-sop-ink lg:text-[28px]">
                  {entry.head}
                </span>
                <span className="block max-w-[44ch] text-[13.5px] leading-[1.6] text-sop-ink-70">
                  {entry.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------- contact --------------------------- */}
      <section
        id="contact"
        className="border-t border-sop-bone-300 bg-sop-blush px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]"
      >
        <span className="sop-eyebrow mb-3.5 block text-sop-rust lg:mb-4">Talk to us</span>
        <h2 className="mb-6 font-display text-[32px] leading-none text-sop-ink lg:mb-8 lg:text-[52px]">
          Two doors, one phone number
        </h2>

        <div className="grid gap-px bg-sop-blush-edge sm:grid-cols-3">
          {[
            {
              head: "For kitchens",
              lines: ["+91 98217 00016", "trade@sliceofpink.in", "Kamal Ratreja"],
            },
            {
              head: "For the home",
              lines: ["+91 98217 00016", "hello@sliceofpink.in", "WhatsApp the counter"],
            },
            { head: "The facility", lines: ["Taloja, Maharashtra", "Mumbai · Bengaluru"] },
          ].map((col) => (
            <div key={col.head} className="bg-sop-blush p-4 lg:p-5">
              <span className="mb-3 block font-archivo font-semibold text-[10px] leading-none tracking-[.16em] uppercase text-sop-rust">
                {col.head}
              </span>
              {col.lines.map((line) => (
                <span
                  key={line}
                  className="mb-1.5 block font-plex text-[12.5px] leading-[1.6] text-sop-ink"
                >
                  {line}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/catalogue" className="sop-btn-ember">
            Shop the counter
          </Link>
          <Link to="/wholesale" className="sop-btn-outline">
            Open a trade account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
