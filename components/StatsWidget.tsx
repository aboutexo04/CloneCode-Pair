import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Step, StepStatus, ChartData } from '../types';

interface StatsWidgetProps {
  steps: Step[];
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ steps }) => {
  if (steps.length === 0) return null;

  const completed = steps.filter(s => s.status === StepStatus.COMPLETED).length;
  const remaining = steps.length - completed;
  const percentage = Math.round((completed / steps.length) * 100);

  const data: ChartData[] = [
    { name: 'Completed', value: completed, fill: '#10b981' }, // emerald-500
    { name: 'Remaining', value: remaining, fill: '#374151' }, // gray-700
  ];

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
      <div>
        <h4 className="text-sm font-semibold text-gray-300">Project Progress</h4>
        <div className="text-2xl font-bold text-white mt-1">{percentage}%</div>
        <p className="text-xs text-gray-500">{completed} of {steps.length} steps done</p>
      </div>
      
      <div className="h-16 w-16">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={18}
              outerRadius={28}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '4px', fontSize: '12px' }}
                itemStyle={{ color: '#e5e7eb' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};