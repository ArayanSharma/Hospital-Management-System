"use client";

import ScrollableCardStack from "../../../../components/smoothui/scrollable-card-stack/index.jsx";

export default function FacilitesCard() {

  const cardData = [
    {
      id: "emergency-room",
      title: "Emergency Care (ER)",
      tag: "24/7 Urgent Care",
      description: "Immediate medical attention for critical illnesses and traumatic injuries. Equipped with life support systems and staffed by emergency care specialists.",
      features: [
        "Trauma & resuscitation bays",
        "24/7 dedicated ambulance support",
        "Immediate cardiac intervention",
      ],
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "cardiology",
      title: "Cardiology Center",
      tag: "Heart Health",
      description: "Advanced cardiac diagnostics, non-invasive therapies, and state-of-the-art surgical intervention. Your heart's health is managed by top cardiologists.",
      features: [
        "Digital Cardiac Cath Lab",
        "ECG, Echo, & stress testing",
        "Pacemaker & stenting services",
      ],
      image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "diagnostics",
      title: "Advanced Diagnostics",
      tag: "Imaging & Lab",
      description: "High-precision diagnostic imaging and full-scale pathology laboratory services. Fast, accurate reports to guide precise treatment planning.",
      features: [
        "High-definition MRI & CT Scans",
        "Fully automated clinical pathology",
        "Ultrasonography & Digital X-ray",
      ],
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "icu",
      title: "Intensive Care Unit (ICU)",
      tag: "Critical Care",
      description: "Specialized constant monitoring and intensive treatment for life-threatening conditions. Our multidisciplinary team is available round-the-clock.",
      features: [
        "Advanced mechanical ventilators",
        "Constant vital signs monitoring",
        "Expert critical care physicians",
      ],
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl py-16 px-4 text-center">
      {/* Premium Header */}
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="h-[2px] w-8 bg-primary rounded-full"></span>
          <span className="text-xs font-extrabold tracking-widest text-primary uppercase">MEET SERVICES</span>
          <span className="h-[2px] w-8 bg-primary rounded-full"></span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-heading max-w-2xl leading-tight">
          World-class care with <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">world-class facilities</span>
        </h2>
        <p className="mt-4 text-text-main max-w-lg text-base md:text-lg">
          Explore our state-of-the-art medical departments, specialized treatment options, and patient-centric healthcare services.
        </p>
      </div>

      <ScrollableCardStack
        cardHeight={550}
        cardWidth={1120}
        className="mx-auto"
        items={cardData}
        perspective={1200}
        transitionDuration={200}
      />
    </div>
  );
}
