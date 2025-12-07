// components/checkout/CheckoutSteps.js - Mathematical Version
export default function CheckoutSteps({ currentStep }) {
  const steps = [
    { id: 'shipping', name: 'Shipping', description: 'Address information' },
    { id: 'payment', name: 'Payment', description: 'Payment method' },
    { id: 'review', name: 'Review', description: 'Order confirmation' }
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  // Calculate positions mathematically
  const totalSteps = steps.length;
  const stepWidth = 100 / (totalSteps - 1); // Percentage between steps
  
  const progressBarStart = (100 / totalSteps) / 2; // Center of first step
  const progressBarEnd = 100 - progressBarStart;   // Center of last step
  const progressBarWidth = progressBarEnd - progressBarStart;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <nav aria-label="Progress">
        <div className="relative">
          {/* Progress bar background */}
          <div 
            className="absolute top-4 h-0.5 bg-gray-200 transform -translate-y-1/2"
            style={{ 
              left: `${progressBarStart}%`,
              width: `${progressBarWidth}%`
            }}
          ></div>
          
          {/* Progress bar fill */}
          <div 
            className="absolute top-4 h-0.5 bg-primary-600 transform -translate-y-1/2 transition-all duration-300"
            style={{ 
              left: `${progressBarStart}%`,
              width: `${(currentIndex / (totalSteps - 1)) * progressBarWidth}%`
            }}
          ></div>

          {/* Steps */}
          <ol className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <li key={step.id} className="relative flex-1 flex justify-center">
                  <div className="flex flex-col items-center text-center">
                    {/* Step circle */}
                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isCompleted
                        ? 'bg-primary-600 text-white shadow-sm'
                        : isCurrent
                        ? 'border-2 border-primary-600 bg-white text-primary-600 shadow-sm'
                        : 'border-2 border-gray-300 bg-white text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs font-semibold">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Step labels */}
                    <div className="flex flex-col items-center">
                      <span className={`text-sm font-medium transition-colors ${
                        isCompleted || isCurrent ? 'text-primary-600' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </span>
                      <span className={`text-xs transition-colors mt-1 ${
                        isCompleted || isCurrent ? 'text-primary-500' : 'text-gray-400'
                      } hidden sm:block`}>
                        {step.description}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </div>
  );
}