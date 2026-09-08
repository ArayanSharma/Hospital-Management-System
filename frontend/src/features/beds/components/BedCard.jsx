import { Bed as BedIcon, User } from "lucide-react";
import { BED_STATUS_CONFIG } from "../bedStatusConfig.js";

export default function BedCard({ bed, onClick }) {
  const config = BED_STATUS_CONFIG[bed.status] || BED_STATUS_CONFIG.available;

  return (
    <button
      onClick={() => onClick(bed)}
      className={`aspect-square rounded-lg border-2 p-3 flex flex-col items-center justify-center gap-1 transition hover:shadow-md ${config.color}`}
    >
      <BedIcon className="w-5 h-5" />
      <p className="text-xs font-semibold">{bed.bedNumber}</p>
      {bed.status === "occupied" && bed.currentPatientId && (
        <p className="text-[10px] truncate max-w-full flex items-center gap-0.5">
          <User className="w-2.5 h-2.5" /> {bed.currentPatientId.name}
        </p>
      )}
    </button>
  );
}
