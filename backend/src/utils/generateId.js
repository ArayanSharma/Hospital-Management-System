//human-readable ID generator -Healthcare systems mein doctorId, patientId jaise readable IDs chahiye hote hain (sirf MongoDB _id kaafi nahi, receptionist ko bolna hoga "DOC-0001", MongoDB ObjectId nahi).

export const generateSequentialId = async (Model, prefix, field = "doctorId") => {
  const lastDoc = await Model.findOne().sort({ createdAt: -1 });

  let nextNumber = 1;
  if (lastDoc && lastDoc[field]) {
    const lastNumber = parseInt(lastDoc[field].split("-")[1], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(4, "0")}`;
  // Example: "DOC-0001", "DOC-0002"
};