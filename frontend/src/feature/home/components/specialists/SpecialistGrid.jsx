import { useSelector } from "react-redux";
import SpecialistCard from "./SpecialistCard";

const SpecialistGrid = () => {
  const specialists = useSelector(
    (state) => state.specialists.specialists
  );

  return (
    <div className="flex flex-wrap gap-4">
      {specialists.map((doctor) => (
        <SpecialistCard
          key={doctor.id}
          doctor={doctor}
        />
      ))}
    </div>
  );
};

export default SpecialistGrid;