"use client";

import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useId, useState, type ReactNode } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import {
  describeArc,
  NAV_ITEMS,
  polarToSvg,
  SECTION_LABELS,
  type SectionId,
} from "@/lib/orbital";
import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  ArrowLeft,
  CalendarCheck,
  ChevronRight,
  Film,
  Globe,
  Mail,
  Monitor,
  Phone,
  Terminal,
  TrendingUp,
} from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiCplusplus,
  SiCss,
  SiDart,
  SiDotnet,
  SiFirebase,
  SiFlutter,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiNextdotjs,
  SiOpenjdk,
  SiPhp,
  SiReact,
  SiSwift,
} from "react-icons/si";
import { SECTION_ICONS } from "@/lib/section-icons";

const CX = 240;
const CY = 240;
/**
 * Decorative ring radius (SVG viewBox units). Keep this outside the avatar
 * (min(53%,256px) ⌀, border, blur) so arcs never visually touch the photo.
 */
const RING_R = 190;
/** Button centers; must stay ≥ ~8–12 units past RING_R so labels clear the ring */
const ORBIT_R = 212;
const SWEEP = 68;

function ringSegment(centerDeg: number): { start: number; end: number } {
  return {
    start: centerDeg - SWEEP / 2,
    end: centerDeg + SWEEP / 2,
  };
}

const easeSmooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DISPLAY_NAME = "Munther Qadous";
/** Dedicated path so swapping the file updates reliably (avoid stale browser cache on /profile.png). */
const PROFILE_IMAGE_SRC = "/profile-photo.png";
const AVATAR_HEADER_PX = 72;
/** Matches viewBox so orbit math lines up with physical layout; keeps the cluster compact */
const ORBIT_BOX_PX = 480;

const LANGUAGE_ITEMS = ["Arabic", "English", "Turkish"] as const;

type SkillStackItem = {
  name: string;
  Icon: IconType;
  accent: string;
  softBg: string;
};

type SkillShowcaseImage = {
  src: string;
  alt: string;
  label: string;
};

type SkillShowcase = {
  title: string;
  caption: string;
  imageSrc?: string;
  imageAlt?: string;
  images?: SkillShowcaseImage[];
};

type SkillDefinition = {
  title: string;
  icon: LucideIcon;
  blurb: string;
  stack?: SkillStackItem[];
  showcase?: SkillShowcase;
};

function slugifySkillTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const SKILL_DEFINITIONS: SkillDefinition[] = [
  {
    title: "Technical Analysis",
    icon: TrendingUp,
    blurb:
      "Chart reading, indicators, and structuring ideas from price action and market context.",
  },
  {
    title: "CyberRental",
    icon: Globe,
    blurb:
      "A car rental platform built with React and Next.js — dark hero section, booking form with pick-up/drop-off fields, date pickers, and car class selection. Focused on clear hierarchy, strong contrast, and a visual centerpiece that anchors the landing experience.",
    showcase: {
      title: "CyberRental",
      caption:
        "Car rental platform UI — hero landing, search & booking form, and dark-theme polish.",
      imageSrc: "/project-cyberrental.png",
      imageAlt:
        "CyberRental car rental website hero with booking form over a night city scene",
    },
  },
  {
    title: "Application development",
    icon: AppWindow,
    blurb:
      "A personal Budgeting mobile app built to track daily spending, break down expenses by category, and manage savings goals. Features real-time balance tracking, animated data visualizations, and an AI-powered suggestions engine — all in a dark, high-contrast UI.",
    showcase: {
      title: "Budgeting App",
      caption: "Three core screens: home dashboard, spending breakdown, and goals tracker.",
      images: [
        {
          src: "/projects/app-development/homescreen.png",
          alt: "Home screen showing daily spending overview and balance chart",
          label: "Home",
        },
        {
          src: "/projects/app-development/expenses%20screen.png",
          alt: "Expenses screen with category breakdown and bar charts",
          label: "Expenses",
        },
        {
          src: "/projects/app-development/goals%20screen.png",
          alt: "Goals screen showing savings targets and progress tracking",
          label: "Goals",
        },
      ],
    },
  },
  {
    title: "Programming Languages",
    icon: Terminal,
    blurb: "Languages and technologies I currently work with:",
    stack: [
      {
        name: "HTML",
        Icon: SiHtml5,
        accent: "#E34F26",
        softBg: "rgba(227, 79, 38, 0.14)",
      },
      {
        name: "CSS",
        Icon: SiCss,
        accent: "#1572B6",
        softBg: "rgba(21, 114, 182, 0.14)",
      },
      {
        name: "PHP",
        Icon: SiPhp,
        accent: "#777BB4",
        softBg: "rgba(119, 123, 180, 0.18)",
      },
      {
        name: "JavaScript",
        Icon: SiJavascript,
        accent: "#F7DF1E",
        softBg: "rgba(247, 223, 30, 0.12)",
      },
      {
        name: "React",
        Icon: SiReact,
        accent: "#61DAFB",
        softBg: "rgba(97, 218, 251, 0.14)",
      },
      {
        name: "Next.js",
        Icon: SiNextdotjs,
        accent: "#FAFAFA",
        softBg: "rgba(250, 250, 250, 0.1)",
      },
      {
        name: "Java",
        Icon: SiOpenjdk,
        accent: "#437291",
        softBg: "rgba(67, 114, 145, 0.16)",
      },
      {
        name: "C++",
        Icon: SiCplusplus,
        accent: "#00599C",
        softBg: "rgba(0, 89, 156, 0.14)",
      },
      {
        name: "C#",
        Icon: SiDotnet,
        accent: "#512BD4",
        softBg: "rgba(81, 43, 212, 0.16)",
      },
      {
        name: "Dart",
        Icon: SiDart,
        accent: "#0175C2",
        softBg: "rgba(1, 117, 194, 0.14)",
      },
      {
        name: "Flutter",
        Icon: SiFlutter,
        accent: "#54C5F8",
        softBg: "rgba(84, 197, 248, 0.14)",
      },
      {
        name: "Kotlin",
        Icon: SiKotlin,
        accent: "#7F52FF",
        softBg: "rgba(127, 82, 255, 0.16)",
      },
      {
        name: "Swift",
        Icon: SiSwift,
        accent: "#F05138",
        softBg: "rgba(240, 81, 56, 0.14)",
      },
      {
        name: "Firebase",
        Icon: SiFirebase,
        accent: "#FFCA28",
        softBg: "rgba(255, 202, 40, 0.12)",
      },
    ],
  },
  {
    title: "Responsive design",
    icon: Monitor,
    blurb:
      "Layouts that stay clear and usable across phones, tablets, and larger screens.",
  },
  {
    title: "Organization and Time Management",
    icon: CalendarCheck,
    blurb:
      "Planning, prioritization, and steady follow-through so work stays on track.",
  },
  {
    title: "Video File Editing",
    icon: Film,
    blurb:
      "Cutting, pacing, and polish so footage reads clearly and tells a tighter story.",
  },
];

