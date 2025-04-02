import React from "react";
import { PieChart, Pie } from "recharts";

export function RadialProgressIndicator({
  passedChecks,
  totalChecks,
}: {
  passedChecks: number;
  totalChecks: number;
}) {
  const isComplete = passedChecks === totalChecks;
  const isBlank = totalChecks === 0;

  return (
    <div
      role="progressbar"
      aria-label={`Progress: ${passedChecks} of ${totalChecks} checks passing`}
    >
      {isBlank && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM2.9688 12C2.9688 16.9878 7.01221 21.0312 12 21.0312C16.9878 21.0312 21.0312 16.9878 21.0312 12C21.0312 7.01221 16.9878 2.9688 12 2.9688C7.01221 2.9688 2.9688 7.01221 2.9688 12Z"
            fill="#E5E7EB"
          />
        </svg>
      )}

      {!isBlank && isComplete && (
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 12.5C24 19.1274 18.6274 24.5 12 24.5C5.37258 24.5 0 19.1274 0 12.5C0 5.87258 5.37258 0.5 12 0.5C18.6274 0.5 24 5.87258 24 12.5ZM2.9688 12.5C2.9688 17.4878 7.01221 21.5312 12 21.5312C16.9878 21.5312 21.0312 17.4878 21.0312 12.5C21.0312 7.51221 16.9878 3.4688 12 3.4688C7.01221 3.4688 2.9688 7.51221 2.9688 12.5Z"
            fill="#F3F4F6"
          />
          <path
            d="M24 12.5C24 19.1274 18.6274 24.5 12 24.5C5.37258 24.5 0 19.1274 0 12.5C0 5.87258 5.37258 0.5 12 0.5C18.6274 0.5 24 5.87258 24 12.5ZM2.9688 12.5C2.9688 17.4878 7.01221 21.5312 12 21.5312C16.9878 21.5312 21.0312 17.4878 21.0312 12.5C21.0312 7.51221 16.9878 3.4688 12 3.4688C7.01221 3.4688 2.9688 7.51221 2.9688 12.5Z"
            fill="url(#paint0_radial_9082_31183)"
          />
          <path d="M7.5 12L11 15.5L16.5 9" stroke="#6366F1" strokeWidth="2" />
          <defs>
            <radialGradient
              id="paint0_radial_9082_31183"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(12 23.5) rotate(-90) scale(23.5 18.5)"
            >
              <stop stopColor="#8976FD" />
              <stop offset="0.496458" stopColor="#6A83FD" />
              <stop offset="1" stopColor="#5A8DFD" />
            </radialGradient>
          </defs>
        </svg>
      )}

      {!isBlank && !isComplete && (
        <PieChart width={24} height={24}>
          <defs>
            <linearGradient id="pieGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8976FD" />
              <stop offset="100%" stopColor="#5A8DFD" />
            </linearGradient>
          </defs>
          <Pie
            data={[
              {
                name: "Passed",
                value: Math.round(passedChecks),
                fill: "url(#pieGradient)",
              },
              {
                name: "Failed",
                value: Math.round(totalChecks - passedChecks),
                fill: "#E5E7EB", // gray-200 for the background
              },
            ]}
            isAnimationActive={false}
            dataKey="value"
            innerRadius={8}
            outerRadius={12}
            startAngle={90}
            endAngle={-270}
          />
        </PieChart>
      )}
    </div>
  );
}
