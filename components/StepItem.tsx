import React from 'react';
import { Step, StepStatus } from '../types';
import { CheckCircle2, Circle, PlayCircle, Lock } from 'lucide-react';

interface StepItemProps {
  step: Step;
  isActive: boolean;
  onClick: (step: Step) => void;
  onStatusChange: (id: number, status: StepStatus) => void;
}

export const StepItem: React.FC<StepItemProps> = ({ step, isActive, onClick, onStatusChange }) => {
  const isCompleted = step.status === StepStatus.COMPLETED;
  const isInProgress = step.status === StepStatus.IN_PROGRESS;

  return (
    <div 
      className={`
        p-4 rounded-lg border transition-all duration-200 cursor-pointer mb-3
        ${isActive 
          ? 'bg-blue-900/20 border-blue-500/50 shadow-lg shadow-blue-900/20' 
          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
        }
      `}
      onClick={() => onClick(step)}
    >
      <div className="flex items-start gap-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const nextStatus = isCompleted ? StepStatus.PENDING : StepStatus.COMPLETED;
            onStatusChange(step.id, nextStatus);
          }}
          className="mt-1 focus:outline-none"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isInProgress ? (
            <PlayCircle className="w-5 h-5 text-blue-400 animate-pulse" />
          ) : (
            <Circle className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className={`font-semibold text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
              Step {step.id}: {step.title}
            </h3>
          </div>
          <p className={`text-xs ${isCompleted ? 'text-gray-500' : 'text-gray-400'} line-clamp-2`}>
            {step.description}
          </p>
        </div>
        
        {isActive && (
           <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
        )}
      </div>
    </div>
  );
};
