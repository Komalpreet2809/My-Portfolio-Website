import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type SleepingCreatureProps = {
  className?: string;
};

export default function SleepingCreature({ className = "" }: SleepingCreatureProps) {
  const reduceMotion = useReducedMotion();
  const [awake, setAwake] = useState(false);
  const [showSnore, setShowSnore] = useState(false);
  const scrollTotalRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const sleepTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || reduceMotion) return;

    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      scrollTotalRef.current += Math.abs(currentY - lastScrollYRef.current);
      lastScrollYRef.current = currentY;

      if (scrollTotalRef.current > 520) {
        setAwake(true);
        scrollTotalRef.current = 0;
      }

      if (sleepTimerRef.current) window.clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = window.setTimeout(() => setAwake(false), 3600);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (sleepTimerRef.current) window.clearTimeout(sleepTimerRef.current);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (typeof window === "undefined" || reduceMotion || awake) {
      setShowSnore(false);
      return;
    }

    const interval = window.setInterval(() => {
      setShowSnore(true);
      window.setTimeout(() => setShowSnore(false), 1800);
    }, 6200);

    return () => window.clearInterval(interval);
  }, [awake, reduceMotion]);

  const idleBreath = reduceMotion
    ? {}
    : {
        y: [0, -2, 0],
        scaleY: [1, 1.035, 1],
        transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
      };

  const awakeMotion = reduceMotion
    ? {}
    : {
        rotate: [0, -3, 2, 0],
        y: [0, -5, 0],
        transition: { duration: 0.9, ease: "easeOut" },
      };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <div className="relative h-28 w-32 sm:h-32 sm:w-36">
        <AnimatePresence>
          {!awake && showSnore && (
            <motion.div
              className="absolute -right-2 top-0 font-mono text-[10px] font-bold tracking-[0.2em] text-white/35"
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: [0, 1, 0], y: -18, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.7, ease: "easeOut" }}
            >
              Zzz
            </motion.div>
          )}
        </AnimatePresence>

        <motion.svg
          viewBox="0 0 160 132"
          className="h-full w-full overflow-visible drop-shadow-[0_16px_28px_rgba(0,0,0,0.22)]"
          animate={awake ? awakeMotion : idleBreath}
        >
          <motion.ellipse
            cx="82"
            cy="108"
            rx="50"
            ry="9"
            fill="currentColor"
            className="text-black/25"
            animate={reduceMotion ? {} : { opacity: awake ? 0.24 : [0.18, 0.28, 0.18] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.path
            d="M35 76C35 43 58 24 86 24c29 0 51 20 51 50 0 31-22 47-52 47-31 0-50-15-50-45Z"
            fill="#EDE8DF"
            stroke="rgba(255,255,255,0.52)"
            strokeWidth="2"
          />
          <path
            d="M51 44 39 22l27 13M113 38l24-14-10 27"
            fill="#EDE8DF"
            stroke="rgba(255,255,255,0.52)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M51 48c8-8 19-13 33-13 18 0 33 8 40 23"
            fill="none"
            stroke="rgba(28,28,27,0.1)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {awake ? (
            <>
              <motion.circle
                cx="66"
                cy="72"
                r="4"
                fill="#222"
                animate={reduceMotion ? {} : { scaleY: [1, 0.15, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.4 }}
              />
              <motion.circle
                cx="101"
                cy="72"
                r="4"
                fill="#222"
                animate={reduceMotion ? {} : { scaleY: [1, 0.15, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.4 }}
              />
              <path
                d="M79 84c4 4 10 4 14 0"
                fill="none"
                stroke="#222"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <motion.path
                d="M38 85c-12 4-20 0-25-8"
                fill="none"
                stroke="#EDE8DF"
                strokeWidth="9"
                strokeLinecap="round"
                animate={reduceMotion ? {} : { rotate: [0, -7, 4, 0] }}
                style={{ transformOrigin: "38px 85px" }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            </>
          ) : (
            <>
              <path
                d="M60 73c6 5 13 5 19 0M93 73c6 5 13 5 19 0"
                fill="none"
                stroke="#222"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M80 86c3 2 7 2 10 0"
                fill="none"
                stroke="#222"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M39 89c-10 2-19-1-26-8"
                fill="none"
                stroke="#EDE8DF"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </>
          )}

          <circle cx="48" cy="80" r="6" fill="#F4B7A9" opacity="0.35" />
          <circle cx="118" cy="80" r="6" fill="#F4B7A9" opacity="0.35" />
        </motion.svg>
      </div>
    </div>
  );
}
