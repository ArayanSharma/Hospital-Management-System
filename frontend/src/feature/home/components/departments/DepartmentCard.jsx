const DepartmentCard = ({ department }) => {
  return (
    <div className="flex-1 min-w-[180px] rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

      <img
        src={department.image}
        alt={department.title}
        className="mb-4 h-10 w-10 object-contain"
      />

      <h3 className="mb-2 text-base font-semibold text-gray-900">
        {department.title}
      </h3>

      <p className="mb-5 text-sm leading-6 text-gray-500">
        {department.description}
      </p>

      <a
        href={department.link}
        className="text-sm font-semibold text-blue-600"
      >
        {department.buttonText} →
      </a>

    </div>
  );
};

export default DepartmentCard;