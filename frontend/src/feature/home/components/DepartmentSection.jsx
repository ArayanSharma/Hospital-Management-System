import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Custom medical SVGs mapped to titles
const DepartmentIcon = ({ title, color }) => {
  const svgProps = {
    className: "w-14 h-14 mb-5 transition-transform duration-300 group-hover:scale-110",
    style: { color },
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (title) {
    case "Cardiology":
      return (
        <svg {...svgProps}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h5.78" strokeWidth="1.5" />
        </svg>
      );
    case "Neurology":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M20 12h2M2 12h2M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
          <path d="M12 9a3 3 0 0 1 3 3" />
        </svg>
      );
    case "Orthopedics":
      return (
        <svg {...svgProps}>
          <path d="m15 4-3-1-3 1M12 3v18M6 8l6 3 6-3M6 16l6-3 6 3" />
        </svg>
      );
    case "Pediatrics":
      return (
        <svg {...svgProps}>
          <path d="M4 19c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v2H4v-2ZM12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        </svg>
      );
    case "Oncology":
      return (
        <svg {...svgProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "Emergency Medicine":
      return (
        <svg {...svgProps}>
          <path d="M19 5h-1.5V3.5A1.5 1.5 0 0 0 16 2H8a1.5 1.5 0 0 0-1.5 1.5V5H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z" />
          <path d="M12 9v6M9 12h6" />
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      );
  }
};

// 3D Card Hover Component using Framer Motion
const InteractiveCard = ({ department }) => {
  const cardRef = useRef(null);

  // Mouse positions
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 200 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
      className="group relative flex-1 min-w-[280px] max-w-[380px] rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-md hover:shadow-2xl transition-all duration-300 backdrop-blur-md overflow-hidden cursor-pointer"
    >
      {/* Dynamic Glow Overlay matching department's identity color */}
      <div 
        className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500"
        style={{ backgroundColor: department.color }}
      />

      <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
        <DepartmentIcon title={department.title} color={department.color} />
        
        <h3 className="mb-3 text-xl font-bold text-[#06152D] group-hover:text-primary transition-colors duration-300">
          {department.title}
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-[#5B6470]">
          {department.description}
        </p>

        <a
          href={department.link}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1.5 transition-all duration-300"
          style={{ color: department.color }}
        >
          {department.buttonText} 
          <span className="text-base">→</span>
        </a>
      </div>
    </motion.div>
  );
};

export default function DepartmentSection() {
  const departments = useSelector((state) => state.departments.departments);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Interactive Particle Backdrop System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = 45;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 118, 255, 0.15)";
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 118, 255, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
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

  // GSAP scroll trigger for headings and cards
  useEffect(() => {
    const cards = containerRef.current.querySelectorAll(".department-card-wrapper");

    // Header stagger reveal
    gsap.fromTo(
      containerRef.current.querySelector(".section-header"),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current.querySelector(".section-header"),
          start: "top 80%",
        },
      }
    );

    // Cards stagger slide up with perspective rotations
    gsap.fromTo(
      cards,
      { opacity: 0, y: 70, rotateY: -15, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        rotateY: 0,
        scale: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current.querySelector(".department-grid-wrapper"),
          start: "top 75%",
        },
      }
    );
  }, [departments]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 bg-gradient-to-b from-slate-50/50 to-white overflow-hidden"
    >
      {/* Canvas backdrop connection field */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="section-header text-left mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,118,255,0.1)] text-[#0076FF] font-semibold text-xs uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0076FF]" />
            Our Departments
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#06152D] mb-4">
            Comprehensive Care for Every Need
          </h2>
          <p className="text-[#5B6470] text-lg max-w-2xl">
            Experience clinical excellence across multiple medical fields, tailored around patient wellness, research, and expert care.
          </p>
        </div>

        {/* Dynamic Interactive Cards Grid */}
        <div className="department-grid-wrapper flex flex-wrap justify-start gap-8">
          {departments.map((department) => (
            <div key={department.id} className="department-card-wrapper">
              <InteractiveCard department={department} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
