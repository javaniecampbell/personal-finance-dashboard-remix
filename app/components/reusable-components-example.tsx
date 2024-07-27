import React, { useState } from 'react';
import MultiStepForm from '~/components/MultiStepForm';
import SideDrawer from '~/components/SideDrawer';

const Step1 = ({ formData, handleInputChange }) => (
  <div>
    <label className="block mb-2">
      Name:
      <input
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
    </label>
  </div>
);

const Step2 = ({ formData, handleInputChange }) => (
  <div>
    <label className="block mb-2">
      Email:
      <input
        type="email"
        name="email"
        value={formData.email || ''}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
    </label>
  </div>
);

const Step3 = ({ formData, handleInputChange }) => (
  <div>
    <label className="block mb-2">
      Message:
      <textarea
        name="message"
        value={formData.message || ''}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
    </label>
  </div>
);

const ReusableComponentsExample = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formResult, setFormResult] = useState(null);

  const formSteps = [
    { title: 'Personal Information', component: Step1 },
    { title: 'Contact Information', component: Step2 },
    { title: 'Additional Information', component: Step3 },
  ];

  const handleFormSubmit = (data) => {
    setFormResult(data);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reusable Components Example</h1>
      
      <MultiStepForm steps={formSteps} onSubmit={handleFormSubmit} />

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Form Result"
        position="right"
        width="400px"
      >
        {formResult && (
          <div>
            <p><strong>Name:</strong> {formResult.name}</p>
            <p><strong>Email:</strong> {formResult.email}</p>
            <p><strong>Message:</strong> {formResult.message}</p>
          </div>
        )}
      </SideDrawer>
    </div>
  );
};

export default ReusableComponentsExample;
