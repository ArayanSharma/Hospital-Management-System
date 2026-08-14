import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Import images
import img1 from "../../../assets/aboutimg/a1.png";
import img2 from "../../../assets/aboutimg/a2.png";
import img3 from "../../../assets/aboutimg/a3.jpg";
import img4 from "../../../assets/aboutimg/a4.avif";

const SECTIONS_DATA = [
  {
    tag: "Advanced Technology",
    title: "Medicine, reimagined around you",
    description: "At CareLine Hospital, we bring together advanced technology, experienced specialists, and compassionate care to create a healthcare experience designed around every patient.",
    stats: [
      { label: "AI Diagnostics", value: "99.4%" },
      { label: "Modern Equipment", value: "Gen-3" }
    ],
    image: img1
  },
  {
    tag: "Expert Care",
    title: "World-class medical specialists",
    description: "Our team of board-certified doctors and surgeons are leaders in their respective fields, dedicated to bringing you the highest standard of clinical excellence and pioneering treatments.",
    stats: [
      { label: "Specialists", value: "150+" },
      { label: "Success Rate", value: "98.7%" }
    ],
    image: img2
  },
  {
    tag: "Patient Experience",
    title: "Compassionate care at every step",
    description: "We understand that healing is more than just medicine. Our warm, welcoming environment and dedicated support staff ensure you and your family feel cared for, heard, and valued.",
    stats: [
      { label: "Patient Satisfaction", value: "4.9★" },
      { label: "Care Support", value: "24/7" }
    ],
    image: img3
  },
  {
    tag: "Seamless Access",
    title: "Integrated digital health ecosystem",
    description: "Manage your health effortlessly. Schedule appointments, view medical history, consult with doctors online, and coordinate prescriptions directly through our patient-first portal.",
    stats: [
      { label: "App Users", value: "50k+" },
      { label: "Response Time", value: "<15m" }
    ],
    image: img4
  }
];

// Sub-component for individual text block
const SectionBlock = ({ data, index, setActiveIndex }) => {
  const ref = useRef(null);
  // Trigger when 50% of the section is visible
  const isInView = useInView(ref, { amount: 0.5, margin: "-10% 0px -10% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  return (
    <motion.div
      ref={ref}
      className="min-h-[80vh] flex flex-col justify-center py-16 pr-0 md:pr-12 last:pb-32"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,118,255,0.1)] text-[#0076FF] font-semibold text-xs uppercase tracking-wider mb-6 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0076FF] animate-pulse" />
        {data.tag}
      </div>

      <h2 className="text-3xl md:text-5xl font-extrabold text-[#06152D] leading-tight mb-6">
        {data.title}
      </h2>

      <p className="text-[#5B6470] text-lg leading-relaxed mb-8 max-w-xl">
        {data.description}
      </p>

      {/* Mobile Image Showcase (visible only on mobile) */}
      <div className="md:hidden mb-8 w-full h-[260px] rounded-2xl overflow-hidden shadow-md border border-slate-100">
        <img
          src={data.image}
          alt={data.tag}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-6 max-w-md pt-6 border-t border-slate-100">
        {data.stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-3xl font-extrabold text-[#0076FF] mb-1">
              {stat.value}
            </span>
            <span className="text-sm font-medium text-slate-500">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full bg-gradient-to-b from-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          
          {/* Left Column: Scrolling content */}
          <div className="relative z-10">
            {SECTIONS_DATA.map((data, index) => (
              <SectionBlock
                key={index}
                data={data}
                index={index}
                setActiveIndex={setActiveIndex}
              />
            ))}
          </div>

          {/* Right Column: Sticky Image Showcase */}
          <div className="hidden md:block sticky top-0 h-screen overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              
              {/* Premium Glow Backdrop */}
              <div className="absolute w-[400px] h-[400px] bg-[rgba(0,118,255,0.1)] rounded-full blur-[100px] -z-10" />

              {/* Decorative Frame */}
              <div className="relative w-[480px] h-[580px] rounded-3xl p-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/50 overflow-hidden flex items-center justify-center">
                
                {/* Images Layer */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100">
                  {SECTIONS_DATA.map((data, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <motion.div
                        key={index}
                        className="absolute inset-0 w-full h-full"
                        initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          scale: isActive ? 1 : 1.08,
                          filter: isActive ? "blur(0px)" : "blur(8px)",
                          zIndex: isActive ? 10 : 0
                        }}
                        transition={{
                          duration: 0.8,
                          ease: [0.16, 1, 0.3, 1] // Custom easeOutExpo
                        }}
                      >
                        {/* Overlay Gradient to blend image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10" />
                        
                        <img
                          src={data.image}
                          alt={data.tag}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Mobile fall-back inline images */}
          <div className="md:hidden flex flex-col gap-8 pb-16">
            {/* The individual SectionBlock is rendered above; we can render image inside/after each text content block on mobile */}
          </div>

        </div>
      </div>
    </section>
  );
}
