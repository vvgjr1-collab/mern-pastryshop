import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

const benefits = [
  "Rate card on every SKU, per kg, in 5 kg and 10 kg cases",
  "MOQ and minimum order value stated up front, never at the till",
  `Order cut-off ${WHOLESALE.orderCutOff}, fixed delivery windows`,
  "Credit terms once the account is established",
  "Standing and repeat orders in one click",
  "Downloadable spec sheet per SKU, with batch certificates",
  "A named account contact, not a helpdesk",
];

const WholesalePage = () => {
  const [account, setAccount] = useState(getStoredAccount());
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

  // refresh status from the server — approval happens off-site
  useEffect(() => {
    const refresh = async () => {
      if (!account?._id) return;
      try {
        const res = await api.get("/accounts/me", {
          params: { userId: getUserId() },
        });
        setAccount(saveAccount(res.data));
      } catch (error) {
        if (error.response?.status !== 404) {
          console.log("Error refreshing account", error);
        }
      }
    };

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
      const res = await api.post("/accounts/apply", {
        ...form,
        userId: getUserId(),
      });
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
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back
          </Link>

          <div className="grid gap-6 md:grid-cols-3">
            {/* ---------------------- the pitch ---------------------- */}
            <div className="card bg-base-100 md:col-span-1 h-fit">
              <div className="card-body">
                <h2 className="card-title">Trade accounts</h2>
                <p className="text-sm text-base-content/70">
                  Same SKUs as the consumer catalogue, different pack sizes and
                  different pricing. Wholesale rates are never shown on the open
                  site.
                </p>
                <ul className="text-sm text-base-content/70 space-y-2 mt-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <CheckCircle2Icon className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-base-content/50 mt-4">
                  Minimum order value {formatINR(WHOLESALE.minOrderValue)} per
                  drop.
                </p>
              </div>
            </div>

            {/* ------------- application / account status ------------- */}
            <div className="card bg-base-100 md:col-span-2">
              <div className="card-body">
                {!account && (
                  <>
                    <h1 className="card-title text-2xl">
                      Apply for a trade account
                    </h1>
                    <p className="text-sm text-base-content/60 mb-2">
                      We invoice against GST and we ship against FSSAI. Both are
                      required.
                    </p>

                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="form-control sm:col-span-2">
                          <label className="label">
                            <span className="label-text">
                              Registered business name *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={form.businessName}
                            onChange={set("businessName")}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Business type</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={form.businessType}
                            onChange={set("businessType")}
                          >
                            <option value="restaurant">Restaurant</option>
                            <option value="hotel">Hotel</option>
                            <option value="cloud-kitchen">Cloud kitchen</option>
                            <option value="retailer">Retailer / deli</option>
                            <option value="caterer">Caterer</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Contact name *</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={form.contactName}
                            onChange={set("contactName")}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Phone *</span>
                          </label>
                          <input
                            type="tel"
                            className="input input-bordered"
                            value={form.phone}
                            onChange={set("phone")}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Email *</span>
                          </label>
                          <input
                            type="email"
                            className="input input-bordered"
                            value={form.email}
                            onChange={set("email")}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">GSTIN *</span>
                          </label>
                          <input
                            type="text"
                            placeholder="29AAAAA0000A1Z5"
                            className="input input-bordered uppercase"
                            value={form.gstin}
                            onChange={set("gstin")}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              FSSAI licence number *
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="10024xxxxxxxxx"
                            className="input input-bordered"
                            value={form.fssai}
                            onChange={set("fssai")}
                          />
                        </div>

                        <div className="form-control sm:col-span-2">
                          <label className="label">
                            <span className="label-text">
                              Delivery address *
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered h-24"
                            value={form.deliveryAddress}
                            onChange={set("deliveryAddress")}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">City</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={form.city}
                            onChange={set("city")}
                          />
                        </div>
                      </div>

                      <div className="card-actions justify-end mt-6">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Submitting..." : "Submit application"}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {account && account.status === "pending" && (
                  <div className="text-center py-10">
                    <ClockIcon className="size-10 text-primary mx-auto" />
                    <h2 className="text-2xl font-bold mt-4">
                      Application under review
                    </h2>
                    <p className="text-base-content/70 mt-2">
                      We're verifying the GSTIN and FSSAI licence for{" "}
                      <strong>{account.businessName}</strong>. Your account
                      contact will call within one working day.
                    </p>
                    <button
                      className="btn btn-ghost btn-sm mt-6"
                      onClick={() => {
                        clearAccount();
                        setAccount(null);
                      }}
                    >
                      Start a different application
                    </button>
                  </div>
                )}

                {account && account.status === "approved" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2Icon className="size-6 text-success" />
                      <h1 className="card-title text-2xl">
                        {account.businessName}
                      </h1>
                    </div>
                    <p className="text-sm text-base-content/60">
                      Trade account active. Wholesale pricing is visible while
                      the Trade door is selected.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 mt-4 text-sm">
                      <div>
                        <p className="text-base-content/50">GSTIN</p>
                        <p className="font-mono">{account.gstin}</p>
                        <p className="text-base-content/50 mt-3">FSSAI</p>
                        <p className="font-mono">{account.fssai}</p>
                        <p className="text-base-content/50 mt-3">Credit terms</p>
                        <p>{account.creditTerms}</p>
                      </div>
                      <div>
                        <p className="text-base-content/50">
                          Your account contact
                        </p>
                        <p className="font-medium">
                          {account.accountManager?.name}
                        </p>
                        <p>{account.accountManager?.phone}</p>
                        <p>{account.accountManager?.email}</p>
                        <p className="text-base-content/50 mt-3">
                          Delivery windows
                        </p>
                        {WHOLESALE.windows.map((w) => (
                          <p key={w} className="text-base-content/70">
                            {w}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="alert mt-4 text-sm">
                      <FileTextIcon className="size-4" />
                      <span>
                        Spec sheets are on each product page while you're signed
                        in to the trade door.
                      </span>
                    </div>

                    <div className="card-actions justify-between mt-4">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          clearAccount();
                          setAccount(null);
                          toast.success("Signed out of the trade account");
                        }}
                      >
                        Sign out of trade
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setTrack("wholesale");
                          navigate("/catalogue");
                        }}
                        disabled={!hasWholesaleAccess()}
                      >
                        Open the rate card
                      </button>
                    </div>
                  </>
                )}

                {account && account.status === "rejected" && (
                  <div className="text-center py-10">
                    <h2 className="text-2xl font-bold">Application declined</h2>
                    <p className="text-base-content/70 mt-2">
                      We couldn't verify the details supplied. Call the trade
                      desk on +91 98860 41207 and we'll sort it out.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WholesalePage;
