"use client";

import React from "react";
import { motion, Transition } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  href?: string;
}
export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "", href = "", className, ...props }, ref) => {
  const router = useRouter();
  const glowColors = ["#3FA9D9", "#E6F6FC", "#89C4F4", "#2575fc"];
  const scale = 1.6;
  const duration = 6;

  const breatheEffect = {
    background: glowColors.map(
      (color) =>
        `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`,
    ),
    scale: [1 * scale, 1.05 * scale, 1 * scale],
    transition: {
      repeat: Infinity,
      duration: duration,
      repeatType: "mirror",
      ease: "easeInOut",
    } as Transition,
  };
  const handleClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-2 font-semibold transition-all duration-300",
        "border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md text-black dark:text-white",
        "hover:shadow-xl",
        className,
      )}
      {...props}
    >
      {/* Embedded Glow Effect */}
      <motion.div
        animate={breatheEffect}
        className={cn(
          "pointer-events-none absolute inset-0 z-0 transform-gpu blur-lg scale-[1.6]",
        )}
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Foreground Text */}
      <span className="relative z-10 flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
        {text}
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
