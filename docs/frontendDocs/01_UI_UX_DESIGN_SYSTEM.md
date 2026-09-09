# 01. UI/UX Design System & Theme Engine

Welcome to the **UI/UX Design System Specification** for the Hospital Management System (HMS). This design system ensures visual excellence, responsive layout consistency, dynamic data visualization, and accessibility across all 25 clinical modules.

---

## 🎨 Color Palette & Aesthetic Foundations

The HMS interface uses a modern, healthcare-tailored slate and vibrant color palette with soft contrast borders, subtle shadows, and glassmorphic overlays.

### Core Color Palette Tokens

| Category | Tailwind Class | HEX / HSL | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `bg-blue-600` | `#2563EB` | Primary buttons, active tab indicators, header accents |
| **Success / Positive** | `bg-emerald-500` | `#10B981` | Paid status, positive growth trends, active staff indicators |
| **Warning / Caution** | `bg-amber-500` | `#F59E0B` | Low stock inventory alerts, pending claims, today's appointments |
| **Danger / High Alert** | `bg-rose-500` | `#EF4444` | Expiring items, uncollected dues, cancelled visits |
| **Purple / Specialty** | `bg-purple-600` | `#8B5CF6` | Currently admitted IPD beds, lab diagnostics, special roles |
| **Cyan / Operational** | `bg-cyan-600` | `#06B6D4` | Active staff status, radiology scans |
| **Background / Canvas** | `bg-slate-50` | `#F8FAFC` | Main application backdrop |
| **Card / Surface** | `bg-white` | `#FFFFFF` | Dashboard widgets, modal panels, table wrappers |
| **Border System** | `border-slate-200/80` | `rgba(226, 232, 240, 0.8)` | Soft contrast separation lines |

---

## 📊 Data Visualization & Dynamic Components

### 1. Mini SVG Sparklines
Used in stat counter cards to show historical trend context without occupying vertical dashboard real estate:

```jsx
const Sparkline = ({ color = "#2563EB", points = [10, 25, 18, 30, 22, 38, 32] }) => {
  const width = 120;
  const height = 30;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const normalizedPoints = points.map((p, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={`M ${normalizedPoints.join(" L ")}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
```

### 2. Donut & Area Charts (Recharts Integration)
- **Role-Wise Distribution & Appointment Status**: Custom inner radius pie charts with center statistics overlay.
- **Patient Registration & Financial Trends**: Smooth monotone area graphs with linear opacity gradients.

---

## 💀 Loading State Strategy: Skeleton Loading vs Spinners

To avoid layout shifts during asynchronous data fetching, HMS implements **Skeleton Loading Components** (`DashboardSkeleton.jsx`, `LabStatCards.jsx` skeleton mode):

```jsx
// Skeleton Pulse Base Component
<div className="animate-pulse bg-slate-200 rounded-xl h-24 w-full" />
```

### Skeleton Rules:
1. **Match Container Dimensions**: Skeletons maintain the exact grid layout of loaded widgets.
2. **Smooth Pulse Animation**: Uses Tailwind `animate-pulse` with soft neutral tones (`bg-slate-100` / `bg-slate-200`).
3. **No Layout Shift**: Cards do not resize when data transitions from loading to loaded state.

---

## ♿ Accessibility & Micro-Interactions

1. **Focus States**: Interactive elements use `focus:ring-2 focus:ring-blue-500/20 focus:outline-none`.
2. **Hover Animations**: Buttons and table rows feature smooth `transition-all duration-200 hover:shadow-md hover:border-slate-300` responses.
3. **Modal Esc Keys & Outside Click Hooks**: All modals incorporate `useEffect` listeners to dismiss popovers cleanly when clicking outside container boundaries.
