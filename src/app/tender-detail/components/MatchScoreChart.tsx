'use client';
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface MatchScoreChartProps {
  score: number;
}

export default function MatchScoreChart({ score }: MatchScoreChartProps) {
  const data = [
    { value: score, fill: score >= 85 ? 'var(--success)' : score >= 70 ? 'var(--accent)' : 'var(--muted-foreground)' },
  ];

  return (
    <div className="w-20 h-20 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={8}
        >
          <RadialBar
            background={{ fill: 'var(--muted)' }}
            dataKey="value"
            cornerRadius={4}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
