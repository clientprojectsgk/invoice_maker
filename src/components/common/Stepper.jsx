import { HiOutlineCheck } from 'react-icons/hi';

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center w-full mb-6 pb-6 border-b border-gray-200">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCompleted ? 'bg-primary-600 text-white' : isCurrent ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <HiOutlineCheck className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-sm hidden sm:block ${isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${isCompleted ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
