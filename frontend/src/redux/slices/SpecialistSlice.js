import { createSlice } from "@reduxjs/toolkit";
import arjunImage from "../../assets/doctors/b1.png"
import priyaImage from "../../assets/doctors/g1.png"
import rohitImage from "../../assets/doctors/b2.png"
import nehaImage from "../../assets/doctors/g1.png"
import sameerImage from "../../assets/doctors/b1.png"

const initialState = {
  specialists : [
    {
    id: 1,
    name: "Dr. Arjun Mehta",
    specialization: "Cardiologist",
    experience: "15 Years Exp.",
    rating: 4.9,
    image: arjunImage,
    buttonText: "View Profile",
    profileLink: "/doctors/arjun-mehta",
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialization: "Neurologist",
    experience: "12 Years Exp.",
    rating: 4.8,
    image: priyaImage,
    buttonText: "View Profile",
    profileLink: "/doctors/priya-sharma",
  },
  {
    id: 3,
    name: "Dr. Rohit Verma",
    specialization: "Orthopedic Surgeon",
    experience: "14 Years Exp.",
    rating: 4.9,
    image: rohitImage,
    buttonText: "View Profile",
    profileLink: "/doctors/rohit-verma",
  },
  {
    id: 4,
    name: "Dr. Neha Kapoor",
    specialization: "Gynecologist",
    experience: "10 Years Exp.",
    rating: 4.8,
    image: nehaImage,
    buttonText: "View Profile",
    profileLink: "/doctors/neha-kapoor",
  },
  {
    id: 5,
    name: "Dr. Sameer Khan",
    specialization: "Pediatrician",
    experience: "11 Years Exp.",
    rating: 4.9,
    image: sameerImage,
    buttonText: "View Profile",
    profileLink: "/doctors/sameer-khan",
  },
  ]
};

const specialistSlice = createSlice({
  name: "specialists",
  initialState,
  reducers: {},
});


export default specialistSlice.reducer;