type EducationEntry = {
  institution: string;
  credential: string;
  period: string;
};

const EDUCATION_ENTRIES: EducationEntry[] = [
  {
    institution: "Near East University — North Cyprus",
    credential: "Master of Computer Information Systems (CIS)",
    period: "Mar 2022 – Mar 2024",
  },
  {
    institution: "Near East University — North Cyprus",
    credential: "Bachelor of Science: Computer Information System (CIS)",
    period: "Jan 2018 – Jan 2022",
  },
  {
    institution: "ICDL Certificate",
    credential: "",
    period: "Mar 2020",
  },
  {
    institution: "Al-Wakra High School for Boys — Qatar",
    credential: "High School",
    period: "Jan 2017 – Jan 2018",
  },
];

const PUBLICATION_ENTRIES: string[] = [
  "Qadous, M. (2023). SWOT analysis of digital games, NEU Grand Library.",
  "Taqi, A. M., Qadous, M., Salah, M., & Ozdamli, F. (2023). Gamification in recommendation systems: A systematic analysis. In Communications in Computer and Information Science (pp. 143–153). Springer Nature.",
];

/** Huge rotating conic (centered on card) so the border ring sees a gentle sweep—kept off the face by an opaque inner fill. */
const EDUCATION_BORDER_SPIN_PX = "min(280vw, 3200px)";

