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
  CreditCard,
  Copy,
  Check,
} from "lucide-react";

interface FormState {
  name: string;
  phone: string;
  persons: number;
  transactionId: string;
  note: string;
  company: string; // Honeypot
}

export default function BookingForm() {
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
    trxId: string;
  }>({ name: "", persons: 1, amount: 5700, trxId: "" });
  const [copied, setCopied] = useState(false);
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

  const handleCopyNumber = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(event.paymentNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      newErrors.transactionId = "মোবাইল ব্যাংকিং ট্রানজেকশন আইডি (TrxID) দিন";
    } else if (formData.transactionId.trim().length < 4) {
      newErrors.transactionId = "সঠিক TrxID দিন (কমপক্ষে ৪ অক্ষর)";
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
          trxId: formData.transactionId.trim(),
        });
        setStatus("success");
        trackLead({
          name: formData.name.trim(),
          persons: formData.persons,
          totalAmount: totalAmount,
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
              আপনার বুকিং অনুরোধ ও ট্রানজেকশন সফলভাবে জমা হয়েছে। আমাদের টিম TrxID ভেরিফাই করে দ্রুত WhatsApp বা ফোনে আসন নিশ্চিত করবে।
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
                <span className="font-sans">ট্রানজেকশন আইডি:</span>
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
                  submittedData.trxId
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

            {/* Generic Person Stepper (Only Persons - No Child) */}
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

            {/* Mobile Banking Payment Instructions & Transaction ID */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#120a2e]/90 via-night-950 to-night-900 border border-indigo-500/35 space-y-3">
              <div className="flex items-start gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-moon-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    মোবাইল ব্যাংকিং পেমেন্ট (bKash / Nagad / Rocket)
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5 leading-relaxed">
                    নিচের নম্বরে <strong>Send Money</strong> করে মোট <strong>{totalAmount.toLocaleString("en-BD")} টাকা</strong> পরিশোধ করুন:
                  </p>
                </div>
              </div>

              {/* Number Copy Pill */}
              <div className="flex items-center justify-between bg-night-900/90 border border-night-700 rounded-xl px-3 py-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-moon-gold font-bold text-[11px] sm:text-xs">বিকাশ/নগদ/রকেট (Personal):</span>
                  <span className="font-mono font-extrabold text-white text-sm tracking-wider">
                    {event.paymentNumberDisplay}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-2.5 py-1 rounded-lg bg-night-800 hover:bg-night-700 text-moon-gold border border-moon-gold/30 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "কপি হয়েছে" : "কপি"}</span>
                </button>
              </div>

              {/* Transaction ID input */}
              <div>
                <label htmlFor={trxInputId} className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>ট্রানজেকশন আইডি (TrxID)</span>
                    <span className="text-moon-gold">*</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-normal text-gray-400">যেমন: 8N7A6B5C4D</span>
                </label>
                <input
                  id={trxInputId}
                  type="text"
                  required
                  placeholder="মোবাইল ব্যাংকিং TrxID লিখুন"
                  value={formData.transactionId}
                  onChange={(e) => {
                    setFormData({ ...formData, transactionId: e.target.value.toUpperCase() });
                    if (errors.transactionId) setErrors({ ...errors, transactionId: undefined });
                  }}
                  className={`w-full min-h-[46px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-night-950 border ${
                    errors.transactionId ? "border-red-500 ring-1 ring-red-500" : "border-night-700 focus:border-moon-gold focus:ring-1 focus:ring-moon-gold"
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
