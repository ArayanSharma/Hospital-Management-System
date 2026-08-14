import { useSelector } from "react-redux";
import DepartmentCard from "./DepartmentCard";

const DepartmentGrid = () => {

  const departments = useSelector(
    (state) => state.departments.departments
  );

  return (
    <div className="flex flex-wrap gap-4">
      {departments.map((department) => (
        <DepartmentCard
          key={department.id}
          department={department}
        />
      ))}
    </div>
  );
};

export default DepartmentGrid;