function EducationSection({ reduce }: { reduce: boolean }) {
  /** Solid base + gradient on top: no transparent "to" stop, so the spinner never bleeds through the face. */
  const cardInnerClass =
    "relative z-10 px-5 py-4 sm:px-6 sm:py-5 " +
    (reduce
      ? "rounded-2xl border border-white/[0.08] bg-white/[0.03] ring-1 ring-inset ring-white/[0.04]"
      : "rounded-[14px] border border-white/[0.08] bg-[#0a0a0f] bg-gradient-to-br from-white/[0.1] via-white/[0.045] to-[#0a0a0f] shadow-black/20 ring-1 ring-inset ring-white/[0.04]");

  return (
    <div className="mt-2 space-y-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeSmooth }}
      >
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          Education
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-400">
          Degrees, certification, and secondary school.
        </p>
      </motion.div>

      <ul className="list-none space-y-4" role="list" aria-label="Education">
        {EDUCATION_ENTRIES.map((entry, i) => (
          <motion.li
            key={`${entry.institution}-${entry.credential}-${entry.period}`}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce
                ? {}
                : {
                    duration: 0.42,
                    ease: easeSmooth,
                    delay: 0.05 + i * 0.06,
                  }
            }
            className={
              reduce
                ? "block"
                : "education-card group relative overflow-hidden rounded-2xl p-[2px] shadow-black/20 transition-[box-shadow,border-color] duration-300 ease-out hover:shadow-[0_0_36px_-12px_rgba(34,211,238,0.28)]"
            }
          >
            {!reduce ? (
              <div
                aria-hidden
                className="education-border-spin pointer-events-none absolute z-0"
                style={{
                  width: EDUCATION_BORDER_SPIN_PX,
                  height: EDUCATION_BORDER_SPIN_PX,
                  left: "50%",
                  top: "50%",
                  marginLeft: `calc(${EDUCATION_BORDER_SPIN_PX} / -2)`,
                  marginTop: `calc(${EDUCATION_BORDER_SPIN_PX} / -2)`,
                  animationDelay: `${i * 0.45}s`,
                  background: `conic-gradient(
                    from 0deg,
                    rgba(255, 255, 255, 0.04),
                    rgba(34, 211, 238, 0.08),
                    rgba(34, 211, 238, 0.26),
                    rgba(34, 211, 238, 0.42),
                    rgba(167, 139, 250, 0.36),
                    rgba(139, 92, 246, 0.14),
                    rgba(34, 211, 238, 0.1),
                    rgba(255, 255, 255, 0.04)
                  )`,
                }}
              />
            ) : null}

            <div className={cardInnerClass}>
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 text-base font-semibold leading-snug text-zinc-100 sm:text-[1.05rem]">
                  {entry.institution}
                </p>
                <p className="shrink-0 text-right text-xs tabular-nums tracking-wide text-zinc-400 sm:text-sm">
                  {entry.period}
                </p>
              </div>
              {entry.credential ? (
                <p className="mt-2.5 text-base leading-relaxed text-zinc-300">
                  {entry.credential}
                </p>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="mt-12 space-y-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce ? {} : { duration: 0.4, ease: easeSmooth, delay: 0.12 }
          }
        >
          <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            Publications
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-400">
            Selected papers and thesis-related output.
          </p>
        </motion.div>

        <ul className="list-none space-y-4" role="list" aria-label="Publications">
          {PUBLICATION_ENTRIES.map((citation, i) => (
            <motion.li
              key={`publication-${i}`}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? {}
                  : {
                      duration: 0.42,
                      ease: easeSmooth,
                      delay: 0.18 + EDUCATION_ENTRIES.length * 0.06 + i * 0.07,
                    }
              }
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-5 shadow-black/20 ring-1 ring-inset ring-white/[0.04] sm:p-6"
            >
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                {citation}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  highlights: string[];
};

const ABOUT_INTRO =
  "Driven individual with a Master's in Computer Information Systems (CIS) and strong interpersonal and task prioritization skills. Created a fully functional website as a graduation project, sparking a deep interest in web design. Proficient in HTML, CSS, JavaScript, PHP and WordPress. Eager to bring a positive attitude and willingness to learn new things always.";

const EXPERIENCE_ENTRIES: ExperienceEntry[] = [
  {
    company: "VeleSpeed",
    role: "Customer Service and Sales staff",
    period: "Jan 2021 – Jan 2022",
    highlights: [
      "Responded to customer requests for products, services, and company information.",
      "Provided primary customer support to internal and external customers.",
      "Offered advice and assistance to customers, paying attention to special needs or wants.",
    ],
  },
  {
    company: "FRONTDREAMS WEB SOLUTIONS LIMITED",
    role: "Web Developer (Remote Internship)",
    period: "Jan 2020 – Jan 2021",
    highlights: [
      "Developed and maintained user interfaces using HTML, CSS, JavaScript, and PHP templating, ensuring a responsive and user-friendly experience and an increase in user satisfaction.",
      "Followed best practices for software development and web security, improving system reliability and performance.",
      "Collaborated closely with developers to create new code, enhancing user engagement and satisfaction rates.",
    ],
  },
  {
    company: "FRONTDREAMS WEB SOLUTIONS LIMITED",
    role: "Web Developer (Remote Internship)",
    period: "Jan 2017 – Jan 2018",
    highlights: [
      "Assisted the senior developer with various tasks, learning additional scripting languages and enhancing technical skills.",
      "Supervised a team of 4 staff members, ensuring project milestones were met and improving team productivity.",
      "Collaborated with a team of 3 to develop a car rental website, increasing user engagement and satisfaction rates.",
    ],
  },
];

function AboutSection({ reduce }: { reduce: boolean }) {
  return (
    <div className="mt-2 space-y-10">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeSmooth }}
      >
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          About me
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-300">
          {ABOUT_INTRO}
        </p>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce ? {} : { duration: 0.4, ease: easeSmooth, delay: 0.06 }
        }
      >
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          Experience
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-400">
          Roles where I supported customers and built on the web.
        </p>
      </motion.div>

      <ul className="list-none space-y-4" role="list" aria-label="Work experience">
        {EXPERIENCE_ENTRIES.map((job, i) => (
          <motion.li
            key={`${job.company}-${job.period}`}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce
                ? {}
                : {
                    duration: 0.42,
                    ease: easeSmooth,
                    delay: 0.08 + i * 0.06,
                  }
            }
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-5 shadow-black/20 ring-1 ring-inset ring-white/[0.04] sm:p-6"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="text-base font-semibold leading-snug text-zinc-100 sm:text-[1.05rem]">
                  {job.company}
                </p>
                <p className="mt-1 text-sm font-medium text-cyan-200/90 sm:text-[0.9375rem]">
                  {job.role}
                </p>
              </div>
              <p className="shrink-0 text-xs tabular-nums tracking-wide text-zinc-400 sm:text-right sm:text-sm">
                {job.period}
              </p>
            </div>
            <ul className="mt-4 list-none space-y-2.5 border-t border-white/[0.07] pt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              {job.highlights.map((line, hi) => (
                <li
                  key={`${job.period}-${hi}`}
                  className="flex gap-2.5 pl-0 sm:gap-3"
                >
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/70"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const CONTACT_EMAIL = "qadous.designs@gmail.com";
const CONTACT_PHONE_DISPLAY = "+974 50426245";
const CONTACT_PHONE_HREF = "tel:+97450426245";

function ContactSection({ reduce }: { reduce: boolean }) {
  const stagger = reduce
    ? {}
    : { duration: 0.42, ease: easeSmooth };

  return (
    <div className="mt-2 space-y-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeSmooth }}
      >
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          Get in touch
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
          Whether you want to talk about a project, an opportunity, or just say
          hello—reach out through email or phone. I will get back to you as soon
          as I can.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <motion.a
          href={`mailto:${CONTACT_EMAIL}`}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? {} : { ...stagger, delay: 0.06 }}
          className="group relative flex min-h-[9.5rem] flex-col justify-between rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent p-5 shadow-black/15 ring-1 ring-inset ring-white/[0.05] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] sm:min-h-0 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_-8px_rgba(34,211,238,0.4)] transition-transform duration-300 group-hover:scale-105"
              aria-hidden
            >
              <Mail className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Email
              </p>
              <p className="mt-2 break-all text-base font-medium leading-snug text-zinc-100 sm:text-[1.05rem]">
                {CONTACT_EMAIL}
              </p>
            </div>
          </div>
          <p className="mt-5 flex items-center gap-1 text-sm font-medium text-cyan-300/95 transition-colors group-hover:text-cyan-200">
            Open mail app
            <ChevronRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden
            />
          </p>
        </motion.a>

        <motion.a
          href={CONTACT_PHONE_HREF}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? {} : { ...stagger, delay: 0.12 }}
          className="group relative flex min-h-[9.5rem] flex-col justify-between rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent p-5 shadow-black/15 ring-1 ring-inset ring-white/[0.05] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-violet-400/35 hover:shadow-[0_0_40px_-12px_rgba(167,139,250,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] sm:min-h-0 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-violet-200 shadow-[0_0_20px_-8px_rgba(167,139,250,0.35)] transition-transform duration-300 group-hover:scale-105"
              aria-hidden
            >
              <Phone className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Phone
              </p>
              <p className="mt-2 font-mono text-base font-medium tabular-nums leading-snug text-zinc-100 sm:text-[1.05rem]">
                {CONTACT_PHONE_DISPLAY}
              </p>
            </div>
          </div>
          <p className="mt-5 flex items-center gap-1 text-sm font-medium text-violet-200/95 transition-colors group-hover:text-violet-100">
            Tap to call
            <ChevronRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden
            />
          </p>
        </motion.a>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce ? {} : { duration: 0.4, ease: easeSmooth, delay: 0.2 }
        }
        className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-5 ring-1 ring-inset ring-white/[0.04] sm:px-7 sm:py-6"
      >
        <p className="text-sm leading-relaxed text-zinc-400 sm:text-[0.9375rem]">
          <span className="font-medium text-zinc-300">Prefer email?</span> Best
          for longer messages, links, or attachments.{" "}
          <span className="font-medium text-zinc-300">Need a quick answer?</span>{" "}
          A short call is welcome too—Qatar (+974).
        </p>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <p className="mt-4 text-center text-xs text-zinc-500 sm:text-left">
          Spam filters are noisy; if you do not see a reply within a couple of
          days, a quick nudge by phone is totally fine.
        </p>
      </motion.div>
    </div>
  );
}

const skillPanelTransition = {
  height: { type: "tween" as const, duration: 0.32, ease: easeSmooth },
  opacity: { type: "tween" as const, duration: 0.2, ease: easeSmooth },
};

function SkillsLanguagesPanel({
  reduce,
  className,
}: {
  reduce: boolean;
  className?: string;
}) {
  const transition = reduce
    ? {}
    : { duration: 0.45, ease: easeSmooth, delay: 0.2 };

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
        Languages
      </h2>
      <p className="mt-2 text-base text-zinc-400">
        Comfortable communicating and collaborating in:
      </p>
      <ul
        className="mt-4 flex list-none flex-row flex-nowrap items-center justify-start gap-2 sm:gap-2.5"
        role="list"
        aria-label="Languages"
      >
        {LANGUAGE_ITEMS.map((lang, i) => (
          <motion.li
            key={lang}
            className="shrink-0"
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduce
                ? {}
                : {
                    duration: 0.38,
                    ease: easeSmooth,
                    delay: 0.28 + i * 0.07,
                  }
            }
          >
            <span className="inline-flex min-h-9 items-center whitespace-nowrap rounded-xl border border-violet-400/20 bg-violet-500/[0.08] px-3 py-2 text-sm font-medium text-violet-100/95 shadow-[0_0_24px_-8px_rgba(167,139,250,0.28)] transition-[border-color,transform] duration-200 hover:border-violet-400/40 sm:min-h-[2.5rem] sm:px-4 sm:text-[0.9375rem]">
              {lang}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function SkillsSectionCards({ reduce }: { reduce: boolean }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const disclosureBaseId = useId().replace(/:/g, "");

  const panelTransition = reduce ? { duration: 0.15 } : skillPanelTransition;

  return (
    <div className="mt-2 lg:flex lg:w-full lg:items-start lg:justify-between lg:gap-6 xl:gap-8">
      <div className="min-w-0 flex-1 space-y-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeSmooth }}
        >
          <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            Core skills
          </h2>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-zinc-400">
            Tap a card to expand—areas I focus on, shown in a quick, scannable
            layout.
          </p>
        </motion.div>

        <div className="lg:hidden">
          <SkillsLanguagesPanel
            reduce={reduce}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 ring-1 ring-inset ring-white/[0.04] sm:p-5"
          />
        </div>

          <ul
            className="flex list-none flex-col gap-3"
            role="list"
            aria-label="Skills"
          >
            {SKILL_DEFINITIONS.map((skill, idx) => {
              const slug = slugifySkillTitle(skill.title);
              const isOpen = openSlug === slug;
              const panelId = `${disclosureBaseId}-${slug}-panel`;
              const buttonId = `${disclosureBaseId}-${slug}-btn`;

              return (
                <li key={skill.title} className="min-w-0 w-full max-w-full">
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduce
                        ? { duration: 0.2 }
                        : { duration: 0.38, ease: easeSmooth, delay: idx * 0.05 }
                    }
                    className={`flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent shadow-black/20 ring-1 ring-inset ring-white/[0.04] transition-[border-color,box-shadow] duration-300 ease-out ${
                      isOpen
                        ? "border-cyan-500/30 shadow-[0_0_40px_-10px_rgba(34,211,238,0.4)]"
                        : "hover:border-cyan-500/25 hover:shadow-[0_0_32px_-12px_rgba(34,211,238,0.28)]"
                    }`}
                  >
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenSlug((s) => (s === slug ? null : slug))
                      }
                      className="group flex w-full items-center gap-3 px-4 py-3.5 text-left sm:gap-4 sm:px-5 sm:py-4"
                    >
                      <span
                        className={`flex shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isOpen
                            ? "size-10 border-cyan-400/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_18px_-5px_rgba(34,211,238,0.5)]"
                            : "size-9 border-white/10 bg-white/[0.05] text-zinc-400 group-hover:border-cyan-400/30 group-hover:bg-cyan-500/[0.08] group-hover:text-cyan-300"
                        }`}
                        aria-hidden
                      >
                        <skill.icon className="size-[1.0625rem]" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-medium leading-snug text-zinc-100 sm:text-[1.05rem]">
                          {skill.title}
                        </p>
                        <p className="mt-0.5 text-sm text-zinc-500 sm:text-[0.9375rem]">
                          {isOpen ? "Tap again to collapse" : "Tap to see more"}
                        </p>
                      </div>
                      <motion.span
                        aria-hidden
                        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-zinc-300 transition-colors duration-200 group-hover:border-white/20 sm:size-9"
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={
                          reduce
                            ? { duration: 0.12 }
                            : { type: "tween", duration: 0.25, ease: easeSmooth }
                        }
                      >
                        <ChevronRight className="size-4 sm:size-5" strokeWidth={2} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          key="panel"
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={panelTransition}
                          style={{ overflow: "hidden" }}
                          className="border-t border-white/[0.07]"
                        >
                          <div className="space-y-5 px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5 md:px-8 md:pb-8">
                            <p className="text-base leading-relaxed text-zinc-300">
                              {skill.blurb}
                            </p>
                            {skill.showcase ? (
                              skill.showcase.images && skill.showcase.images.length > 0 ? (
                                <div className="space-y-4">
                                  <div className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
                                    {skill.showcase.images.map((img, ii) => (
                                      <motion.figure
                                        key={img.src}
                                        className="flex-none w-[52%] sm:w-auto"
                                        initial={reduce ? false : { opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={
                                          reduce
                                            ? {}
                                            : { duration: 0.32, ease: easeSmooth, delay: 0.06 + ii * 0.08 }
                                        }
                                      >
                                        <div className="relative aspect-[9/19.5] overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] ring-1 ring-inset ring-white/[0.06]">
                                          <Image
                                            src={img.src}
                                            alt={img.alt}
                                            fill
                                            className="object-cover object-top"
                                            sizes="(max-width: 640px) 55vw, 30vw"
                                          />
                                        </div>
                                        <figcaption className="mt-2.5 text-center text-xs font-medium text-zinc-400 sm:text-sm">
                                          {img.label}
                                        </figcaption>
                                      </motion.figure>
                                    ))}
                                  </div>
                                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 sm:px-5">
                                    <p className="text-sm font-semibold text-zinc-100 sm:text-base">
                                      {skill.showcase.title}
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                                      {skill.showcase.caption}
                                    </p>
                                  </div>
                                </div>
                              ) : skill.showcase.imageSrc ? (
                                <figure className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20 ring-1 ring-inset ring-white/[0.05]">
                                  <div className="relative aspect-[16/10] w-full bg-zinc-950">
                                    <Image
                                      src={skill.showcase.imageSrc}
                                      alt={skill.showcase.imageAlt ?? ""}
                                      fill
                                      className="object-cover object-top"
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, min(1152px, 75vw)"
                                    />
                                  </div>
                                  <figcaption className="border-t border-white/[0.06] px-4 py-3 sm:px-5 sm:py-4">
                                    <p className="text-sm font-semibold text-zinc-100 sm:text-base">
                                      {skill.showcase.title}
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                                      {skill.showcase.caption}
                                    </p>
                                  </figcaption>
                                </figure>
                              ) : null
                            ) : null}
                            {skill.stack && skill.stack.length > 0 ? (
                              <ul
                                className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                role="list"
                                aria-label="Programming languages and technologies"
                              >
                                {skill.stack.map((tech, ti) => (
                                  <motion.li
                                    key={tech.name}
                                    className="min-w-0"
                                    initial={reduce ? false : { opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={
                                      reduce
                                        ? {}
                                        : {
                                            duration: 0.28,
                                            ease: easeSmooth,
                                            delay: 0.04 + ti * 0.035,
                                          }
                                    }
                                  >
                                    <div
                                      className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] px-3 py-3 ring-1 ring-inset ring-white/[0.04] transition-shadow duration-300 hover:border-white/15 sm:px-4"
                                      style={{
                                        backgroundColor: tech.softBg,
                                        boxShadow: `0 0 24px -8px ${tech.accent}33`,
                                      }}
                                    >
                                      <span
                                        className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-black/25"
                                        aria-hidden
                                      >
                                        <tech.Icon
                                          className="size-7"
                                          style={{ color: tech.accent }}
                                          aria-hidden
                                        />
                                      </span>
                                      <span
                                        className={`min-w-0 flex-1 font-medium leading-snug text-zinc-100 ${
                                          tech.name === "JavaScript"
                                            ? "text-[0.875rem] tracking-tight sm:text-[0.9375rem]"
                                            : "break-words"
                                        }`}
                                      >
                                        {tech.name}
                                      </span>
                                    </div>
                                  </motion.li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                </li>
              );
            })}
          </ul>
      </div>

      <aside className="mt-10 hidden w-full shrink-0 lg:mt-0 lg:ml-auto lg:block lg:w-72 lg:min-w-[18rem] lg:max-w-[min(100%,20rem)] lg:pt-1 xl:w-[20rem] xl:min-w-[20rem]">
        <div className="lg:sticky lg:top-28">
          <SkillsLanguagesPanel
            reduce={reduce}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left ring-1 ring-inset ring-white/[0.04] sm:p-5"
          />
        </div>
      </aside>
    </div>
  );
}

function SectionContent({ id }: { id: SectionId }) {
  const reduce = useReducedMotion();
  const copy: Record<
    SectionId,
    { lead: string; bullets: string[] }
  > = {
    skills: {
      lead: "",
      bullets: [],
    },
    education: {
      lead: "",
      bullets: [],
    },
    about: {
      lead: "",
      bullets: [],
    },
    contact: {
      lead: "",
      bullets: [],
    },
  };

  const { lead, bullets } = copy[id];

  const transition = reduce
    ? { duration: 0.2 }
    : { duration: 0.52, ease: easeSmooth };

  const widthClass =
    id === "skills"
      ? "max-w-6xl"
      : id === "education" || id === "about" || id === "contact"
        ? "max-w-3xl"
        : "max-w-2xl";
  const sectionShell = (children: ReactNode) => (
    <motion.div
      key={id}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: 28, scale: 0.985, filter: "blur(12px)" }
      }
      animate={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      exit={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: -20, scale: 1.01, filter: "blur(10px)" }
      }
      transition={transition}
      className={`mx-auto w-full ${widthClass} px-6 pb-24 pt-8 sm:px-8`}
    >
      {children}
    </motion.div>
  );

  if (id === "skills") {
    return sectionShell(
      <SkillsSectionCards reduce={Boolean(reduce)} />,
    );
  }

  if (id === "education") {
    return sectionShell(<EducationSection reduce={Boolean(reduce)} />);
  }

  if (id === "about") {
    return sectionShell(<AboutSection reduce={Boolean(reduce)} />);
  }

  if (id === "contact") {
    return sectionShell(<ContactSection reduce={Boolean(reduce)} />);
  }

  return sectionShell(
      <>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce ? {} : { duration: 0.45, ease: easeSmooth, delay: 0.03 }
          }
          className="text-lg leading-relaxed text-zinc-300"
        >
          {lead}
        </motion.p>
        <ul className="mt-8 space-y-4 text-zinc-400">
          {bullets.map((b, i) => (
            <motion.li
              key={b}
              initial={
                reduce ? false : { opacity: 0, x: -16, filter: "blur(6px)" }
              }
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={
                reduce
                  ? {}
                  : { duration: 0.42, ease: easeSmooth, delay: 0.06 + i * 0.055 }
              }
              className="flex gap-3 border-l-2 border-cyan-500/40 pl-4 text-base leading-relaxed"
            >
              {b}
            </motion.li>
          ))}
        </ul>
      </>
  );
}

export function Portfolio() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<SectionId | null>(null);
  const [hovered, setHovered] = useState<SectionId | null>(null);

  const goHome = useCallback(() => setActive(null), []);

  return (
    <LayoutGroup id="portfolio-root">
      <AnimatedBackground />
      <div className="relative min-h-screen font-sans text-zinc-100">
        <AnimatePresence mode="popLayout" initial={false}>
          {active === null ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen"
            >
              <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
                <div className="flex flex-col items-center">
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: `min(${ORBIT_BOX_PX}px, min(92vw, 92dvh))`,
                    height: `min(${ORBIT_BOX_PX}px, min(92vw, 92dvh))`,
                  }}
                >
                  <svg
                    className="absolute inset-0 h-full w-full text-white/10"
                    viewBox="0 0 480 480"
                    fill="none"
                    aria-hidden
                  >
                    <defs>
                      <filter
                        id="glow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feGaussianBlur stdDeviation="4" result="b" />
                        <feMerge>
                          <feMergeNode in="b" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {NAV_ITEMS.map(({ id, angleDeg }) => {
                      const { start, end } = ringSegment(angleDeg);
                      const d = describeArc(CX, CY, RING_R, start, end);
                      const activeGlow = hovered === id;
                      return (
                        <motion.path
                          key={id}
                          d={d}
                          stroke="currentColor"
                          strokeWidth={activeGlow ? 3.5 : 1.5}
                          strokeLinecap="round"
                          className={
                            activeGlow
                              ? "text-cyan-300/90"
                              : "text-white/[0.12]"
                          }
                          filter={activeGlow ? "url(#glow)" : undefined}
                          initial={false}
                          animate={
                            reduce
                              ? {}
                              : activeGlow
                                ? {
                                    strokeDasharray: "1 8",
                                    strokeDashoffset: [0, -48],
                                  }
                                : { strokeDasharray: "none", strokeDashoffset: 0 }
                          }
                          transition={
                            reduce
                              ? {}
                              : activeGlow
                                ? {
                                    strokeDashoffset: {
                                      duration: 2.2,
                                      repeat: Infinity,
                                      ease: "linear",
                                    },
                                  }
                                : { duration: 0.25 }
                          }
                        />
                      );
                    })}
                  </svg>

                  <motion.div
                    layoutId="portfolio-avatar"
                    className="relative z-10 aspect-square w-[min(53%,256px)] overflow-hidden rounded-full border-[3px] border-white/20 bg-zinc-900 shadow-[0_0_44px_-14px_rgba(167,139,250,0.35)]"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 32,
                      mass: 0.85,
                    }}
                  >
                    <Image
                      src={PROFILE_IMAGE_SRC}
                      alt={`${DISPLAY_NAME} — profile photo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 480px) 50vw, 256px"
                      priority
                    />
                  </motion.div>

                  {NAV_ITEMS.map(({ id, angleDeg }, i) => {
                    const pos = polarToSvg(CX, CY, ORBIT_R, angleDeg);
                    const leftPct = (pos.x / 480) * 100;
                    const topPct = (pos.y / 480) * 100;
                    const Icon = SECTION_ICONS[id];
                    return (
                      <motion.button
                        key={id}
                        type="button"
                        aria-label={SECTION_LABELS[id]}
                        onClick={() => setActive(id)}
                        onHoverStart={() => setHovered(id)}
                        onHoverEnd={() =>
                          setHovered((h) => (h === id ? null : h))
                        }
                        className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full border border-white/10 bg-[#0c0c10]/85 px-5 py-3 text-left text-sm font-medium text-zinc-100 shadow-lg backdrop-blur-md transition-colors hover:border-cyan-400/45 hover:bg-cyan-500/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 sm:px-6 sm:py-3.5 sm:text-base"
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                        initial={false}
                        animate={reduce ? {} : { y: [0, -5, 0] }}
                        transition={
                          reduce
                            ? {}
                            : {
                                duration: 3.2 + i * 0.35,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2,
                              }
                        }
                        whileHover={reduce ? {} : { scale: 1.06 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Icon
                          className="size-4 shrink-0 text-cyan-400/90 sm:size-[1.125rem]"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        {SECTION_LABELS[id]}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.5, ease: easeSmooth }}
                  className="mt-3 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                >
                  {DISPLAY_NAME}
                </motion.h2>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: easeSmooth }}
                  className="mt-5 max-w-md text-center text-sm text-zinc-500"
                >
                  {" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-zinc-400">
                    
                  </code>{" "}

                </motion.p>
              </main>
            </motion.div>
          ) : (
            <motion.div
              key="section-shell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="min-h-screen"
            >
              <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050508]/75 px-4 py-4 backdrop-blur-xl sm:px-8">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 sm:gap-x-4">
                  <motion.div
                    layoutId="portfolio-avatar"
                    whileTap={{ scale: 0.97 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 32,
                      mass: 0.85,
                    }}
                    className="group relative shrink-0 overflow-hidden rounded-full border border-white/15 bg-zinc-900 shadow-[0_0_40px_-8px_rgba(34,211,238,0.35)] transition-[box-shadow] hover:border-cyan-400/35 hover:shadow-[0_0_48px_-6px_rgba(34,211,238,0.45)]"
                    style={{ width: AVATAR_HEADER_PX, height: AVATAR_HEADER_PX }}
                  >
                    <Image
                      src={PROFILE_IMAGE_SRC}
                      alt=""
                      fill
                      className="object-cover"
                      sizes={`${AVATAR_HEADER_PX}px`}
                      priority
                    />
                    <span
                      className="pointer-events-none absolute inset-0 z-[1] rounded-full bg-black/0 transition-colors duration-200 group-hover:bg-black/30 group-focus-within:bg-black/30"
                      aria-hidden
                    />
                    <span
                      className="pointer-events-none absolute bottom-0.5 left-0.5 z-[2] flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full bg-black/60 text-white/95 shadow-sm ring-1 ring-white/15 backdrop-blur-[2px] transition-transform duration-200 sm:h-5 sm:w-5 group-hover:scale-105 group-hover:bg-black/75"
                      aria-hidden
                    >
                      <ArrowLeft
                        className="size-2.5 sm:size-3"
                        strokeWidth={2.5}
                      />
                    </span>
                    <button
                      type="button"
                      onClick={goHome}
                      aria-label={`Back to home — ${DISPLAY_NAME}`}
                      title="Back to home"
                      className="absolute inset-0 z-10 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]"
                    />
                  </motion.div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active}
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : { opacity: 0, x: 28, filter: "blur(10px)" }
                      }
                      animate={
                        reduce
                          ? { opacity: 1 }
                          : { opacity: 1, x: 0, filter: "blur(0px)" }
                      }
                      exit={
                        reduce
                          ? { opacity: 0 }
                          : { opacity: 0, x: -22, filter: "blur(8px)" }
                      }
                      transition={{ duration: 0.42, ease: easeSmooth }}
                      className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
                    >
                      {(() => {
                        const HeaderIcon = SECTION_ICONS[active];
                        return (
                          <>
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-300 shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)] sm:h-11 sm:w-11"
                              aria-hidden
                            >
                              <HeaderIcon
                                className="size-4 sm:size-5"
                                strokeWidth={1.75}
                              />
                            </span>
                            <div className="min-w-0">
                              <h1 className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                                {SECTION_LABELS[active]}
                              </h1>
                              <p className="truncate text-sm text-zinc-500">
                                {DISPLAY_NAME}
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                  <nav
                    className="flex w-full items-center gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:ml-auto sm:w-auto sm:max-w-none sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
                    aria-label="Portfolio sections"
                  >
                    {NAV_ITEMS.map(({ id }) => {
                      const NavIcon = SECTION_ICONS[id];
                      const isCurrent = id === active;
                      return (
                        <motion.button
                          key={id}
                          type="button"
                          layout
                          onClick={() => setActive(id)}
                          aria-current={isCurrent ? "page" : undefined}
                          whileTap={reduce ? {} : { scale: 0.93 }}
                          transition={{ type: "spring", stiffness: 520, damping: 28 }}
                          className={`relative z-0 flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-1.5 text-xs font-medium sm:px-3 sm:py-2 sm:text-sm ${
                            isCurrent
                              ? "cursor-default border-transparent text-cyan-50"
                              : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
                          }`}
                        >
                          {isCurrent ? (
                            <motion.div
                              layoutId="active-nav-pill"
                              className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-cyan-400/65 bg-gradient-to-r from-cyan-500/40 via-cyan-400/15 to-violet-500/30 shadow-[0_0_32px_-4px_rgba(34,211,238,0.55)]"
                              transition={{
                                type: "spring",
                                stiffness: 460,
                                damping: 32,
                                mass: 0.62,
                              }}
                              initial={false}
                            />
                          ) : null}
                          <NavIcon
                            className="relative z-10 size-3.5 shrink-0 opacity-90 sm:size-4"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                          <span className="relative z-10 max-w-[9rem] truncate sm:max-w-[11rem]">
                            {SECTION_LABELS[id]}
                          </span>
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>
              </header>
              <AnimatePresence mode="popLayout" initial={false}>
                <SectionContent id={active} />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
