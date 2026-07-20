"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface CategorySlice {
  name: string;
  value: number;
}

// DESIGN palette. Ordered saturated-first (peach, bistre, codium) so the most
// common categories get high-contrast slices; the two pale creams (champagne,
// ivory) fall to the smallest slices and still get a bistre outline via the
// Pie stroke so they stay visible on the light card.
const PALETTE = ["#DB918F", "#837534", "#4F5127", "#F8EEC2", "#F9EAD2"];

export default function AnalyticsChart({ data }: { data: CategorySlice[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            stroke="#837534"
            strokeWidth={1}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={PALETTE[index % PALETTE.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
