import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  FileText,
  FileEdit,
  DollarSign,
  Image,
  Layers,
  Tag,
  Key,
  Settings,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const iconMap = {
  FileText,
  FileEdit,
  DollarSign,
  Image,
  Layers,
  Tag,
  Key,
  Settings,
};

interface StepIndicatorProps {
  steps: { key: string; icon: keyof typeof iconMap }[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  const t = useTranslations();
  const isSmallScreen = useMediaQuery('(max-width: 640px)'); // adjust breakpoint as needed

  // Determine which steps to display on small screens
  const getVisibleSteps = () => {
    if (!isSmallScreen) return steps; // show all on large screens

    // On small screens, show only:
    // - completed steps (index <= currentStep)
    // - the next step (if exists) to hint at progress
    // You can adjust this logic as needed
    const maxVisible = 3; // e.g., show up to 3 steps
    const start = Math.max(0, currentStep - 1); // show previous, current, next
    const end = Math.min(steps.length, start + maxVisible);
    return steps.slice(start, end);
  };

  const visibleSteps = getVisibleSteps();
  // We need to map back to original indices for correct active/completed state
  const visibleIndices = visibleSteps.map(step => steps.findIndex(s => s.key === step.key));

  return (
    <div className="flex items-center justify-between mb-8">
      {visibleSteps.map((step, idx) => {
        const originalIndex = steps.findIndex(s => s.key === step.key);
        const Icon = iconMap[step.icon];
        const isActive = originalIndex === currentStep;
        const isCompleted = originalIndex < currentStep;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onStepClick(originalIndex)}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all
                  cursor-pointer
                  ${isActive
                    ? 'border-[#FF7642] bg-[#FFE6DB] text-[#FF7642]'
                    : isCompleted
                      ? 'border-[#FF7642] bg-[#FF7642] text-white'
                      : 'border-gray-300 bg-white text-gray-400 hover:border-[#FFB28A]'
                  }
                `}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Hide labels on small screens, show only for active step optionally */}
              {!isSmallScreen && (
                <span className="text-xs mt-2 font-medium text-gray-600">
                  {t(`${step.key}`)}
                </span>
              )}
              {isSmallScreen && isActive && (
                <span className="text-xs mt-1 font-medium text-gray-600">
                  {step.key}
                </span>
              )}
            </div>

            {/* Only show connector line if there is a next step in visible list */}
            {idx < visibleSteps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-1 sm:mx-2 transition-all
                  ${originalIndex < currentStep ? 'bg-[#FF7642]' : 'bg-gray-300'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;