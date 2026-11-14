export interface DinnerMenuItem {
  id: number;
  name: string;
}

export interface ScheduleEvent {
  time: string;
  title: string;
  subtitle?: string;
  isMagicHour?: boolean;
  menu?: DinnerMenuItem[];
  items?: string[];
}

export const event = {
  nameEn: "FULL MOON, SEA & SEAFOOD NIGHT",
  nameBn: "জোছনা মাখা সমুদ্র, মুগ্ধতার এক রাত",
  timeRange: "11 pm to 5 am",
  timeRangeBn: "রাত ১১:০০ টা থেকে ভোর ৫:০০ টা",
  
  date: "24 November 2026",
  dateBn: "২৪ নভেম্বর ২০২৬",
  
  venue: "Coastal Heaven, Cox's Bazar",
  venueBn: "কোস্টাল হেভেন, কক্সবাজার",
  
  // Pricing from official posters
  regularPrice: "9,800 TK",
  discountPercent: "40%",
  discountedPrice: "5,880 TK",
  priceNumber: 5880,
  priceUnit: "per person",
  priceUnitBn: "জনপ্রতি",
  
  // Payment Details (bKash & Bank Transfer)
  bkashNumber: "01817152000",
  bkashNumberDisplay: "01817 152000",
  bkashType: "Personal (Send Money)",

  bankDetails: {
    accountName: "Remark International",
    accountNumber: "1502685788001",
    bankName: "The City Bank Limited",
    branch: "Dhanmondi",
    routingNumber: "225261187",
    swiftCode: "CIBLBDDH",
  },
  
  organizer: "Remark",
  organizerDisplay: "Presented by: Remark",
  
  phone1: "01332 220011",
  phone2: "01734 737894",
  whatsappNumber: "8801332220011",
  
  disclaimer: "Note: Visibility of the full moon and moonlit sea depends on weather conditions.",
  disclaimerBn: "বিশেষ দ্রষ্টব্য: আবহাওয়া ও মেঘের পরিস্থিতির ওপর পূর্ণিমা ও চাঁদের আলো দৃশ্যমানতা নির্ভরশীল।",

  // 10-item Moonlight Dinner Menu
  dinnerMenu: [
    { id: 1, name: "Plain Rice" },
    { id: 2, name: "Sundori Pua Fish" },
    { id: 3, name: "Surma Fish" },
    { id: 4, name: "Loitta Fish Fry" },
    { id: 5, name: "Shutki Bhorta" },
    { id: 6, name: "Pomfret Fish Fry" },
    { id: 7, name: "Shrimp Do Pyaza" },
    { id: 8, name: "Firni" },
    { id: 9, name: "Water" },
    { id: 10, name: "Roasted Coriander Seeds" },
  ],

  // Event Highlights from Demo 2
  highlights: [
    {
      id: "dinner",
      titleEn: "Dinner Under the Moonlight",
      titleBn: "চাঁদের আলোয় স্পেশাল সী-ফুড ডিনার",
      desc: "১০ পদের রাজকীয় ডিনার: রূপচাঁদা ফ্রাই, সুরমা মাছ, সুন্দরী পোয়া, লইট্যা ফ্রাই, চিংড়ি দো-পেঁয়াজা, শুঁটকি ভর্তা ও ফিরনি।",
      badge: "11:15 PM",
      image: "/images/food-bbq.jpg",
    },
    {
      id: "crab",
      titleEn: "Crab Fry at Midnight",
      titleBn: "মধ্যরাতে ক্রিস্পি ক্র্যাব ফ্রাই",
      desc: "মধ্যরাতে সমুদ্রের ঢেউয়ের গর্জন শুনতে শুনতে মুচমুচে তাজা ক্র্যাব ফ্রাই, গরম চা ও রিফ্রেশিং ওয়াটার।",
      badge: "12:30 AM",
      image: "/images/beach-seating.jpg",
    },
    {
      id: "squid",
      titleEn: "BBQ Squid & Late-Night Snacks",
      titleBn: "লাইভ বারবিকিউ স্কুইড ও মুড়ি মাখা",
      desc: "শেষ রাতে সরাসরি কয়লার আগুনে তৈরি স্মোকি BBQ স্কুইড, বিশেষ মসলায় মুড়ি মাখা ও আড্ডা।",
      badge: "2:30 AM",
      image: "/images/tea-snacks.jpg",
    },
    {
      id: "khichuri",
      titleEn: "Seafood Khichuri at Dawn",
      titleBn: "ভোরের আলোয় গরম সী-ফুড খিচুড়ি",
      desc: "সৈকতে ভোরের প্রথম আলো ও সূর্যোদয়ের সাথে ধোঁয়া ওঠা তাজা সী-ফুড খিচুড়ি, ফ্রেশ জুস ও চা।",
      badge: "4:30 AM",
      image: "/images/hero-moon-beach.jpg",
    },
    {
      id: "magic-hour",
      titleEn: "The Magic Hour: সমুদ্র ও চাঁদ কাছাকাছি",
      titleBn: "ম্যাজিক আওয়ার: সমুদ্র ও চাঁদ কাছাকাছি",
      desc: "ভোর ৫:০০ মিনিটে পূর্ণিমার চাঁদ যখন সাগরের একেবারে কাছাকাছি নেমে আসে—এক মায়াবী অপার্থিব মুহূর্ত।",
      badge: "5:00 AM",
      image: "/images/poster-highlights.jpg",
    },
  ],

  // Complete Time-wise Event Schedule from Demo 1
  schedule: [
    {
      time: "11:00 PM",
      title: "Welcome Reception",
      subtitle: "Welcome Drinks & Flowers",
      items: ["Welcome Drinks", "Flowers Reception"],
    },
    {
      time: "11:15 PM",
      title: "Dinner Under the Moonlight",
      subtitle: "10-Item Grand Seafood Dinner Menu",
      menu: [
        { id: 1, name: "Plain Rice" },
        { id: 2, name: "Sundori Pua Fish" },
        { id: 3, name: "Surma Fish" },
        { id: 4, name: "Loitta Fish Fry" },
        { id: 5, name: "Shutki Bhorta" },
        { id: 6, name: "Pomfret Fish Fry" },
        { id: 7, name: "Shrimp Do Pyaza" },
        { id: 8, name: "Firni" },
        { id: 9, name: "Water" },
        { id: 10, name: "Roasted Coriander Seeds" },
      ],
    },
    {
      time: "12:30 AM",
      title: "Midnight Delights",
      subtitle: "Crab Fry • Tea • Water",
      items: ["Crab Fry", "Tea", "Water"],
    },
    {
      time: "2:30 AM",
      title: "Late-Night Snacks",
      subtitle: "BBQ Squid • Muri Makha • Water",
      items: ["BBQ Squid", "Muri Makha", "Water"],
    },
    {
      time: "4:30 AM",
      title: "Early Morning Treats",
      subtitle: "Seafood Khichuri • Fresh Juice • Tea • Water",
      items: ["Seafood Khichuri", "Fresh Juice", "Tea", "Water"],
    },
    {
      time: "5:00 AM",
      title: "The Magic Hour: সমুদ্র ও চাঁদ কাছাকাছি",
      subtitle: "পূর্ণিমার চাঁদ ও সমুদ্রের মায়াবী মিলনক্ষণ",
      isMagicHour: true,
      items: ["Moonlit Horizon", "Ocean Breeze", "Quiet Moments"],
    },
    {
      time: "5:15 AM",
      title: "Closing",
      subtitle: "বিদায়ী অভিবাদন ও শুভ সকাল",
      items: ["Departure"],
    },
  ],

  whatsappMessages: {
    general: "হ্যালো, আমি Full Moon, Sea & Seafood Night (24 Nov 2026, Coastal Heaven) ইভেন্টের ৫,৮৮০ টাকা অফার সম্পর্কে জানতে চাই।",
    afterBooking: "হ্যালো, আমি Full Moon, Sea & Seafood Night ইভেন্টের বুকিং সম্পন্ন করেছি।\n\nনাম: {name}\nসদস্য: {persons} জন\nমোট পরিশোধিত: {amount} টাকা\nপেমেন্ট মেথড: {method}\nTrxID/Ref: {trxId}\n\nঅনুগ্রহ করে আসনটি নিশ্চিত করুন।",
    fallback: "ফর্ম সাবমিট করতে সমস্যা হচ্ছে, আমি Full Moon, Sea & Seafood Night ইভেন্টের জন্য বুক করতে চাই।",
  },

  cta: {
    bookNowEn: "Book Now >",
    bookNowBn: "বুক করুন",
    formSubmitBn: "বুকিং নিশ্চিত করতে পাঠান",
  },
};
