"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function MotionReveal({
  children,
  delay = 0,
  y = 18,
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  amount?: number; // viewport ne kadar girince tetiklesin
}) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);

  // once:false => sürekli izler
  const inView = useInView(ref, { amount, once: false });

  useEffect(() => {
    if (inView) {
      controls.start("show");
    } else {
      // ekrandan çıkınca tekrar "hidden" yap => geri gelince yeniden oynar
      controls.start("hidden");
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
            delay,
          },
        },
      }}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
