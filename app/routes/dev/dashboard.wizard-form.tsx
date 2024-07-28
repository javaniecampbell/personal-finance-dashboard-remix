import { useState, createContext, useContext } from 'react';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';
import Layout from '~/components/Layout';

// Form Wizard Context
const FormWizardContext = createContext();

const useFormWizard = () => {
  const context = useContext(FormWizardContext);
  if (!context) {
    throw new Error('useFormWizard must be used within a FormWizardProvider');
  }
  return context;
};

const FormWizardProvider = ({ children, initialValues }) => {
  const [formData, setFormData] = useState(initialValues);
  const [currentStep, setCurrentStep] = useState(0);

  const updateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <FormWizardContext.Provider value={{ formData, updateFormData, currentStep, nextStep, prevStep }}>
      {children}
    </FormWizardContext.Provider>
  );
};

// Example multi-step form for creating a new product
const ProductForm = () => {
  const { formData, updateFormData, currentStep, nextStep, prevStep } = useFormWizard();
  const actionData = useActionData();
  const transition = useNavigation();

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

  const currentStepData = steps[currentStep];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      nextStep();
    } else {
      // Submit the form
      e.target.submit();
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{currentStepData.title}</h3>
      {currentStepData.fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            />
          )}
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
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={transition.state === "submitting"}
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
      {actionData?.error && (
        <p className="text-red-500 mt-2">{actionData.error}</p>
      )}
    </Form>
  );
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);
  const formData = await request.formData();
  const productData = Object.fromEntries(formData);

  // Here you would typically save the product data to your database
  console.log('Submitted product data:', productData);

  // For demonstration, we'll just redirect to a success page
  return redirect('/dashboard/products/success');
};

export default function FormWizardPage() {
  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create New Product</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <FormWizardProvider initialValues={{}}>
          <ProductForm />
        </FormWizardProvider>
      </div>
    </Layout>
  );
}