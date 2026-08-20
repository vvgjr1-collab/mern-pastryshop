import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hatch from "../components/Hatch";
import api from "../lib/axios";
import { getUserId } from "../lib/userId";
import {
  getStoredAccount,
  saveAccount,
  clearAccount,
  setTrack,
  hasWholesaleAccess,
} from "../lib/account";
import { formatINR } from "../lib/utils";
import { WHOLESALE } from "../lib/trade";

// Trade inverts to charcoal, so a buyer always knows which side of the house
// they are on. Rates and spec sheets are gated: the page says plainly what it
// is withholding rather than hiding the section.
const MASK = "▓▓▓▓";

const facts = [
  { n: "16", label: "SKUs in the trade catalogue" },
  { n: "1 case", label: "minimum order on most cuts" },
  { n: "18:00", label: "cut-off the day before dispatch" },
  { n: "net 15", label: "credit once the account is established" },
];

const logistics = [
  { k: "Order cut-off", v: WHOLESALE.orderCutOff },
  { k: "Delivery windows", v: "05:00 – 08:00, by route" },
  { k: "Lead time, frozen", v: "48 h from confirmation" },
  { k: "Standing orders", v: "Same lines, same window, weekly" },
  { k: "Sunday", v: "No dispatch · Saturday double-drop" },
  { k: "Cities served", v: "Bengaluru · Mumbai" },
];

const credit = [
  { k: "First three orders", v: "Advance, on invoice" },
  { k: "Terms after review", v: "15 days from invoice date" },
  { k: "Credit limit", v: "Set on turnover, reviewed quarterly" },
  { k: "Security deposit", v: "None for GST-registered outlets" },
  { k: "Payment modes", v: "NEFT · RTGS · UPI · corporate card" },
  { k: "Late payment", v: "Supply held at 45 days" },
];

const sheets = [
  { name: "Pork · full spec pack", meta: "PDF · 2.4 MB · all pork SKUs" },
  { name: "Charcuterie · slicing yields", meta: "PDF · 1.1 MB · cold cuts" },
  { name: "Cold chain SOP", meta: "PDF · 640 KB · rev. 08 / 26" },
  { name: "FSSAI & test certificates", meta: "ZIP · 5.8 MB · current quarter" },
  { name: "Case & pallet dimensions", meta: "XLSX · 220 KB" },
  { name: "Allergen & additive matrix", meta: "PDF · 380 KB" },
];

const outletTypes = [
  ["restaurant", "Restaurant"],
  ["hotel", "Hotel"],
  ["retailer", "Deli / retail"],
  ["cloud-kitchen", "Cloud kitchen"],
  ["caterer", "Caterer"],
  ["other", "Other"],
];

const fields = [
  { key: "businessName", label: "Registered legal name", ph: "As on GST certificate", hint: "" },
  { key: "contactName", label: "Purchase contact", ph: "Whoever signs for the delivery", hint: "" },
  { key: "phone", label: "Phone", ph: "+91", hint: "" },
  { key: "email", label: "Email", ph: "orders@yourkitchen.in", hint: "" },
  { key: "gstin", label: "GSTIN", ph: "29ABCDE1234F1Z5", hint: "15 characters · we invoice against it" },
  { key: "fssai", label: "FSSAI licence number", ph: "12345678901234", hint: "14 digits · your outlet's own licence" },
  { key: "city", label: "City", ph: "Bengaluru", hint: "" },
];

