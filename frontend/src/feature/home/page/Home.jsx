import ConstructionHero from "../components/ConstructionHero";
import AboutSection from "../components/AboutSection";
import DepartmentSection from "../components/DepartmentSection";
import SpecialistSection from "../components/SpecialistSection";
import FacilitesCard from "../components/facilites/FacilitesCard";

const Home = () => {
  return (
    <>
      <div>
        <ConstructionHero />
      </div>
      <div className="flex justify-center flex-wrap p-4">
        {" "}
        <p className="text-center text-lg w-2/3 text-wrap">
          A powerful and user-friendly Hospital Management System designed to
          simplify and streamline healthcare operations. From patient
          registration and appointment scheduling to doctor management, medical
          records, billing, pharmacy, and staff management, the system brings
          everything together in one centralized platform. Built for efficiency,
          accuracy, and better patient care, it helps hospitals reduce manual
          work, improve data management, and deliver a seamless experience for
          both healthcare professionals and patients.
        </p>
      </div>
      <AboutSection />

      <DepartmentSection />

      <SpecialistSection />

      
      <FacilitesCard />
    </>
  );
};

export default Home;
