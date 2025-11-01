import React from 'react';

interface ProgressTrackerProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex items-center w-full mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                index === currentStep
                  ? 'bg-indigo-600 text-white scale-125 shadow-lg'
                  : index < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {index < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`flex-1 h-1 transition-all duration-300 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressTracker;
