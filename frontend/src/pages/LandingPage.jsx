import React from "react";
import { Link } from "react-router";
import {
  SnowflakeIcon,
  ThermometerIcon,
  WindIcon,
  MapPinIcon,
  BookOpenIcon,
  RulerIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  ShoppingBasketIcon,
  BriefcaseIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SEASONAL_CALENDAR } from "../lib/trade";

// Principles 1–6, in the order we actually run the business.
const principles = [
  {
    icon: SnowflakeIcon,
    title: "The cold chain is the product",
    body: "Three chains, not one. Fresh chilled, frozen, and ready-to-eat cured each run at their own temperature, carry their own risks, and arrive with their own handling instructions printed on the box.",
  },
  {
    icon: MapPinIcon,
    title: "Provenance, farm to breed",
    body: "Pork tells you the farm, the feed and the breed. Steak tells you origin and grade. Seafood tells you catch method and landing region. If we can't name it, we don't list it.",
  },
  {
    icon: BookOpenIcon,
    title: "Cut literacy is a sales function",
    body: "Nobody in India grows up knowing what a coppa is, or how picanha differs from ribeye. Every product page says what it is, where it sits on the animal, how to cook it, at what temperature, for how long.",
  },
  {
    icon: RulerIcon,
    title: "Consistency of spec",
    body: "Portion weight tolerance, steak thickness, slice thickness on cold cuts. Chefs cost their menus on these numbers, so we publish them and hold them — and every wholesale SKU has a spec sheet to download.",
  },
  {
    icon: ThermometerIcon,
    title: "Honest about frozen",
    body: "Much of this range is necessarily frozen or imported. Frozen is not a weakness — badly thawed is. We say what's fresh, what's frozen, what's ambient-cured, and we give you the thawing instructions.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Seasonal readiness",
    body: "Turkey is a Christmas business and duck spikes around it. Pre-orders open on 1 October against a confirmed flock allocation, so nobody is scrambling in November.",
  },
];

