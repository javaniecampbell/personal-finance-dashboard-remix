import React from 'react';
import { useFormState } from '~/hooks/useFormState';

const UserProfileForm = () => {
  const validationRules = {
    name: {
      required: { value: true, message: 'Name is required' },
    },
    email: {
      required: { value: true, message: 'Email is required' },
      pattern: { 
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
        message: 'Invalid email address' 
      },
    },
    age: {
      custom: (value) => {
        if (value && (isNaN(value) || value < 18 || value > 100)) {
          return 'Age must be a number between 18 and 100';
        }
      },
    },
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = useFormState(
    { name: '', email: '', age: '' },
    validationRules
  );

  const onSubmit = (formData) => {
    console.log('Form submitted with:', formData);
    // Here you would typically send the data to your server
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            touched.name && errors.name ? 'border-red-500' : ''
          }`}
        />
        {touched.name && errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            touched.email && errors.email ? 'border-red-500' : ''
          }`}
        />
        {touched.email && errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={values.age}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            touched.age && errors.age ? 'border-red-500' : ''
          }`}
        />
        {touched.age && errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-4 py-2 font-bold text-white rounded ${
            isValid ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default UserProfileForm;
