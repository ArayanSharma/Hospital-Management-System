"use client";

import { cn } from "../../../lib/utils.js";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Card = ({
  i,
  title,
  tag,
  description,
  features,
  image,
  progress,
  range,
  targetScale,
  cardHeight,
  cardWidth,
}) => {
  const containerRef = useRef(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="sticky top-0 flex h-screen items-start justify-center pt-28"
    >
      <motion.div
        style={{
          scale,
          top: `${i * 20}px`,
          height: `${cardHeight}px`,
          width: `${cardWidth}px`,
        }}
        className="relative overflow-hidden rounded-3xl border border-border/80 bg-white shadow-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10"
      >
        <div className="flex h-full w-full flex-row">
          {/* Left Side: Text Content */}
          <div className="flex h-full w-1/2 flex-col justify-between border-r border-border/60 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/30 p-8 text-left md:p-10 relative">
            {/* Background design blur accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/5 border border-primary/15 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {tag}
              </span>
              
              <div>
                <h3 className="text-2xl font-black tracking-tight text-text-heading leading-snug md:text-3xl font-heading mb-2">
                  {title}
                </h3>
                <p className="text-sm text-text-main/90 leading-relaxed md:text-base">
                  {description}
                </p>
              </div>
            </div>

            {/* Features list styled as a beautiful modern benefits grid */}
            {features && features.length > 0 && (
              <div className="grid grid-cols-1 gap-2 my-2">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/60 p-3 shadow-xs transition-colors hover:bg-white hover:border-primary/15"
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shadow-sm border border-emerald-500/20">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-xs font-bold text-slate-700 leading-none">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Premium CTA Button */}
            <button className="group flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-primary to-blue-600 px-6 py-3.5 text-xs font-extrabold tracking-wider text-white uppercase transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/35 active:scale-95">
              <span>Book Appointment</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Right Side: Image with overlays */}
          <div className="relative h-full w-1/2 overflow-hidden bg-muted group">
            <img
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={image}
              loading="lazy"
            />
            {/* Subtle gradient overlay to make the image fit nicely */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
            
            {/* Floating specialist badge */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 rounded-2xl bg-white/90 p-3 backdrop-blur-md border border-white/50 shadow-xl transition-all duration-300 group-hover:-translate-y-1">
              <div className="flex -space-x-2.5">
                <img className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80" alt="Doctor" />
                <img className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80" alt="Doctor" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary leading-none mb-0.5">Specialists</span>
                <span className="text-xs font-black text-slate-800 leading-none">Available Now</span>
              </div>
            </div>

            {/* Glowing top accent border */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-cyan-400 opacity-80" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function ScrollableCardStack({
  items = [],
  cardHeight = 550,
  cardWidth = 1120,
  className,
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{
        height: `${items.length * 100}vh`,
      }}
    >
      {items.map((card, i) => {
        const targetScale = 1 - (items.length - i) * 0.05;
        const start = i / items.length;
        
        return (
          <Card
            key={card.id || i}
            i={i}
            {...card}
            progress={scrollYProgress}
            range={[start, 1]}
            targetScale={targetScale}
            cardHeight={cardHeight}
            cardWidth={cardWidth}
          />
        );
      })}
    </div>
  );
}
