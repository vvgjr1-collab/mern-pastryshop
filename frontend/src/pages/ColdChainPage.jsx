import React, { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Cold Chain & Quality · live lot log.
// Two real lot codes are loaded — one that held, one that broke. Pick either
// code, or any handover row, to read the log.

const lots = {
  "SOP-2681-A": {
    status: "clean",
    stampTop: "Released 14 Aug 05:40 IST",
    stampBot: "QA sign-off · R. Menon",
    meta: [
      ["Product", "Pork belly, skin-on"],
      ["Packer", "EST 243 · Maple Ridge"],
      ["Kill date", "09 Aug 2026"],
      ["Cases", "18 × 12 kg"],
    ],
    stages: [
      {
        stage: "Abattoir",
        note: "blast freeze within 2 h of dressing",
        spec: "≤ −35 °C",
        c: -38.6,
        state: "ok",
        rows: [
          ["Probe", "P-114 · cal. 02 Jul 26"],
          ["Logged", "09 Aug 06:10 IST"],
          ["Operator", "Maple Ridge QA"],
          ["Document", "Kill & dress certificate"],
        ],
        body: "Carcass split, chilled, then blast frozen. Two probes per pallet, deepest position recorded.",
      },
      {
        stage: "Cold store",
        note: "pallet probe logged twice daily",
        spec: "≤ −18 °C",
        c: -19.0,
        state: "ok",
        rows: [
          ["Probe", "CS-07 · cal. 18 Jun 26"],
          ["Logged", "09–12 Aug · 6 readings"],
          ["Operator", "Store 4, night & day shift"],
          ["Document", "Store temperature register"],
        ],
        body: "62 hours in store before loading. Door-open events logged separately; none exceeded 4 minutes.",
      },
      {
        stage: "Reefer transit",
        note: "GPS + door-open alarm",
        spec: "≤ −15 °C",
        c: -18.2,
        state: "ok",
        rows: [
          ["Container", "MSKU 883 041 7"],
          ["Set point", "−18 °C · continuous"],
          ["Logged", "41 h · 10 min interval"],
          ["Document", "Reefer download + GPS trail"],
        ],
        body: "Container downloaded at the gate before the seal was cut. The full interval file is in the CSV, not just the summary.",
      },
      {
        stage: "Our facility",
        note: "tempered to chilled under supervision",
        spec: "0 – 4 °C",
        c: 1.8,
        state: "ok",
        rows: [
          ["Room", "Temper 2 · 18 h"],
          ["Probe", "F-21 · cal. 04 Aug 26"],
          ["Operator", "K. Iyer"],
          ["Document", "Temper & pack sheet"],
        ],
        body: "Tempered from frozen to chilled over 18 hours, cut to pack spec, vacuum sealed and weight-verified.",
      },
      {
        stage: "Last mile",
        note: "insulated, gel-packed, 90 min window",
        spec: "0 – 4 °C",
        c: 3.1,
        state: "ok",
        rows: [
          ["Route", "BLR-South · run 2"],
          ["Handover", "14 Aug 08:52 IST"],
          ["Rider probe", "R-09 at doorstep"],
          ["Document", "Delivery temperature slip"],
        ],
        body: "Probed at the door in front of the customer. Reading printed on the slip; refuse the box if it reads above 4 °C.",
      },
    ],
    readings: [
      { c: -19.2, leg: "frozen" },
      { c: -18.8, leg: "frozen" },
      { c: -19.0, leg: "frozen" },
      { c: -18.4, leg: "frozen" },
      { c: -17.9, leg: "frozen" },
      { c: -18.6, leg: "frozen" },
      { c: -18.2, leg: "frozen" },
      { c: 2.1, leg: "chilled" },
      { c: 1.8, leg: "chilled" },
      { c: 2.6, leg: "chilled" },
      { c: 3.4, leg: "chilled" },
      { c: 3.1, leg: "chilled" },
    ],
    legs: [
      { name: "Cold store · 62 h", span: 3 },
      { name: "Reefer · 41 h", span: 4 },
      { name: "Facility · 18 h", span: 2 },
      { name: "Last mile · 2 h", span: 3 },
    ],
    chartRange: "09 – 14 Aug · 124 readings",
    traceNote:
      "Every point is a real probe reading, sampled down for the chart. The frozen leg must sit inside the lower band; once tempered, inside the upper one. This lot never left either.",
  },

  "SOP-2674-C": {
    status: "breach",
    stampTop: "Held 11 Aug 22:14 IST",
    stampBot: "Destroyed 12 Aug · buyer credited",
    meta: [
      ["Product", "Pork loin, boneless"],
      ["Packer", "EST 118 · Fraser Valley"],
      ["Kill date", "04 Aug 2026"],
      ["Cases", "22 × 10 kg · none shipped"],
    ],
    stages: [
      {
        stage: "Abattoir",
        note: "blast freeze within 2 h of dressing",
        spec: "≤ −35 °C",
        c: -37.9,
        state: "ok",
        rows: [
          ["Probe", "P-208 · cal. 21 May 26"],
          ["Logged", "04 Aug 05:48 IST"],
          ["Operator", "Fraser Valley QA"],
          ["Document", "Kill & dress certificate"],
        ],
        body: "Nothing wrong at origin. The lot entered the chain correctly graded and correctly frozen.",
      },
      {
        stage: "Cold store",
        note: "pallet probe logged twice daily",
        spec: "≤ −18 °C",
        c: -18.9,
        state: "ok",
        rows: [
          ["Probe", "CS-03 · cal. 18 Jun 26"],
          ["Logged", "04–07 Aug · 6 readings"],
          ["Operator", "Store 2"],
          ["Document", "Store temperature register"],
        ],
        body: "55 hours in store, no deviations. Loaded into the container on 07 Aug.",
      },
      {
        stage: "Reefer transit",
        note: "door seal fault · 6 h at −6 °C",
        spec: "≤ −15 °C",
        c: -6.1,
        state: "fail",
        rows: [
          ["Container", "TCLU 552 907 3"],
          ["Alarm", "11 Aug 16:22 · door ajar"],
          ["Above spec for", "6 h 10 min · peak −6.1 °C"],
          ["Document", "Reefer download + alarm log"],
        ],
        body: "A failed door seal let the set point drift for six hours. The alarm fired to the duty manager at the first breach; the pallet was quarantined on arrival and never entered picking.",
      },
      {
        stage: "Our facility",
        note: "quarantine bay · not tempered",
        spec: "0 – 4 °C",
        c: null,
        state: "blocked",
        rows: [
          ["Room", "Quarantine · sealed"],
          ["Decision", "Destroy · 12 Aug 11:30"],
          ["Witnessed by", "QA + packer rep, video"],
          ["Document", "Destruction certificate"],
        ],
        body: "Refreezing would have hidden it. The lot was destroyed under witness and the packer was charged for the container.",
      },
      {
        stage: "Last mile",
        note: "no dispatch created",
        spec: "0 – 4 °C",
        c: null,
        state: "blocked",
        rows: [
          ["Orders affected", "9 · all re-cut from SOP-2681-A"],
          ["Customers told", "12 Aug 09:00, before the slot"],
          ["Credit", "Full, same day"],
          ["Document", "Incident note 2026-14"],
        ],
        body: "Customers heard it from us before they noticed anything, and got the replacement lot code in the same message.",
      },
    ],
    readings: [
      { c: -19.0, leg: "frozen" },
      { c: -18.6, leg: "frozen" },
      { c: -18.9, leg: "frozen" },
      { c: -17.2, leg: "frozen" },
      { c: -11.4, leg: "frozen" },
      { c: -6.1, leg: "frozen" },
      { c: -8.8, leg: "frozen" },
      { c: -13.2, leg: "frozen" },
    ],
    legs: [
      { name: "Cold store · 55 h", span: 3 },
      { name: "Reefer · door seal fault", span: 5 },
    ],
    chartRange: "04 – 11 Aug · log ends at quarantine",
    traceNote:
      "The trace stops where the lot did. Four readings sit outside the permitted band, so there is no chilled leg and no delivery — the pallet went from the container to the quarantine bay.",
  },
};

const headline = [
  { n: "5", label: "probed handovers per lot" },
  { n: "124", label: "readings on this lot" },
  { n: "0", label: "breached lots shipped" },
];

const gates = [
  { check: "Carcass class", spec: "Class 1 / 2", method: "Grader stamp verified against packer manifest" },
  { check: "Fat depth", spec: "12 – 22 mm", method: "Measured at last rib, three carcasses per lot" },
  { check: "pH at 24 h", spec: "5.5 – 5.9", method: "Probe in loin; outside range means DFD or PSE" },
  { check: "Drip loss", spec: "≤ 3 %", method: "Weighed pack against bagged declared weight" },
  { check: "Core temp on receipt", spec: "≤ −15 °C frozen", method: "Two cases per pallet, deepest position" },
  { check: "Seal & pack", spec: "Zero leakers", method: "Every vacuum pack hand-checked before labelling" },
];

const protocol = [
  {
    n: "01",
    head: "Alarm",
    body: "Any probe outside range pushes an SMS to the duty manager and flags the pallet in the system. No one can pick against a flagged pallet.",
    clock: "within 60 seconds",
  },
  {
    n: "02",
    head: "Isolate",
    body: "The pallet moves to the quarantine bay, sealed, with its download attached. It cannot be tempered, re-frozen or re-labelled.",
    clock: "on arrival",
  },
  {
    n: "03",
    head: "Decide",
    body: "QA and the packer review the interval file together. Destroy, or downgrade to cooked-only supply; affected buyers are told and credited before their slot.",
    clock: "same working day",
  },
];

const record = [
  ["Lots received", "418"],
  ["Lots with a breach", "3"],
  ["Breached lots shipped", "0"],
  ["Average credit turnaround", "6 h"],
];

// chart geometry — the permitted band per leg, drawn behind the readings
const MIN = -25;
const MAX = 8;
const SPAN = MAX - MIN;
const band = { frozen: { lo: -25, hi: -15 }, chilled: { lo: 0, hi: 4 } };
const pct = (v) => `${(((v - MIN) / SPAN) * 100).toFixed(1)}%`;

const ColdChainPage = () => {
  const [code, setCode] = useState("SOP-2681-A");
  const [stageIndex, setStageIndex] = useState(null);
  const [unit, setUnit] = useState("°C");

  const lot = lots[code];
  const isBreach = lot.status === "breach";
  const selected = Math.min(
    stageIndex ?? (isBreach ? 2 : 0),
    lot.stages.length - 1
  );
  const detail = lot.stages[selected];

  const fmt = (c) => {
    if (c === null || c === undefined) return "—";
    const f = unit === "°F";
    const v = f ? (c * 9) / 5 + 32 : c;
    return `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(1)} ${f ? "°F" : "°C"}`;
  };

  // specs are written in °C — rewrite them rather than showing mixed units
  const fmtSpec = (spec) =>
    unit === "°F"
      ? spec.replace(/(−|-)?(\d+(?:\.\d+)?)\s*°C/g, (m, sign, n) => {
          const c = (sign ? -1 : 1) * parseFloat(n);
          const f = (c * 9) / 5 + 32;
          return `${f < 0 ? "−" : ""}${Math.abs(f).toFixed(0)} °F`;
        })
      : spec;

  const readings = lot.readings.map((r) => {
    const b = band[r.leg];
    const ok = r.c >= b.lo && r.c <= b.hi;
    return {
      pos: pct(r.c),
      ok,
      bandBottom: pct(b.lo),
      bandH: `${(((b.hi - b.lo) / SPAN) * 100).toFixed(1)}%`,
    };
  });

  return (
    <div className="min-h-screen bg-sop-bone-100">
      <Navbar active="Cold chain" />

      {/* ---------------------------- hero ----------------------------- */}
      <section className="grid bg-sop-ink lg:grid-cols-[1.04fr_.96fr]">
        <div className="px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-16">
          <span className="sop-eyebrow mb-3.5 block text-sop-chill lg:mb-5">
            Cold chain · proof, not claims
          </span>
          <h1 className="mb-3.5 font-display text-[42px] leading-[.95] tracking-[-.015em] text-sop-bone-100 lg:mb-5 lg:text-[82px] lg:leading-[.9] lg:tracking-[-.025em]">
            Nothing here is a claim. Every line{" "}
            <span className="italic text-sop-loin">is a reading.</span>
          </h1>
          <p className="mb-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-sop-ash lg:mb-8 lg:max-w-[46ch] lg:text-[17px] lg:leading-[1.55]">
            Five handovers between the barn and your door. Each one is probed, logged and signed.
            The log is public: type the code on your carton and read the whole journey, including
            the parts we failed.
          </p>

          <div className="flex gap-px bg-sop-ink-70 lg:max-w-[520px]">
            {headline.map((h) => (
              <div key={h.label} className="flex-1 bg-sop-ink px-2.5 py-3 lg:px-3.5 lg:py-4">
                <span className="block font-display text-[28px] leading-none text-sop-loin lg:text-[40px]">
                  {h.n}
                </span>
                <span className="mt-1.5 block font-plex text-[10px] leading-[1.35] text-sop-ink-40 lg:text-[11px] lg:leading-[1.4]">
                  {h.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------ lot lookup ------------------------- */}
        <div className="border-t border-sop-ink-70 px-4 pb-8 pt-7 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:px-11 lg:pb-14 lg:pt-16">
          <span className="sop-eyebrow mb-3.5 block text-sop-loin lg:mb-4">Look up a lot</span>

          <div className="mb-3.5 flex border-[1.5px] border-sop-loin bg-sop-ink">
            <span className="flex min-h-[50px] flex-1 items-center px-3.5 font-plex font-medium text-sm leading-none tracking-[.04em] text-sop-bone-100 lg:min-h-[56px] lg:px-4 lg:text-[17px] lg:tracking-[.06em]">
              {code}
            </span>
            <button
              type="button"
              onClick={() => setStageIndex(null)}
              className="inline-flex min-h-[50px] flex-none items-center bg-sop-loin px-5 font-archivo font-semibold text-[11.5px] leading-none tracking-[.1em] uppercase text-sop-ink hover:bg-sop-blush lg:min-h-[56px] lg:px-6 lg:text-[12.5px]"
            >
              Trace
            </button>
          </div>

          <div className="mb-3.5 flex flex-wrap gap-2">
            {Object.keys(lots).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setCode(key);
                  setStageIndex(null);
                }}
                className={`px-3.5 py-3 font-plex font-medium text-[11px] leading-none tracking-[.04em] lg:text-xs ${
                  key === code
                    ? "bg-sop-loin text-sop-ink"
                    : "border border-sop-ink-50 text-sop-ash hover:border-sop-loin hover:text-sop-bone-100"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          <span className="mb-5 block font-plex text-[11.5px] leading-[1.6] text-sop-ink-40 lg:mb-6 lg:text-xs">
            Printed on the carton label, under the QR. Two sample lots loaded — one held, one broke.
          </span>

          <div className="grid grid-cols-2 gap-px border border-sop-ink-70 bg-sop-ink-70">
            {lot.meta.map(([k, v]) => (
              <div key={k} className="bg-sop-ink px-3.5 py-3">
                <span className="mb-1.5 block font-archivo font-semibold text-[9.5px] leading-none tracking-[.16em] uppercase text-sop-ink-40">
                  {k}
                </span>
                <span className="block font-plex text-[12.5px] leading-[1.4] text-sop-bone-100 lg:text-[13px]">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- verdict ---------------------------- */}
      {isBreach ? (
        <div className="flex flex-col justify-between gap-3 border-t-2 border-sop-loin bg-sop-ink px-4 py-4 lg:flex-row lg:items-center lg:px-11 lg:py-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-[18px]">
            <span className="font-archivo font-semibold text-[10.5px] leading-none tracking-[.2em] uppercase text-sop-loin">
              Chain broken · not shipped
            </span>
            <span className="font-display text-[26px] leading-none text-sop-bone-100 lg:text-[34px]">
              Held at handover 3
            </span>
          </div>
          <span className="text-right font-plex text-[11px] leading-[1.5] text-sop-chill lg:text-xs">
            {lot.stampTop} · {lot.stampBot}
          </span>
        </div>
      ) : (
        <div className="flex flex-col justify-between gap-3 bg-sop-loin px-4 py-4 lg:flex-row lg:items-center lg:px-11 lg:py-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-[18px]">
            <span className="font-archivo font-semibold text-[10.5px] leading-none tracking-[.2em] uppercase text-sop-rust">
              Chain held
            </span>
            <span className="font-display text-[26px] leading-none text-sop-ink lg:text-[34px]">
              Released to dispatch
            </span>
          </div>
          <span className="text-right font-plex text-[11px] leading-[1.5] text-sop-rust lg:text-xs">
            {lot.stampTop} · {lot.stampBot}
          </span>
        </div>
      )}

      {/* ----------------- handovers + the probe trace ------------------ */}
      <section className="grid lg:grid-cols-2">
        <div className="border-b border-sop-bone-300 bg-sop-bone-100 px-4 pb-8 pt-7 lg:border-b-0 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <div className="mb-4 flex items-baseline justify-between gap-4 lg:mb-5">
            <h2 className="font-display text-[27px] leading-none text-sop-ink lg:text-[44px]">
              The five handovers
            </h2>
            <span className="font-plex text-[10.5px] leading-none text-sop-ink-50 lg:text-[11.5px]">
              tap a row
            </span>
          </div>

          <div className="border-t border-sop-ink">
            {lot.stages.map((s, i) => (
              <button
                key={s.stage}
                type="button"
                onClick={() => setStageIndex(i)}
                className={`flex w-full items-baseline justify-between gap-3 border-b border-sop-bone-300 py-3.5 text-left transition-colors duration-[120ms] hover:bg-sop-blush lg:gap-4 lg:py-[15px] ${
                  i === selected ? "bg-sop-blush" : ""
                }`}
              >
                <div className="flex items-baseline gap-2.5 lg:gap-3.5">
                  <span className="flex-none font-plex text-[11px] leading-[1.4] text-sop-ink-50 lg:text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-archivo font-medium text-xs leading-[1.2] tracking-[.1em] uppercase text-sop-ink lg:text-[12.5px]">
                      {s.stage}
                    </span>
                    <span className="font-plex text-[10.5px] leading-[1.45] text-sop-ink-50 lg:text-[11.5px]">
                      {s.note}
                    </span>
                    <span className="font-plex text-[10.5px] leading-[1.45] text-sop-ink-40 lg:text-[11.5px]">
                      spec {fmtSpec(s.spec)}
                    </span>
                  </span>
                </div>

                <span className="flex flex-none flex-col items-end gap-1.5">
                  <span
                    className={`whitespace-nowrap font-plex text-[15px] leading-none lg:text-[19px] ${
                      s.state === "fail"
                        ? "text-sop-cured"
                        : s.state === "blocked"
                        ? "text-sop-ink-40"
                        : "text-sop-ink"
                    }`}
                  >
                    {fmt(s.c)}
                  </span>
                  {s.state === "ok" && (
                    <span className="font-plex font-medium text-[9.5px] leading-none tracking-[.1em] uppercase text-sop-ink-50 lg:text-[10px]">
                      in spec
                    </span>
                  )}
                  {s.state === "fail" && (
                    <span className="bg-sop-ink px-1.5 py-1 font-plex font-medium text-[9.5px] leading-none tracking-[.1em] uppercase text-sop-loin lg:text-[10px]">
                      breach
                    </span>
                  )}
                  {s.state === "blocked" && (
                    <span className="font-plex font-medium text-[9.5px] leading-none tracking-[.1em] uppercase text-sop-ink-40 lg:text-[10px]">
                      never released
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* the selected handover */}
          <div className="mt-5 border-l-2 border-sop-ink bg-sop-bone-200 p-4 lg:mt-6 lg:p-[18px]">
            <span className="mb-2.5 block font-archivo font-semibold text-[9.5px] leading-none tracking-[.16em] uppercase text-sop-ink-50 lg:mb-3 lg:text-[10px]">
              Handover {String(selected + 1).padStart(2, "0")} · {detail.stage}
            </span>
            <div className="grid gap-x-6 lg:grid-cols-2">
              {detail.rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-3.5 border-b border-sop-bone-300 py-2"
                >
                  <span className="sop-key">{k}</span>
                  <span className="sop-val text-[11.5px] lg:text-xs">{v}</span>
                </div>
              ))}
            </div>
            <span className="mt-3 block max-w-[56ch] text-[12.5px] leading-[1.55] text-sop-ink-70 lg:mt-3.5 lg:text-[13.5px]">
              {detail.body}
            </span>
          </div>
        </div>

        {/* -------------------------- the trace ------------------------- */}
        <div className="bg-sop-ink px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-[27px] leading-none text-sop-bone-100 lg:text-[44px]">
              Probe trace
            </h2>
            <div className="flex gap-px bg-sop-ink-70">
              {["°C", "°F"].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`px-2.5 py-2 font-plex text-[11px] leading-none ${
                    unit === u ? "bg-sop-loin text-sop-ink" : "bg-sop-ink text-sop-ash"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          <span className="mb-1 block font-plex text-[10.5px] leading-none text-sop-ink-40 lg:text-[11.5px]">
            {lot.chartRange}
          </span>
          <span className="mb-4 block font-plex text-[10.5px] leading-[1.5] text-sop-ink-40 lg:mb-5 lg:text-[11.5px]">
            shaded band = permitted range for that leg
          </span>

          <div className="flex gap-2.5 lg:gap-3">
            <div className="flex h-[190px] flex-none flex-col justify-between lg:h-[280px]">
              {[8, 0, -10, -25].map((tick) => (
                <span
                  key={tick}
                  className="whitespace-nowrap font-plex text-[9.5px] leading-none text-sop-ink-40 lg:text-[10.5px]"
                >
                  {fmt(tick)}
                </span>
              ))}
            </div>

            {/* plot and leg labels share one column, so the labels line up with
                the readings whatever width the axis takes */}
            <div className="flex-1">
              <div className="flex h-[190px] gap-[3px] border-b border-l border-sop-ink-70 pl-[3px] lg:h-[280px] lg:gap-[5px] lg:pl-[5px]">
              {readings.map((r, i) => (
                <div key={i} className="relative h-full flex-1">
                  <div
                    className="absolute left-0 right-0 bg-sop-chill-band"
                    style={{ bottom: r.bandBottom, height: r.bandH }}
                  />
                  <div
                    className={`absolute left-1/2 bottom-0 w-px ${
                      r.ok ? "bg-sop-ink-70" : "bg-sop-rust"
                    }`}
                    style={{ height: r.pos }}
                  />
                  <div
                    className={`absolute left-1/2 ${
                      r.ok ? "h-[7px] w-[7px] bg-sop-chill lg:h-[9px] lg:w-[9px]" : "h-[11px] w-[11px] bg-sop-loin lg:h-[13px] lg:w-[13px]"
                    }`}
                    style={{
                      bottom: r.pos,
                      marginLeft: r.ok ? "-3.5px" : "-5.5px",
                      marginBottom: r.ok ? "-3.5px" : "-5.5px",
                    }}
                  />
                </div>
              ))}
              </div>

              <div className="mt-2.5 flex gap-[3px] pl-[3px] lg:gap-[5px] lg:pl-[5px]">
            {lot.legs.map((g) => (
              <span
                key={g.name}
                style={{ flex: g.span }}
                className="border-t border-sop-ink-70 pt-1.5 font-plex text-[9.5px] leading-[1.35] text-sop-ink-40 lg:pt-[7px] lg:text-[10.5px] lg:leading-[1.4]"
              >
                {g.name}
              </span>
            ))}
              </div>
            </div>
          </div>

          <p className="mb-5 mt-5 max-w-[36ch] text-[13.5px] leading-[1.6] text-sop-ash lg:mb-6 lg:mt-6 lg:max-w-[44ch] lg:text-[14.5px]">
            {lot.traceNote}
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="sop-btn-loin lg:min-h-[50px] lg:px-[22px] lg:text-[12.5px]">
              Download log · PDF
            </span>
            <span className="sop-btn-outline-light lg:min-h-[50px] lg:px-[22px] lg:text-[12.5px]">
              Raw probe CSV
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------ quality gates ------------------------- */}
      <section className="border-t border-sop-bone-300 bg-sop-bone-100 px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
        <div className="grid items-start gap-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-11">
          <div>
            <span className="sop-eyebrow mb-3.5 block text-sop-cured lg:mb-4">Quality gates</span>
            <h2 className="mb-3.5 font-display text-[32px] leading-none text-sop-ink lg:mb-4 lg:text-[52px] lg:leading-[.98]">
              What we check,
              <br />
              <span className="italic">and what fails it</span>
            </h2>
            <p className="max-w-[38ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:text-[16px]">
              Grading is done on arrival, then again before packing. A lot that misses any line
              below is downgraded or destroyed — never quietly sold on.
            </p>
          </div>

          <div className="border-t border-sop-ink">
            {gates.map((g) => (
              <div
                key={g.check}
                className="grid gap-1.5 border-b border-sop-bone-300 py-3 lg:grid-cols-[1fr_1.1fr_.8fr] lg:items-baseline lg:gap-5 lg:py-3.5"
              >
                <span className="font-archivo font-semibold text-[11px] leading-[1.3] tracking-[.12em] uppercase text-sop-ink lg:text-[11.5px]">
                  {g.check}
                </span>
                <span className="font-plex text-[11px] leading-[1.5] text-sop-ink-50 lg:text-[11.5px]">
                  {g.method}
                </span>
                <span className="font-plex text-[12px] leading-[1.4] text-sop-ink lg:text-right lg:text-[13px]">
                  {fmtSpec(g.spec)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- protocol + the carton QR ------------------- */}
      <section className="grid border-t border-sop-bone-300 lg:grid-cols-[1.15fr_.85fr]">
        <div className="border-b border-sop-bone-300 bg-sop-blush px-4 pb-8 pt-7 lg:border-b-0 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-rust lg:mb-4">
            When a reading breaks
          </span>
          <h2 className="mb-5 font-display text-[32px] leading-none text-sop-ink lg:mb-6 lg:text-[52px]">
            Three steps, no discretion
          </h2>
          <div className="grid gap-px bg-sop-blush-edge lg:grid-cols-3">
            {protocol.map((p) => (
              <div key={p.n} className="bg-sop-blush py-3.5 lg:pr-4">
                <div className="mb-2.5 flex items-baseline gap-2.5">
                  <span className="font-plex text-[11px] leading-none text-sop-rust lg:text-xs">
                    {p.n}
                  </span>
                  <span className="font-archivo font-semibold text-xs leading-none tracking-[.12em] uppercase text-sop-ink lg:text-[12.5px]">
                    {p.head}
                  </span>
                </div>
                <span className="block max-w-[34ch] text-[13.5px] leading-[1.6] text-sop-ink-70 lg:max-w-none lg:text-[14px]">
                  {p.body}
                </span>
                <span className="mt-2.5 block font-plex text-[10.5px] leading-[1.5] text-sop-rust lg:text-[11px]">
                  {p.clock}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-sop-bone-200 px-4 pb-8 pt-7 lg:border-l lg:border-sop-bone-300 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <div className="flex items-start gap-4 lg:gap-5">
            <div
              className="h-24 w-24 flex-none border-[6px] border-sop-bone-100 outline outline-1 outline-sop-bone-400 lg:h-[120px] lg:w-[120px] lg:border-8"
              style={{
                background:
                  "repeating-conic-gradient(#221E1C 0 25%, #FBF7F1 0 50%) 0 0 / 16px 16px",
              }}
            />
            <div>
              <span className="sop-eyebrow mb-2.5 block text-sop-ink-50 lg:mb-3">
                On every carton
              </span>
              <span className="mb-2.5 block font-display text-[25px] leading-[1.05] text-sop-ink lg:mb-3 lg:text-[34px] lg:leading-[1.02]">
                Scan it before you cook
              </span>
              <span className="block max-w-[34ch] text-[13px] leading-[1.6] text-sop-ink-70 lg:text-[14.5px]">
                The QR opens this same page, already filled with your lot: probe readings, packer,
                kill date, thaw guidance.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- audit pack + the record ------------------- */}
      <section className="grid bg-sop-ink lg:grid-cols-2">
        <div className="px-4 pb-8 pt-7 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-3.5 block text-sop-chill">For trade buyers</span>
          <h2 className="mb-3.5 font-display text-[30px] leading-none text-sop-bone-100 lg:mb-4 lg:text-[46px]">
            Audit pack on request
          </h2>
          <p className="mb-5 max-w-[34ch] text-[13.5px] leading-[1.6] text-sop-ash lg:mb-6 lg:max-w-[42ch] lg:text-[15px]">
            HACCP plan, FSSAI licence, calibration certificates for every probe, and 12 months of
            breach history. Sent as one folder, refreshed quarterly.
          </p>
          <Link to="/wholesale" className="sop-btn-ember lg:min-h-[50px] lg:px-6 lg:text-[12.5px]">
            Request audit pack
          </Link>
        </div>

        <div className="border-t border-sop-ink-70 px-4 pb-8 pt-7 lg:border-l lg:border-t-0 lg:px-11 lg:pb-14 lg:pt-[52px]">
          <span className="sop-eyebrow mb-4 block text-sop-loin lg:mb-5">Last twelve months</span>
          <div className="border-t border-sop-ink-70">
            {record.map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-5 border-b border-sop-ink-70 py-3.5"
              >
                <span className="font-archivo font-medium text-[12.5px] leading-[1.3] tracking-[.1em] uppercase text-sop-bone-100">
                  {k}
                </span>
                <span className="whitespace-nowrap font-plex text-[15px] leading-none text-sop-chill lg:text-[17px]">
                  {v}
                </span>
              </div>
            ))}
          </div>
          <span className="mt-4 block font-plex text-[11.5px] leading-[1.6] text-sop-ink-40 lg:text-xs">
            Published quarterly whether the numbers flatter us or not.
          </span>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ColdChainPage;
