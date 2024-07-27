import React, { useState } from 'react';

const MultiStepForm = ({ steps, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (currentStep === steps.length - 1) {
      onSubmit(formData);
    } else {
      handleNext();
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      <CurrentStepComponent 
        formData={formData} 
        handleInputChange={handleInputChange} 
      />

      <div className="mt-6 flex justify-between">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Previous
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  );
};

export default MultiStepForm;
