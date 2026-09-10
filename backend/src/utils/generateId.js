// human-readable ID generator - Healthcare systems require readable IDs (e.g. "DOC-0001", "PAT-1048", "INV-2026-0001").

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const generateSequentialId = async (Model, prefix, field = "doctorId") => {
  const cleanPrefix = prefix.endsWith("-") ? prefix.slice(0, -1) : prefix;
  const regex = new RegExp(`^${escapeRegExp(cleanPrefix)}-?(\\d+)$`);

  // 1. Fetch existing IDs matching the prefix format
  const docs = await Model.find({ [field]: regex }, { [field]: 1 }).lean();

  let maxNum = 0;
  for (const doc of docs) {
    const val = doc[field];
    if (val) {
      const match = String(val).match(regex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  // 2. Compute next number
  let nextNumber = maxNum > 0 ? maxNum + 1 : 1;

  // Preserve 4-digit padding minimum (e.g., PAT-1048 or PAT-0001)
  const padLength = Math.max(4, String(nextNumber).length);
  let candidateId = `${cleanPrefix}-${String(nextNumber).padStart(padLength, "0")}`;

  // 3. Collision guard against DB (including soft-deleted documents holding unique index)
  let exists = await Model.exists({ [field]: candidateId });
  while (exists) {
    nextNumber++;
    candidateId = `${cleanPrefix}-${String(nextNumber).padStart(padLength, "0")}`;
    exists = await Model.exists({ [field]: candidateId });
  }

  return candidateId;
};