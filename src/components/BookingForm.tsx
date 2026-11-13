"use client";

import { useState, useEffect, useId, FormEvent } from "react";
import { event } from "@/content/event";
import { normalizeBdPhone, isValidBdPhone } from "@/lib/validate";
import { getBookingSuccessWhatsAppLink, getFailureFallbackWhatsAppLink } from "@/lib/whatsapp";
import { trackLead } from "@/lib/track";
import Reveal from "./Reveal";
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
  Lock,
  Tag,
  Users,
  Copy,
  Check,
  Landmark,
} from "lucide-react";

// Official bKash Origami Logo Component
function BkashLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="bKash Logo"
    >
      <path d="M48.2 13.5L8.5 45.4L37.8 55.6L48.2 13.5Z" fill="#E2136E" />
      <path d="M48.2 13.5L91.5 35.8L61.2 55.6L48.2 13.5Z" fill="#C4165E" />
      <path d="M37.8 55.6L49.5 86.5L61.2 55.6H37.8Z" fill="#D81766" />
      <path d="M8.5 45.4L28.5 75.2L37.8 55.6L8.5 45.4Z" fill="#F01876" />
      <path d="M91.5 35.8L71.5 75.2L61.2 55.6L91.5 35.8Z" fill="#B01052" />
    </svg>
  );
}

interface FormState {
  name: string;
  phone: string;
  persons: number;
  transactionId: string;
  note: string;
  company: string; // Honeypot
}