const WholesalePage = () => {
  const [account, setAccount] = useState(getStoredAccount());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    businessType: "restaurant",
    contactName: "",
    phone: "",
    email: "",
    gstin: "",
    fssai: "",
    deliveryAddress: "",
    city: "",
  });

  const navigate = useNavigate();
  const approved = account?.status === "approved" && hasWholesaleAccess();

  // refresh status from the server — approval happens off-site
  useEffect(() => {
    const refresh = async () => {
      if (!account?._id) return;
      try {
        const res = await api.get("/accounts/me", { params: { userId: getUserId() } });
        setAccount(saveAccount(res.data));
      } catch (error) {
        if (error.response?.status !== 404) console.log("Error refreshing account", error);
      }
    };

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // case sizes and MOQ are public; the rate only arrives if the request
  // carries an approved account key
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products.filter((p) => p.wholesale));
      } catch (error) {
        console.log("Could not load the case list", error);
      }
    };

    fetchCases();
  }, [approved]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = [
      "businessName",
      "contactName",
      "phone",
      "email",
      "gstin",
      "fssai",
      "deliveryAddress",
    ];
    if (required.some((key) => !form[key].trim())) {
      toast.error("GST, FSSAI and contact details are all required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/accounts/apply", { ...form, userId: getUserId() });
      const saved = saveAccount(res.data);
      setAccount(saved);

      if (saved.status === "approved") {
        toast.success("Trade account open — rate card unlocked");
      } else {
        toast.success("Application received. We'll verify and come back to you.");
      }
    } catch (error) {
      console.log("Error applying for account", error);
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sop-ink">
      <Navbar inverted active="Wholesale" />

      {/* ---------------------------- hero ----------------------------- */}
      <section className="grid border-b border-sop-ink-70 lg:grid-cols-[1.15fr_.85fr]">
        <div className="px-4 pb-8 pt-7 lg:px-11 lg:pb-[52px] lg:pt-14">
          <span className="sop-eyebrow mb-4 block text-sop-loin lg:mb-5">
            {approved
              ? `Signed in · ${account.businessName} · A/c ${account.accountKey.slice(-5)}`
              : "HORECA supply · Bengaluru & Mumbai"}
          </span>
          <h1 className="mb-4 font-display text-[46px] leading-[.92] tracking-[-.02em] text-sop-bone-100 lg:mb-5 lg:text-[84px] lg:leading-[.88] lg:tracking-[-.025em]">
            Supply for
            <br />
            serious <span className="italic">kitchens</span>
          </h1>
          <p className="mb-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-sop-ash lg:mb-7 lg:max-w-[46ch] lg:text-[17px] lg:leading-[1.55]">
            Case quantities of the same cuts we sell at the counter, with spec sheets, consistent
            trim and a cold chain you can audit. Chefs, hotels, delis, cloud kitchens.
          </p>
          <div className="flex flex-wrap gap-3">
            {approved ? (
              <button
                type="button"
                onClick={() => {
                  setTrack("wholesale");
                  navigate("/catalogue");
                }}
                className="sop-btn-ember lg:min-h-[52px] lg:px-6 lg:text-[12.5px]"
              >
                Open the rate card
              </button>
            ) : (
              <a href="#apply" className="sop-btn-ember lg:min-h-[52px] lg:px-6 lg:text-[12.5px]">
                Request rate card
              </a>
            )}
            <span className="sop-btn-outline-light lg:min-h-[52px] lg:px-6 lg:text-[12.5px]">
              Trade desk · +91 98217 00016
            </span>
          </div>
        </div>

        <Hatch
          from="#2A2523"
          to="#221E1C"
          className="hidden items-end border-l border-sop-ink-70 p-4 lg:flex"
        >
          <span className="font-plex text-[11px] leading-[1.6] text-sop-ink-40">
            trade still · stacked cases on a pallet
            <br />
            cold store, honest light, no staging
            <br />
            label and lot code legible
          </span>
        </Hatch>
      </section>

      {/* ---------------------------- facts ----------------------------- */}
      <div className="grid grid-cols-2 gap-px border-b border-sop-ink-70 bg-sop-ink-70 lg:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="bg-sop-ink px-3.5 py-4 lg:px-6 lg:py-6">
            <span className="block font-display text-[30px] leading-none text-sop-bone-100 lg:text-[44px]">
              {f.n}
            </span>
            <span className="mt-2 block font-plex text-[10.5px] leading-[1.4] text-sop-ink-40 lg:text-[11.5px] lg:leading-[1.45]">
              {f.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_470px]">
        {/* ------------------------ trade terms ------------------------- */}
        <div className="px-4 pb-9 pt-7 lg:border-r lg:border-sop-ink-70 lg:p-11">
          {/* case sizes & MOQ */}
          <div className="mb-9 lg:mb-11">
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-[28px] leading-none text-sop-bone-100 lg:text-[42px]">
                Case sizes &amp; MOQ
              </h2>
              <span className="whitespace-nowrap font-archivo font-semibold text-[10.5px] leading-none tracking-[.14em] uppercase text-sop-loin">
                {approved ? "Live rates" : "Rates locked"}
              </span>
            </div>
            <span className="mb-4 block font-plex text-[11.5px] leading-[1.5] text-sop-ink-40 lg:text-xs">
              {approved
                ? "Contract rates for your account, ex-GST. Rates move with landed cost, never mid-week."
                : "Case sizes and MOQ are public. Per-kg rates are released with an approved account."}
            </span>

            <div className="border-t border-sop-ink-50">
              {/* header row, desktop only */}
              <div className="hidden grid-cols-[1.6fr_1fr_.7fr_.9fr] gap-4 border-b border-sop-ink-70 py-2.5 lg:grid">
                {["SKU", "Case", "MOQ", "Rate / kg"].map((h, i) => (
                  <span
                    key={h}
                    className={`font-archivo font-semibold text-[10px] leading-none tracking-[.12em] uppercase text-sop-ink-40 ${
                      i === 3 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {products.map((p) => (
                <div
                  key={p._id}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-2 border-b border-sop-ink-70 py-3 lg:grid-cols-[1.6fr_1fr_.7fr_.9fr] lg:gap-4 lg:py-3.5"
                >
                  <span className="font-medium text-[13.5px] leading-[1.3] text-sop-bone-100">
                    {p.name}
                  </span>
                  <span className="row-start-2 font-plex text-[11px] leading-[1.4] text-sop-ink-40 lg:row-auto lg:text-xs">
                    {p.wholesale.caseSizeKg} kg case
                  </span>
                  <span className="hidden font-plex text-xs leading-[1.4] text-sop-ink-40 lg:block">
                    {p.wholesale.moqCases} case{p.wholesale.moqCases === 1 ? "" : "s"}
                  </span>
                  <span
                    className={`whitespace-nowrap text-right font-plex font-medium text-[13px] leading-[1.4] ${
                      approved ? "text-sop-bone-100" : "text-sop-chill"
                    }`}
                  >
                    {approved && p.wholesale.pricePerKg
                      ? `${formatINR(p.wholesale.pricePerKg)} / kg`
                      : MASK}
                  </span>
                </div>
              ))}

              {products.length === 0 && (
                <span className="block py-4 font-plex text-[11.5px] text-sop-ink-40">
                  Loading the case list…
                </span>
              )}
            </div>

            {!approved && (
              <div className="mt-4 flex flex-col justify-between gap-4 border-l-2 border-sop-loin bg-[#2E2926] p-4 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-1.5">
                  <span className="font-archivo font-semibold text-[10.5px] leading-none tracking-[.14em] uppercase text-sop-loin">
                    Rates locked
                  </span>
                  <span className="font-plex text-[11.5px] leading-[1.6] text-sop-ash">
                    Case rates and the full trade catalogue unlock the day your account is approved
                    — usually one working day.
                  </span>
                </div>
                <a href="#apply" className="sop-btn-loin whitespace-nowrap">
                  Apply now
                </a>
              </div>
            )}
          </div>

          {/* cut-offs + credit */}
          <div className="mb-9 grid gap-8 lg:mb-11 lg:grid-cols-2 lg:gap-11">
            <div>
              <h2 className="mb-4 font-display text-[26px] leading-none text-sop-bone-100 lg:text-[34px]">
                Cut-offs &amp; windows
              </h2>
              <div className="border-t border-sop-ink-50">
                {logistics.map((l) => (
                  <div
                    key={l.k}
                    className="flex justify-between gap-4 border-b border-sop-ink-70 py-3"
                  >
                    <span className="max-w-[44%] flex-none font-archivo font-semibold text-[10.5px] leading-[1.4] tracking-[.12em] uppercase text-sop-ink-40">
                      {l.k}
                    </span>
                    <span className="text-right font-plex text-[12.5px] leading-[1.5] text-sop-bone-100">
                      {l.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 font-display text-[26px] leading-none text-sop-bone-100 lg:text-[34px]">
                Credit terms
              </h2>
              <div className="border-t border-sop-ink-50">
                {credit.map((c) => (
                  <div
                    key={c.k}
                    className="flex justify-between gap-4 border-b border-sop-ink-70 py-3"
                  >
                    <span className="max-w-[44%] flex-none font-archivo font-semibold text-[10.5px] leading-[1.4] tracking-[.12em] uppercase text-sop-ink-40">
                      {c.k}
                    </span>
                    <span className="text-right font-plex text-[12.5px] leading-[1.5] text-sop-bone-100">
                      {c.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* spec sheets */}
          <div>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-[26px] leading-none text-sop-bone-100 lg:text-[34px]">
                Spec sheets
              </h2>
              <span className="font-plex text-[11.5px] leading-none text-sop-ink-40">
                {approved ? "Current revisions · download" : "Available on approval"}
              </span>
            </div>
            <div className="grid gap-px border border-sop-ink-70 bg-sop-ink-70 sm:grid-cols-2">
              {sheets.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between gap-3.5 bg-sop-ink p-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium text-[13px] leading-[1.3] text-sop-bone-100 lg:text-[13.5px]">
                      {s.name}
                    </span>
                    <span className="font-plex text-[10.5px] leading-none text-sop-ink-40 lg:text-[11px]">
                      {s.meta}
                    </span>
                  </div>
                  <span
                    className={`whitespace-nowrap font-archivo font-semibold text-[10px] leading-none tracking-[.12em] uppercase lg:text-[10.5px] ${
                      approved ? "text-sop-loin" : "text-sop-chill"
                    }`}
                  >
                    {approved ? "Download" : "Locked"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --------------------- application / account ------------------ */}
        <div id="apply" className="bg-sop-bone-100 px-4 pb-10 pt-7 lg:px-8 lg:pb-11 lg:pt-10">
          {!account && (
            <>
              <span className="sop-eyebrow mb-3.5 block text-sop-cured">Account application</span>
              <h2 className="mb-2.5 font-display text-[34px] leading-none text-sop-ink lg:text-[42px]">
                Open a trade account
              </h2>
              <p className="mb-6 max-w-[36ch] text-[14px] leading-[1.6] text-sop-ink-70 lg:text-[14.5px]">
                GST and FSSAI details are mandatory — we can't invoice a kitchen without them. One
                working day to approval.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {fields.map((f) => (
                  <label key={f.key} className="flex flex-col gap-2">
                    <span className="sop-label">{f.label}</span>
                    <input
                      type="text"
                      className="sop-input"
                      placeholder={f.ph}
                      value={form[f.key]}
                      onChange={set(f.key)}
                    />
                    {f.hint && (
                      <span className="font-plex text-[10.5px] leading-[1.4] text-sop-ink-40">
                        {f.hint}
                      </span>
                    )}
                  </label>
                ))}

                <label className="flex flex-col gap-2">
                  <span className="sop-label">Delivery address</span>
                  <textarea
                    className="sop-textarea h-24"
                    placeholder="Kitchen entrance, not the front desk"
                    value={form.deliveryAddress}
                    onChange={set("deliveryAddress")}
                  />
                </label>

                <div className="flex flex-col gap-2.5">
                  <span className="sop-label">Outlet type</span>
                  <div className="flex flex-wrap gap-2">
                    {outletTypes.map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, businessType: value }))}
                        className={form.businessType === value ? "sop-chip-on" : "sop-chip-off"}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="sop-btn-ink mt-1 w-full">
                  {loading ? "Submitting…" : "Submit application"}
                </button>
                <span className="sop-note">
                  Submitting shares your GST and FSSAI details with our trade desk only. No
                  marketing, ever.
                </span>
              </form>
            </>
          )}

          {account?.status === "pending" && (
            <div className="py-10 text-center">
              <span className="sop-eyebrow mb-3 block text-sop-cured">Under review</span>
              <h2 className="mb-3 font-display text-[32px] leading-none text-sop-ink">
                Application received
              </h2>
              <p className="mx-auto mb-6 max-w-[34ch] text-[14px] leading-[1.6] text-sop-ink-70">
                We're verifying the GSTIN and FSSAI licence for{" "}
                <strong>{account.businessName}</strong>. Your account contact will call within one
                working day.
              </p>
              <button
                type="button"
                onClick={() => {
                  clearAccount();
                  setAccount(null);
                }}
                className="border-b border-sop-bone-400 pb-0.5 font-plex text-[11.5px] leading-none text-sop-ink-50"
              >
                Start a different application
              </button>
            </div>
          )}

          {account?.status === "approved" && (
            <>
              <span className="sop-eyebrow mb-3.5 block text-sop-cured">Account open</span>
              <h2 className="mb-2.5 font-display text-[34px] leading-none text-sop-ink lg:text-[42px]">
                {account.businessName}
              </h2>
              <p className="mb-6 max-w-[36ch] text-[14px] leading-[1.6] text-sop-ink-70">
                Wholesale pricing is visible while the Trade door is selected. Switch back to Home
                any time — the consumer catalogue never shows your rates.
              </p>

              <div className="mb-6 border-t border-sop-ink">
                {[
                  ["GSTIN", account.gstin],
                  ["FSSAI", account.fssai],
                  ["Credit terms", account.creditTerms],
                  ["Account contact", account.accountManager?.name],
                  ["Direct line", account.accountManager?.phone],
                  ["Email", account.accountManager?.email],
                ].map(([k, v]) => (
                  <div key={k} className="sop-row">
                    <span className="sop-key">{k}</span>
                    <span className="sop-val">{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTrack("wholesale");
                    navigate("/catalogue");
                  }}
                  className="sop-btn-ember flex-1"
                >
                  Open the rate card
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearAccount();
                    setAccount(null);
                    toast.success("Signed out of the trade account");
                  }}
                  className="sop-btn-outline flex-1"
                >
                  Sign out
                </button>
              </div>
            </>
          )}

          {account?.status === "rejected" && (
            <div className="py-10 text-center">
              <h2 className="mb-3 font-display text-[32px] leading-none text-sop-ink">
                Application declined
              </h2>
              <p className="mx-auto max-w-[34ch] text-[14px] leading-[1.6] text-sop-ink-70">
                We couldn't verify the details supplied. Call the trade desk on +91 98217 00016 and
                we'll sort it out.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WholesalePage;
