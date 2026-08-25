// "09:00" -> 540 (minutes since midnight) — comparison ke liye
const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Do time ranges overlap karte hain ya nahi
export const isTimeOverlapping = (startA, endA, startB, endB) => {
  const startAMin = toMinutes(startA);
  const endAMin = toMinutes(endA);
  const startBMin = toMinutes(startB);
  const endBMin = toMinutes(endB);

  return startAMin < endBMin && startBMin < endAMin;
};