const chains = [
  {
    icon: ThermometerIcon,
    label: "Fresh chilled",
    temp: "0 to 4 °C",
    risk: "Shortest window of the three. A break shows up as drip loss and off-smell before it shows up on a thermometer.",
    handling: "Into the chiller within 15 minutes of the box landing. Don't stack. Check the core temp on the docket against your own probe.",
    accent: "border-info",
  },
  {
    icon: SnowflakeIcon,
    label: "Frozen",
    temp: "-18 °C or below",
    risk: "Refreezing is the failure mode. Loose ice crystals inside the bag mean it thawed somewhere between us and you.",
    handling: "Straight to the freezer, no staging on the bench. Thaw once, in the chiller, on a tray — never under warm water.",
    accent: "border-primary",
  },
  {
    icon: WindIcon,
    label: "Ready-to-eat cured",
    temp: "12 to 18 °C whole · 4 °C sliced",
    risk: "Ready to eat means there is no kill step left. The risk is cross-contact, not temperature.",
    handling: "Store away from raw meat. Dedicated boards, dedicated slicer, sanitised between products.",
    accent: "border-secondary",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ---------------------------- hero ---------------------------- */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
        <span className="badge badge-primary badge-outline mb-4">
          Wholesale &amp; retail · Bengaluru
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Slice of <span className="text-primary">Pink</span>
        </h1>
        <p className="mt-5 text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto">
          Processed pork, charcuterie, steak and seafood — sold with its
          paperwork. Farm, breed, chain and spec on every SKU, because a
          distributor moves boxes and we don't.
        </p>

        {/* one brand, two clearly marked doors */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto text-left">
          <Link
            to="/catalogue"
            className="card bg-base-100 border border-base-content/10 hover:border-primary transition-colors"
          >
            <div className="card-body">
              <ShoppingBasketIcon className="size-8 text-primary" />
              <h2 className="card-title">I'm cooking at home</h2>
              <p className="text-sm text-base-content/70">
                Open catalogue with prices. 200 g and 500 g packs, delivery
                slots, recipes attached to every cut. Minimum cart ₹800.
              </p>
              <span className="text-primary text-sm font-medium inline-flex items-center gap-1 mt-2">
                Shop the catalogue <ArrowRightIcon className="size-4" />
              </span>
            </div>
          </Link>

          <Link
            to="/wholesale"
            className="card bg-base-100 border border-base-content/10 hover:border-primary transition-colors"
          >
            <div className="card-body">
              <BriefcaseIcon className="size-8 text-primary" />
              <h2 className="card-title">I'm buying for a kitchen</h2>
              <p className="text-sm text-base-content/70">
                Rate card behind an account. 5 kg and 10 kg cases, MOQ, order
                cut-offs, credit terms, spec sheets and a named contact.
              </p>
              <span className="text-primary text-sm font-medium inline-flex items-center gap-1 mt-2">
                Apply for a trade account <ArrowRightIcon className="size-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ------------------------ core principles ---------------------- */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold mb-2">How we run it</h2>
        <p className="text-base-content/60 mb-8 max-w-2xl">
          Six principles. They decide what we list, how it ships, and what we
          print on the page.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="card bg-base-100 border-t-4 border-primary"
            >
              <div className="card-body">
                <principle.icon className="size-7 text-primary" />
                <h3 className="card-title text-lg">{principle.title}</h3>
                <p className="text-sm text-base-content/70">{principle.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------- cold chain ------------------------- */}
      <section id="coldchain" className="bg-base-300/60 border-y border-base-content/10">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-3xl font-bold mb-2">Three cold chains</h2>
          <p className="text-base-content/60 mb-8 max-w-2xl">
            Different temperatures, different risks, different instructions when
            the box lands. Every product on this site is labelled with the chain
            it travels in.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {chains.map((chain) => (
              <div
                key={chain.label}
                className={`card bg-base-100 border-l-4 ${chain.accent}`}
              >
                <div className="card-body">
                  <div className="flex items-center gap-2">
                    <chain.icon className="size-6 text-primary" />
                    <h3 className="card-title text-lg">{chain.label}</h3>
                  </div>
                  <p className="font-mono text-sm text-primary">{chain.temp}</p>

                  <p className="text-xs uppercase tracking-wide text-base-content/40 mt-3">
                    The risk
                  </p>
                  <p className="text-sm text-base-content/70">{chain.risk}</p>

                  <p className="text-xs uppercase tracking-wide text-base-content/40 mt-3">
                    On arrival
                  </p>
                  <p className="text-sm text-base-content/70">{chain.handling}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- sourcing / compliance / cuts -------------- */}
      <section className="max-w-6xl mx-auto px-4 py-14 grid gap-6 md:grid-cols-3">
        <div id="sourcing" className="card bg-base-100 border border-base-content/10">
          <div className="card-body">
            <MapPinIcon className="size-7 text-primary" />
            <h3 className="card-title">Sourcing &amp; farms</h3>
            <p className="text-sm text-base-content/70">
              Berkshire and Large White from Nandini Farms in Kodagu, fed maize,
              soy meal and spent grain — no meat meal. Bronze turkey and Pekin
              duck from Highfield in the Nilgiris. Beef is Australian MSA-graded
              and Brazilian Nelore. Salmon is ASC Norway; prawns are BAP-farmed
              off Kakinada.
            </p>
          </div>
        </div>

        <div id="compliance" className="card bg-base-100 border border-base-content/10">
          <div className="card-body">
            <ShieldCheckIcon className="size-7 text-primary" />
            <h3 className="card-title">Quality &amp; compliance</h3>
            <p className="text-sm text-base-content/70">
              FSSAI-licensed cold room and cutting floor, HACCP plan on file, and
              temperature logs from dispatch to doorstep. Trade accounts get the
              batch certificate and a downloadable spec sheet with every SKU, and
              we invoice against your GSTIN.
            </p>
          </div>
        </div>

        <div id="cuts" className="card bg-base-100 border border-base-content/10">
          <div className="card-body">
            <BookOpenIcon className="size-7 text-primary" />
            <h3 className="card-title">Cut guides &amp; recipes</h3>
            <p className="text-sm text-base-content/70">
              Teaching the cut is part of selling it. Open any product and you
              get what it is, where it sits on the animal, the cooking method,
              the target core temperature and the timing — plus the chef note
              that stops the usual mistake.
            </p>
            <Link to="/catalogue" className="link link-primary text-sm mt-2">
              Browse the cuts →
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------ seasonal calendar --------------------- */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="card bg-base-100 border border-base-content/10">
          <div className="card-body">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="size-6 text-primary" />
              <h3 className="card-title">The seasonal calendar</h3>
            </div>
            <p className="text-sm text-base-content/60">
              Turkey is a Christmas business. Duck spikes around it. Here is the
              year, published in advance, with pre-orders instead of a November
              scramble.
            </p>

            <ul className="mt-4 divide-y divide-base-content/10">
              {SEASONAL_CALENDAR.map((entry) => (
                <li
                  key={entry.month}
                  className="py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"
                >
                  <span className="font-mono text-primary w-40 shrink-0">
                    {entry.month}
                  </span>
                  <span className="text-sm text-base-content/70">
                    {entry.note}
                  </span>
                </li>
              ))}
            </ul>

            <div className="card-actions justify-end mt-2">
              <Link to="/catalogue?seasonal=true" className="btn btn-primary btn-sm">
                See what's on pre-order
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
