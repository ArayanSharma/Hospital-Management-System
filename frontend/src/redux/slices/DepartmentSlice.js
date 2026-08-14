import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departments: [
    {
      id: 1,
      title: "Cardiology",
      description: "Comprehensive heart, artery, and vascular care with state-of-the-art diagnostics and keyhole surgeries.",
      image: "/images/cardiology.png",
      buttonText: "Explore",
      link: "/departments/cardiology",
      color: "#FF4D6D",
    },
    {
      id: 2,
      title: "Neurology",
      description: "Advanced neurological treatments for brain disorders, spinal cord injuries, and nervous system health.",
      image: "/images/neurology.png",
      buttonText: "Explore",
      link: "/departments/neurology",
      color: "#0076FF",
    },
    {
      id: 3,
      title: "Orthopedics",
      description: "Expert therapeutic and surgical care for joints, bones, ligaments, muscles, and sports injuries.",
      image: "/images/orthopedics.png",
      buttonText: "Explore",
      link: "/departments/orthopedics",
      color: "#2EC4B6",
    },
    {
      id: 4,
      title: "Pediatrics",
      description: "Dedicated compassionate healthcare services, vaccinations, and wellness programs for kids.",
      image: "/images/pediatrics.png",
      buttonText: "Explore",
      link: "/departments/pediatrics",
      color: "#FFB703",
    },
    {
      id: 5,
      title: "Oncology",
      description: "Targeted immunotherapy, precision chemotherapy, and comprehensive cancer rehabilitation support.",
      image: "/images/oncology.png",
      buttonText: "Explore",
      link: "/departments/oncology",
      color: "#7209B7",
    },
    {
      id: 6,
      title: "Emergency Medicine",
      description: "Rapid-response 24/7 trauma care center equipped to handle life-threatening situations.",
      image: "/images/emergency.png",
      buttonText: "Explore",
      link: "/departments/emergency",
      color: "#E63946",
    },
  ],
};

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
});

export default departmentSlice.reducer;