import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Sub-component for Doctor Card in the Marquee
const DoctorCard = ({ doctor }) => {
  const cardRef = useRef(null);

  // Mouse positions for hover card depth effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    damping: 25,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    damping: 25,
    stiffness: 200,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left - width / 2;
    const clientY = e.clientY - rect.top - height / 2;
    mouseX.set(clientX / width);
    mouseY.set(clientY / height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Availability statuses for variety
  const getStatus = (id) => {
    if (id % 3 === 0)
      return {
        label: "In Surgery",
        color: "bg-amber-500",
        text: "text-amber-500",
      };
    if (id % 2 === 0)
      return {
        label: "Available Today",
        color: "bg-emerald-500",
        text: "text-emerald-500",
      };
    return { label: "On Duty", color: "bg-[#0076FF]", text: "text-[#0076FF]" };
  };

  const status = getStatus(doctor.id);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative w-[280px] md:w-[320px] shrink-0 rounded-3xl border border-slate-100 bg-white p-6 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
    >
      {/* Availability Pill */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-wider">
        <span
          className={`w-2 h-2 rounded-full ${status.color} animate-pulse`}
        />
        <span className="text-slate-600">{status.label}</span>
      </div>

      <div style={{ transform: "translateZ(25px)" }} className="relative z-10">
        {/* Profile Image Frame with hover background glow */}
        <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-5 bg-slate-50">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Doctor Details */}
        <span className="text-xs font-semibold text-primary uppercase tracking-widest text-[#0076FF]">
          {doctor.specialization}
        </span>
        <h3 className="text-lg md:text-xl font-bold text-[#06152D] mt-1 group-hover:text-primary transition-colors duration-200">
          {doctor.name}
        </h3>

        {/* Rating and Experience Info */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-semibold text-[#5B6470]">
            {doctor.experience}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            <span className="text-xs font-bold text-slate-700">
              {doctor.rating}
            </span>
          </div>
        </div>

        {/* View Profile Call-to-Action */}
        <a
          href={doctor.profileLink}
          className="mt-5 block w-full rounded-2xl bg-slate-50 py-3 text-center text-xs font-bold text-[#06152D] group-hover:bg-[#0076FF] group-hover:text-white transition-all duration-300 border border-slate-100 group-hover:border-[#0076FF]"
        >
          {doctor.buttonText}
        </a>
      </div>
    </motion.div>
  );
};

export default function SpecialistSection() {
  const specialists = useSelector((state) => {
    console.log("REDUX STATE:", state);
    return (
      state.specialists?.specialists || state.specialist?.specialists || []
    );
  });
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Background WebGL-like Canvas particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = 35;

    class FlowParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 3 + 1.5;
        this.speed = Math.random() * 0.3 + 0.15;
        this.angle = Math.random() * Math.PI * 2;
      }
      update() {
        this.angle += (Math.random() - 0.5) * 0.05;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 118, 255, 0.12)";
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new FlowParticle());
    }

    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // GSAP scroll trigger animations for text headers
  useEffect(() => {
    gsap.fromTo(
      containerRef.current.querySelector(".specialist-header"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current.querySelector(".specialist-header"),
          start: "top 80%",
        },
      },
    );
  }, []);

  // Duplicate the list items for infinite marquee loop
  const marqueeItems = [...specialists, ...specialists, ...specialists];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 bg-gradient-to-b from-white to-slate-50/40 overflow-hidden"
    >
      {/* Floating Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="relative z-10 w-full">
        {/* Section Header */}
        <div className="specialist-header max-w-7xl mx-auto px-6 md:px-12 mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,118,255,0.1)] text-[#0076FF] font-semibold text-xs uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0076FF]" />
            Meet Our Specialists
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#06152D] mb-4">
            Expertise You Can Trust
          </h2>
          <p className="text-[#5B6470] text-lg max-w-2xl">
            Our team of dedicated, board-certified clinical specialists delivers
            personalized treatment and world-class care.
          </p>
        </div>

        {/* Text Marquee Ticker */}
        <div className="w-full overflow-hidden py-4 bg-slate-50/60 border-y border-slate-100/80 mb-12 flex relative">
          <div className="flex gap-16 whitespace-nowrap animate-marquee">
            {[1, 2, 3].map((setIndex) => (
              <div
                key={setIndex}
                className="flex gap-16 items-center text-sm font-extrabold text-[#5B6470]/50 tracking-[0.2em] uppercase"
              >
                <span>CLINICAL EXCELLENCE</span>
                <span className="text-[#0076FF]">•</span>
                <span>COMPASSIONATE CARE</span>
                <span className="text-[#0076FF]">•</span>
                <span>PIONEERING RESEARCH</span>
                <span className="text-[#0076FF]">•</span>
                <span>24/7 PATIENT SUPPORT</span>
                <span className="text-[#0076FF]">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Infinite Loop Doctor Cards Marquee */}
        <div className="relative w-full overflow-hidden flex py-8 px-4 mask-gradient">
          <div className="flex gap-8 whitespace-nowrap animate-infinite-scroll hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
            {marqueeItems.map((doctor, idx) => (
              <div
                key={`${doctor.id}-${idx}`}
                className="inline-block whitespace-normal"
              >
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind Animation Styles injection */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 45s linear infinite;
        }
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
        }
      `}</style>
    </section>
  );
}