export default function BookingForm() {
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "bank">("bkash");
  const [formData, setFormData] = useState<FormState>({
    name: "",
    phone: "",
    persons: 1,
    transactionId: "",
    note: "",
    company: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    persons: number;
    amount: number;
    method: "bkash" | "bank";
    trxId: string;
  }>({ name: "", persons: 1, amount: 5700, method: "bkash", trxId: "" });

  const [copiedBkash, setCopiedBkash] = useState(false);
  const [copiedAccNum, setCopiedAccNum] = useState(false);
  const [copiedRouting, setCopiedRouting] = useState(false);

  const [mountTime, setMountTime] = useState<number>(0);
  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    referrer: "",
    page_url: "",
  });

  const nameInputId = useId();
  const phoneInputId = useId();
  const trxInputId = useId();
  const noteInputId = useId();

  // Price calculations based on discounted price 5,700 TK
  const unitPrice = event.priceNumber || 5700;
  const totalAmount = formData.persons * unitPrice;

  useEffect(() => {
    setMountTime(Date.now());
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setUtmParams({
        utm_source: searchParams.get("utm_source") || "",
        utm_medium: searchParams.get("utm_medium") || "",
        utm_campaign: searchParams.get("utm_campaign") || "",
        utm_content: searchParams.get("utm_content") || "",
        referrer: document.referrer || "",
        page_url: window.location.href || "",
      });
    }
  }, []);

  const handleCopy = (text: string, type: "bkash" | "acc" | "routing") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "bkash") {
        setCopiedBkash(true);
        setTimeout(() => setCopiedBkash(false), 2000);
      } else if (type === "acc") {
        setCopiedAccNum(true);
        setTimeout(() => setCopiedAccNum(false), 2000);
      } else if (type === "routing") {
        setCopiedRouting(true);
        setTimeout(() => setCopiedRouting(false), 2000);
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "অনুগ্রহ করে আপনার নাম লিখুন";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "নাম কমপক্ষে ২ অক্ষরের হতে হবে";
    } else if (formData.name.trim().length > 60) {
      newErrors.name = "নাম সর্বোচ্চ ৬০ অক্ষরের মধ্যে হতে হবে";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "সচল মোবাইল নম্বর দিন";
    } else if (!isValidBdPhone(formData.phone)) {
      newErrors.phone = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX বা 018XXXXXXXX)";
    }

    if (formData.persons < 1) {
      newErrors.persons = "কমপক্ষে ১ জন সদস্য নির্বাচন করুন";
    } else if (formData.persons > 20) {
      newErrors.persons = "একবারে সর্বোচ্চ ২০ জনের বুকিং সম্ভব";
    }

    if (!formData.transactionId.trim()) {
      newErrors.transactionId =
        paymentMethod === "bkash"
          ? "বিকাশ ট্রানজেকশন আইডি (TrxID) দিন"
          : "ব্যাংক ট্রান্সফার রেফারেন্স / ট্রানজেকশন নম্বর দিন";
    } else if (formData.transactionId.trim().length < 3) {
      newErrors.transactionId = "সঠিক ট্রানজেকশন / রেফারেন্স নম্বর দিন";
    }

    if (formData.note && formData.note.length > 300) {
      newErrors.note = "নোট সর্বোচ্চ ৩০০ অক্ষরের মধ্যে লিখুন";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus("submitting");

    const payload = {
      name: formData.name.trim(),
      phone: normalizeBdPhone(formData.phone),
      persons: Number(formData.persons),
      paymentMethod: paymentMethod,
      transactionId: formData.transactionId.trim(),
      note: formData.note.trim(),
      company: formData.company,
      ts: mountTime,
      ...utmParams,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSubmittedData({
          name: formData.name.trim(),
          persons: formData.persons,
          amount: totalAmount,
          method: paymentMethod,
          trxId: formData.transactionId.trim(),
        });
        setStatus("success");
        trackLead({
          name: formData.name.trim(),
          persons: formData.persons,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod,
          transactionId: formData.transactionId.trim(),
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setStatus("error");
    }
  };

  const handleStepper = (delta: number) => {
    setFormData((prev) => {
      const nextVal = Math.min(20, Math.max(1, prev.persons + delta));
      return { ...prev, persons: nextVal };
    });
  };

  return (
    <section id="book" className="py-8 sm:py-16 md:py-20 px-4 max-w-2xl mx-auto scroll-mt-6 relative">
      <Reveal className="text-center mb-5 sm:mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-moon-gold font-bold px-3.5 py-1 rounded-full bg-moon-gold/10 border border-moon-gold/25 shadow-sm">
          <Tag className="w-3.5 h-3.5 text-moon-gold" />
          <span>RESERVATION &amp; PAYMENT</span>
        </span>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 sm:mt-4 tracking-tight">
          আপনার আসনটি সংরক্ষণ করুন
        </h2>
        <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-300">
          <span className="flex items-center gap-1 text-moon-gold font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {event.timeRange}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.venue}
          </span>
        </div>
      </Reveal>

      {/* Main Glassmorphic Form Card */}
      <div className="glass-panel rounded-3xl p-4 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
        {/* Pricing & Direct Helpline Banner */}
        <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-night-700/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[11px] sm:text-xs uppercase">
              {event.discountPercent} OFF
            </span>
            <span className="text-gray-300">
              মূল্য: <del className="text-gray-400">{event.regularPrice}</del>{" "}
              <strong className="text-moon-gold font-bold text-sm sm:text-base">{event.discountedPrice}</strong> {event.priceUnitBn}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono font-bold text-white text-xs">
            <Phone className="w-3.5 h-3.5 text-moon-gold shrink-0" />
            <a href={`tel:${event.phone1.replace(/\s/g, "")}`} className="hover:text-moon-gold transition-colors">
              {event.phone1}
            </a>
            <span className="text-gray-500">|</span>
            <a href={`tel:${event.phone2.replace(/\s/g, "")}`} className="hover:text-moon-gold transition-colors">
              {event.phone2}
            </a>
          </div>
        </div>

        {status === "success" ? (
          /* Thank You State */
          <div className="text-center py-6 sm:py-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white">
              ধন্যবাদ, {submittedData.name}!
            </h3>
            <p className="mt-2 sm:mt-3 text-xs sm:text-base text-gray-200 leading-relaxed max-w-md mx-auto">
              আপনার বুকিং অনুরোধ ও পেমেন্ট তথ্য সফলভাবে জমা হয়েছে। আমাদের টিম ভেরিফাই করে দ্রুত WhatsApp বা ফোনে আসন নিশ্চিত করবে।
            </p>

            {/* Booking Summary Box */}
            <div className="mt-4 p-4 rounded-2xl bg-night-950/80 border border-night-700/80 text-left text-xs sm:text-sm max-w-md mx-auto space-y-1.5 font-mono">
              <div className="flex justify-between text-gray-300">
                <span className="font-sans">বুকিং সদস্য:</span>
                <span className="text-white font-bold">{submittedData.persons} জন</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="font-sans">মোট পরিশোধিত:</span>
                <span className="text-moon-gold font-bold">{submittedData.amount.toLocaleString("en-BD")} টাকা</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="font-sans">পেমেন্ট মাধ্যম:</span>
                <span className="text-white font-bold">
                  {submittedData.method === "bank" ? "City Bank Transfer" : "bKash (বিকাশ)"}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="font-sans">TrxID / রেফারেন্স:</span>
                <span className="text-emerald-400 font-bold">{submittedData.trxId}</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-night-800 flex flex-col items-center">
              <p className="text-xs text-gray-300 mb-3">
                তাৎক্ষণিক কনফার্মেশনের জন্য সরাসরি WhatsApp-এ বার্তা দিন:
              </p>
              <a
                href={getBookingSuccessWhatsAppLink(
                  submittedData.name,
                  submittedData.persons,
                  submittedData.amount,
                  submittedData.trxId,
                  submittedData.method === "bank" ? "City Bank Transfer" : "bKash"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[48px] sm:min-h-[52px] px-6 sm:px-8 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(37,211,102,0.4)] transition-all transform hover:scale-105 active:scale-95 gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>WhatsApp-এ কনফার্ম করুন</span>
              </a>
            </div>
          </div>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            {/* Honeypot field (hidden from real users) */}
            <div aria-hidden="true" style={{ display: "none" }}>
              <label htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Error banner on submission failure */}
            {status === "error" && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">সংযোগ সমস্যার কারণে তথ্য পাঠানো যায়নি। WhatsApp-এ সরাসরি মেসেজ দিন:</span>
                </div>
                <a
                  href={getFailureFallbackWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-xl bg-moon-gold text-night-950 font-bold text-xs shrink-0 hover:bg-moon-gold-hover transition-colors shadow-sm"
                >
                  WhatsApp-এ বুক করুন
                </a>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor={nameInputId} className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5">
                আপনার নাম <span className="text-moon-gold">*</span>
              </label>
              <input
                id={nameInputId}
                type="text"
                required
                maxLength={60}
                placeholder="যেমন: তানজির আহমেদ"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={`w-full min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-night-950/90 border ${
                  errors.name ? "border-red-500 ring-1 ring-red-500" : "border-night-700/80 focus:border-moon-gold focus:ring-1 focus:ring-moon-gold"
                } text-white placeholder-gray-400 focus:outline-none transition-all text-sm sm:text-base`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Mobile / WhatsApp Number */}
            <div>
              <label htmlFor={phoneInputId} className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1.5 flex items-center justify-between">
                <span>মোবাইল নম্বর (WhatsApp সচল) <span className="text-moon-gold">*</span></span>
                <span className="text-[11px] font-normal text-gray-400">018... বা 017...</span>
              </label>
              <input
                id={phoneInputId}
                type="tel"
                required
                placeholder="018XXXXXXXX বা 017XXXXXXXX"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={`w-full min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-night-950/90 border ${
                  errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-night-700/80 focus:border-moon-gold focus:ring-1 focus:ring-moon-gold"
                } text-white placeholder-gray-400 focus:outline-none transition-all text-sm sm:text-base`}
              />
              {errors.phone ? (
                <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
              ) : (
                <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-moon-gold" />
                  <span>এই নম্বরেই আমরা আসন নিশ্চিতকরণের তথ্য পাঠাব</span>
                </p>
              )}
            </div>

            {/* Generic Person Stepper (Only Persons) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-night-950/80 border border-night-700/80 hover:border-moon-gold/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-moon-gold" />
                  <span>সদস্য সংখ্যা (Person)</span>
                  <span className="text-moon-gold">*</span>
                </span>
                <span className="text-[11px] text-moon-gold-light bg-moon-gold/10 px-2 py-0.5 rounded-full border border-moon-gold/20 font-medium">
                  জনপ্রতি ৫,৭০০ টাকা
                </span>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleStepper(-1)}
                  disabled={formData.persons <= 1}
                  aria-label="সদস্য কমান"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-night-800 hover:bg-night-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed border border-night-600 text-white font-bold flex items-center justify-center transition-all text-lg"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-extrabold text-moon-gold px-3">
                    {formData.persons} জন
                  </span>
                  <span className="text-[10px] text-gray-400">বুকিং আসন</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStepper(1)}
                  disabled={formData.persons >= 20}
                  aria-label="সদস্য বাড়ান"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-night-800 hover:bg-night-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed border border-night-600 text-white font-bold flex items-center justify-center transition-all text-lg"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              {errors.persons && <p className="mt-1 text-xs text-red-400">{errors.persons}</p>}
            </div>

            {/* Dynamic Calculated Amount Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-moon-gold/15 via-night-900 to-night-950 border border-moon-gold/30 shadow-md">
              <div className="flex items-center justify-between border-b border-night-700/70 pb-2 mb-2 text-xs sm:text-sm">
                <span className="text-gray-300">হিসাব:</span>
                <span className="text-gray-200 font-mono">
                  {formData.persons} জন × ৫,৭০০ টাকা
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-moon-gold" />
                  মোট প্রদেয় অর্থ (৪০% ছাড়ে):
                </span>
                <span className="text-lg sm:text-2xl font-extrabold text-moon-gold font-mono drop-shadow-[0_0_12px_rgba(245,200,76,0.5)]">
                  {totalAmount.toLocaleString("en-BD")} টাকা
                </span>
              </div>
            </div>

            {/* Payment Method Selector & Details */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#120a2e]/95 via-night-950 to-night-900 border border-indigo-500/35 space-y-3.5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-2">
                  পেমেন্ট মাধ্যম বেছে নিন:
                </label>
                {/* 2-Option Tabs: bKash vs Bank Transfer */}
                <div className="grid grid-cols-2 gap-2">
                  {/* bKash Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("bkash");
                      if (errors.transactionId) setErrors({ ...errors, transactionId: undefined });
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all duration-200 ${
                      paymentMethod === "bkash"
                        ? "bg-[#E2136E]/20 border-[#E2136E] text-white shadow-[0_0_15px_rgba(226,19,110,0.35)]"
                        : "bg-night-900/80 border-night-700 text-gray-300 hover:border-night-600"
                    }`}
                  >
                    <BkashLogo className="w-5 h-5 shrink-0" />
                    <span>bKash (বিকাশ)</span>
                  </button>

                  {/* Bank Transfer Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("bank");
                      if (errors.transactionId) setErrors({ ...errors, transactionId: undefined });
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all duration-200 ${
                      paymentMethod === "bank"
                        ? "bg-moon-gold/15 border-moon-gold text-white shadow-[0_0_15px_rgba(245,200,76,0.3)]"
                        : "bg-night-900/80 border-night-700 text-gray-300 hover:border-night-600"
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-moon-gold shrink-0" />
                    <span>ব্যাংক ট্রান্সফার</span>
                  </button>
                </div>
              </div>

              {/* Method 1: bKash Details */}
              {paymentMethod === "bkash" ? (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between bg-night-900/90 border border-[#E2136E]/40 rounded-xl px-3.5 py-3 text-xs shadow-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <BkashLogo className="w-5 h-5 shrink-0" />
                        <span className="font-bold text-white text-xs sm:text-sm">
                          bKash Personal (Send Money)
                        </span>
                      </div>
                      <span className="font-mono font-extrabold text-moon-gold text-base sm:text-lg tracking-wider mt-1">
                        {event.bkashNumberDisplay}
                      </span>
                      <span className="text-[11px] text-gray-300 mt-0.5">
                        Send Money পরিমাণ: <strong>{totalAmount.toLocaleString("en-BD")} টাকা</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(event.bkashNumber, "bkash")}
                      className="px-3 py-1.5 rounded-lg bg-[#E2136E] hover:bg-[#c4165e] text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shrink-0 shadow-sm"
                    >
                      {copiedBkash ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBkash ? "কপি হয়েছে" : "নম্বর কপি"}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    💡 বিকাশ অ্যাপ অথবা <strong>*247#</strong> ডায়াল করে <strong>Send Money</strong> সম্পন্ন করার পর নিচে প্রাপ্ত TrxID দিন।
                  </p>
                </div>
              ) : (
                /* Method 2: The City Bank Details */
                <div className="space-y-2.5 pt-1">
                  <div className="bg-night-900/90 border border-moon-gold/30 rounded-xl p-3 sm:p-4 text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center pb-1.5 border-b border-night-800">
                      <span className="text-gray-400 font-sans">ব্যাংকের নাম:</span>
                      <strong className="text-white font-bold font-sans text-xs sm:text-sm flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5 text-moon-gold" />
                        {event.bankDetails.bankName}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center pb-1.5 border-b border-night-800">
                      <span className="text-gray-400 font-sans">অ্যাকাউন্টের নাম:</span>
                      <span className="text-white font-bold font-sans text-xs sm:text-sm">
                        {event.bankDetails.accountName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-1.5 border-b border-night-800">
                      <span className="text-gray-400 font-sans">অ্যাকাউন্ট নম্বর:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-moon-gold font-extrabold text-sm sm:text-base tracking-wider">
                          {event.bankDetails.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(event.bankDetails.accountNumber, "acc")}
                          className="px-2 py-0.5 rounded bg-night-800 hover:bg-night-700 text-moon-gold border border-moon-gold/30 text-[10px] font-sans flex items-center gap-1 transition-all active:scale-95"
                        >
                          {copiedAccNum ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAccNum ? "কপি হয়েছে" : "কপি"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pb-1.5 border-b border-night-800">
                      <span className="text-gray-400 font-sans">শাখা (Branch):</span>
                      <span className="text-gray-200 font-sans">{event.bankDetails.branch}</span>
                    </div>

                    <div className="flex justify-between items-center pb-1.5 border-b border-night-800">
                      <span className="text-gray-400 font-sans">রাউটিং নম্বর:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-200">{event.bankDetails.routingNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(event.bankDetails.routingNumber, "routing")}
                          className="px-2 py-0.5 rounded bg-night-800 hover:bg-night-700 text-gray-300 border border-night-600 text-[10px] font-sans flex items-center gap-1 transition-all active:scale-95"
                        >
                          {copiedRouting ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedRouting ? "কপি" : "কপি"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-sans">সুইফট কোড:</span>
                      <span className="text-gray-200">{event.bankDetails.swiftCode}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    💡 Citytouch, NPSB, BEFTN অথবা যেকোনো ব্যাংক থেকে ফান্ড ট্রান্সফার করে নিচের ঘরে ট্রানজেকশন / রেফারেন্স আইডি দিন।
                  </p>
                </div>
              )}

              {/* Transaction ID / Reference Input Field */}
              <div className="pt-1 border-t border-night-700/60">
                <label
                  htmlFor={trxInputId}
                  className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1">
                    <span>
                      {paymentMethod === "bkash"
                        ? "বিকাশ ট্রানজেকশন আইডি (bKash TrxID)"
                        : "ব্যাংক ট্রান্সফার রেফারেন্স / ট্রানজেকশন আইডি"}
                    </span>
                    <span className="text-moon-gold">*</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-normal text-gray-400">
                    {paymentMethod === "bkash" ? "যেমন: 8N7A6B5C4D" : "যেমন: FT2611870023"}
                  </span>
                </label>
                <input
                  id={trxInputId}
                  type="text"
                  required
                  placeholder={
                    paymentMethod === "bkash"
                      ? "বিকাশ TrxID লিখুন"
                      : "ব্যাংক ট্রান্সফার রেফারেন্স নম্বর লিখুন"
                  }
                  value={formData.transactionId}
                  onChange={(e) => {
                    setFormData({ ...formData, transactionId: e.target.value.toUpperCase() });
                    if (errors.transactionId) setErrors({ ...errors, transactionId: undefined });
                  }}
                  className={`w-full min-h-[46px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-night-950 border ${
                    errors.transactionId
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-night-700 focus:border-moon-gold focus:ring-1 focus:ring-moon-gold"
                  } text-white font-mono placeholder-gray-400 focus:outline-none transition-all text-sm uppercase tracking-wider`}
                />
                {errors.transactionId && (
                  <p className="mt-1 text-xs text-red-400">{errors.transactionId}</p>
                )}
              </div>
            </div>

            {/* Note */}
            <div>
              <label htmlFor={noteInputId} className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1">
                বিশেষ কোনো নোট বা পছন্দ (ঐচ্ছিক)
              </label>
              <textarea
                id={noteInputId}
                rows={2}
                maxLength={300}
                placeholder="যেমন: খাবারের বিশেষ অ্যালার্জি, টেবিল পছন্দ ইত্যাদি"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-night-950/90 border border-night-700/80 focus:border-moon-gold focus:ring-1 focus:ring-moon-gold text-white placeholder-gray-400 focus:outline-none transition-all text-xs sm:text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full min-h-[50px] sm:min-h-[56px] rounded-2xl btn-gold text-sm sm:text-base font-bold shadow-xl transition-all flex items-center justify-center cursor-pointer gap-2"
            >
              {status === "submitting" ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-night-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>অনুরোধ পাঠানো হচ্ছে...</span>
                </span>
              ) : (
                <>
                  <span>{totalAmount.toLocaleString("en-BD")} টাকা পরিশোধ ও বুকিং কনফার্ম করুন</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-1 text-center space-y-1">
              <p className="text-[11px] sm:text-xs text-gray-300 font-medium flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-moon-gold" />
                <span>বুকিং প্রেরণের পর TrxID যাচাই করে আমাদের টিম আসন কনফার্ম করবে।</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
