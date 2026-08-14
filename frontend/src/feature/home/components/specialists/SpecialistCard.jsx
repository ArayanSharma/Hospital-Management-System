const SpecialistCard = ({ doctor }) => {
  return (
    <div className="flex-1 min-w-[190px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

      {/* Doctor Image */}
      <img
        src={doctor.image}
        alt={doctor.name}
        className="h-[125px] w-full object-cover"
      />

      {/* Content */}
      <div className="p-3">

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900">
          {doctor.name}
        </h3>

        {/* Specialization */}
        <p className="mt-1 text-xs text-gray-500">
          {doctor.specialization}
        </p>

        {/* Experience + Rating */}
        <div className="mt-2 flex items-center justify-between">

          <span className="text-xs text-gray-500">
            {doctor.experience}
          </span>

          <span className="text-xs text-gray-700">
            ⭐ {doctor.rating}
          </span>

        </div>

        {/* Button */}
        <a
          href={doctor.profileLink}
          className="mt-3 block rounded-md bg-cyan-600 px-3 py-2 text-center text-xs font-medium text-white transition hover:bg-cyan-700"
        >
          {doctor.buttonText}
        </a>

      </div>
    </div>
  );
};

export default SpecialistCard;