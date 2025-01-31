export function RegisterProgress({ currentStep, totalSteps }) {
    return (
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between px-4">
          {[...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                  ${index < currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : index === currentStep
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-300 text-gray-300'
                  }`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div 
                  className={`w-full h-1 mt-4 
                    ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  