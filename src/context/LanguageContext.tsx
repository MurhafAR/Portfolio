"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
  isRtl: boolean;
  dir: "ltr" | "rtl";
}

export const translations = {
  en: {
    // Navigation / Header
    navSkills: "Skills",
    navProjects: "Projects",
    navActivity: "Activity",
    navContact: "Contact",
    navAdmin: "Admin",
    switchLanguage: "العربية",

    // Hero Section
    statusAvailable: "Available for Full-Stack roles & freelance projects",
    statusUnavailable: "Currently busy with ongoing projects",
    greeting: "Hi, I'm",
    defaultHeadline: "Full-Stack Web Developer | Next.js, TypeScript & Node.js",
    defaultBio:
      "I build modern, high-performance web applications with a focus on clean architecture and exceptional user experiences. Passionate about real-time systems, TypeScript, and the React ecosystem.",
    github: "GitHub",
    telegram: "Telegram",
    instagram: "Instagram",
    resume: "Resume",
    fullStackBadge: "Full-Stack",

    // Skills Section
    skillsTitle: "Skills & Technologies",
    skillsSubtitle:
      "Technologies I work with to build modern, scalable applications.",
    categoryFrontend: "Frontend",
    categoryBackend: "Backend",
    categoryDatabase: "Database & ORM",
    categoryDevops: "DevOps & Tools",

    // Projects Section
    projectsTitle: "Featured Projects",
    projectsSubtitle:
      "Real-world applications I've designed and built end-to-end.",
    noProjectsTitle: "No projects published yet",
    noProjectsDesc:
      "Projects added via the admin panel will appear here automatically.",
    btnCode: "Code",
    btnLive: "Live",
    btnArchitecture: "Architecture",
    modalArchTitle: "Architecture Notes",

    // Live GitHub Activity
    liveActivityBadge: "Live Activity",
    recentOpenSourceTitle: "Recent Open-Source Work",
    viewAllGithub: "View all on GitHub",
    repoFallbackDesc: "Open-source repository.",

    // Contact Section
    directCommBadge: "Direct Communication",
    letsTalkTitle: "Let's talk.",
    contactDesc:
      "Have an opening, a freelance project, or a technical inquiry? Send a message here and it forwards straight to my Telegram.",
    msgTelegramDirect: "Message on Telegram Directly →",
    yourName: "Your Name",
    namePlaceholder: "Recruiter / Client Name",
    yourContact: "Your Email or Telegram @handle",
    contactPlaceholder: "name@company.com or @username",
    messageLabel: "Message",
    messagePlaceholder:
      "Hi Murhaf, I came across your portfolio and wanted to discuss...",
    btnSendTelegram: "Send to Telegram",
    btnDelivering: "Delivering...",
    msgDelivered: "Message Delivered",
    sendAnother: "Send another message",
    msgSuccessBot:
      "Your message has been delivered directly to my Telegram! I will reply shortly.",
    msgSuccessFallback:
      "Thank you! Your message was received. You can also chat with me directly on Telegram below.",

    // Social Dock
    dockGetInTouch: "Get in touch",
    dockResume: "Download Resume",
    dockBackToTop: "Back to top",

    // Footer
    footerBuiltWith: "Built with Next.js, TypeScript & Drizzle ORM on Neon.",
  },
  ar: {
    // Navigation / Header
    navSkills: "المهارات",
    navProjects: "المشاريع",
    navActivity: "النشاط",
    navContact: "تواصل معي",
    navAdmin: "لوحة التحكم",
    switchLanguage: "English",

    // Hero Section
    statusAvailable: "متاح لفرص العمل والوظائف بدوام كامل والمشاريع الحرة",
    statusUnavailable: "مشغول حالياً بمشاريع قيد التطوير",
    greeting: "مرحباً، أنا",
    defaultHeadline: "مطور ويب متكامل (Full-Stack) | Next.js و TypeScript و Node.js",
    defaultBio:
      "أقوم ببناء تطبيقات ويب حديثة وعالية الأداء مع التركيز على البنية البرمجية النظيفة وتجارب المستخدم الاستثنائية. شغوف بالأنظمة الحية والتفاعلية (Real-Time) وبيئة React و TypeScript.",
    github: "GitHub",
    telegram: "تيليجرام",
    instagram: "إنستغرام",
    resume: "السيرة الذاتية",
    fullStackBadge: "مطور متكامل",

    // Skills Section
    skillsTitle: "المهارات والتقنيات",
    skillsSubtitle:
      "التقنيات والأدوات التي أعتمد عليها لبناء تطبيقات حديثة وقابلة للتوسع.",
    categoryFrontend: "واجهات أمامية",
    categoryBackend: "واجهات خلفية",
    categoryDatabase: "قواعد البيانات",
    categoryDevops: "أدوات وتطوير",

    // Projects Section
    projectsTitle: "المشاريع المميزة",
    projectsSubtitle: "تطبيقات حقيقية قمت بتصميمها وهندستها وبنائها بالكامل.",
    noProjectsTitle: "لم يتم نشر مشاريع بعد",
    noProjectsDesc:
      "المشاريع المضافة من خلال لوحة التحكم ستظهر هنا تلقائياً فور إضافتها.",
    btnCode: "الكود",
    btnLive: "معاينة",
    btnArchitecture: "هيكلية النظام",
    modalArchTitle: "ملاحظات الهيكلية البرمجية",

    // Live GitHub Activity
    liveActivityBadge: "نشاط برمجي حي",
    recentOpenSourceTitle: "أحدث المساهمات مفتوحة المصدر",
    viewAllGithub: "عرض الكل على GitHub",
    repoFallbackDesc: "مستودع برمجي مفتوح المصدر.",

    // Contact Section
    directCommBadge: "تواصل فوري",
    letsTalkTitle: "دعنا نتحدث.",
    contactDesc:
      "هل تبحث عن مطور لمشروعك، وظيفة، أو استشارة تقنية؟ أرسل رسالتك هنا وستصلني مباشرة على تطبيق تيليجرام.",
    msgTelegramDirect: "مراسلة عبر تيليجرام مباشرة ←",
    yourName: "الاسم",
    namePlaceholder: "اسم المسؤول أو العميل",
    yourContact: "البريد الإلكتروني أو معرّف تيليجرام",
    contactPlaceholder: "name@company.com أو username@",
    messageLabel: "الرسالة",
    messagePlaceholder:
      "مرحباً مرهف، اطلعت على معرض أعمالك وأود مناقشة تفاصيل...",
    btnSendTelegram: "إرسال إلى تيليجرام",
    btnDelivering: "جاري الإرسال...",
    msgDelivered: "تم استلام رسالتك بنجاح",
    sendAnother: "إرسال رسالة أخرى",
    msgSuccessBot:
      "وصلت رسالتك مباشرة إلى حسابي على تيليجرام! سأقوم بالرد عليك في أقرب وقت.",
    msgSuccessFallback:
      "شكراً لتواصلك! تم استلام رسالتك بنجاح، ويمكنك أيضاً التواصل معي مباشرة عبر تيليجرام.",

    // Social Dock
    dockGetInTouch: "تواصل معي",
    dockResume: "تحميل السيرة الذاتية",
    dockBackToTop: "للأعلى",

    // Footer
    footerBuiltWith: "تم البناء باستخدام Next.js و TypeScript و Drizzle ORM على Neon.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Restore saved language preference
    const saved = localStorage.getItem("preferred_lang") as Language | null;
    if (saved === "ar" || saved === "en") {
      setLanguageState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "ar" : "en";
    setLanguage(nextLang);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || "";
  };

  const isRtl = language === "ar";
  const dir: "ltr" | "rtl" = isRtl ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRtl,
        dir,
      }}
    >
      <div dir={dir} className={isRtl ? "font-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
