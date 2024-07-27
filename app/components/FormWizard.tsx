import React, { useState, createContext, useContext } from 'react';

// Form Wizard Context
const FormWizardContext = createContext();

const useFormWizard = () => {
  const context = useContext(FormWizardContext);
  if (!context) {
    throw new Error('useFormWizard must be used within a FormWizardProvider');
  }
  return context;
};

export const FormWizardProvider = ({ children, initialValues, onSubmit }) => {
  const [formData, setFormData] = useState(initialValues);
  const [currentStep, setCurrentStep] = useState(0);

  const updateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormWizardContext.Provider value={{ formData, updateFormData, currentStep, nextStep, prevStep, handleSubmit }}>
      {children}
    </FormWizardContext.Provider>
  );
};

const FormField = ({ field }) => {
  const { formData, updateFormData } = useFormWizard();

  const handleChange = (e) => {
    updateFormData({ [field.name]: e.target.value });
  };

  switch (field.type) {
    case 'select':
      return (
        <select
          id={field.name}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    case 'textarea':
      return (
        <textarea
          id={field.name}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
        />
      );
    default:
      return (
        <input
          type={field.type}
          id={field.name}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        />
      );
  }
};

export const FormWizard = ({ steps }) => {
  const { currentStep, nextStep, prevStep, handleSubmit } = useFormWizard();

  const currentStepData = steps[currentStep];

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{currentStepData.title}</h3>
      {currentStepData.fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
          <FormField field={field} />
        </div>
      ))}
      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  );
};

// Usage example:
const ExampleFormWizard = () => {
  const steps = [
    {
      title: 'Basic Information',
      fields: [
        { name: 'name', label: 'Product Name', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: ['Electronics', 'Clothing', 'Books'] },
      ],
    },
    {
      title: 'Pricing',
      fields: [
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'discount', label: 'Discount (%)', type: 'number' },
      ],
    },
    {
      title: 'Description',
      fields: [
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
  ];

  const handleSubmit = (formData) => {
    console.log('Form submitted with data:', formData);
    // Here you would typically send the data to your server
  };

  return (
    <FormWizardProvider initialValues={{}} onSubmit={handleSubmit}>
      <FormWizard steps={steps} />
    </FormWizardProvider>
  );
};

export default ExampleFormWizard;
