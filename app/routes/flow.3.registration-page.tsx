import React from "react";
import { useActionData, useNavigation, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { createUser, createUserSession } from "~/utils/auth.server.v2";
import { useNotification } from "~/components/ErrorNotification";
import { useFormState } from "~/hooks/useFormState";
import MultiStepForm from "~/components/MultiStepForm";

export const action = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const name = form.get("name");

  const user = await createUser({ email, password, name });

  if (!user) {
    return json(
      { errors: { email: "A user with this email already exists" } },
      { status: 400 }
    );
  }

  return createUserSession(user.id, "/dashboard");
};

const Step1 = ({ formData, handleInputChange }) => (
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
      Full Name
    </label>
    <input
      type="text"
      name="name"
      id="name"
      value={formData.name || ""}
      onChange={handleInputChange}
      required
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

const Step2 = ({ formData, handleInputChange }) => (
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
      Email address
    </label>
    <input
      type="email"
      name="email"
      id="email"
      value={formData.email || ""}
      onChange={handleInputChange}
      required
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

const Step3 = ({ formData, handleInputChange }) => (
  <div>
    <label
      htmlFor="password"
      className="block text-sm font-medium text-gray-700"
    >
      Password
    </label>
    <input
      type="password"
      name="password"
      id="password"
      value={formData.password || ""}
      onChange={handleInputChange}
      required
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

export default function RegistrationPage() {
  const actionData = useActionData();
  const transition = useNavigation();
  const { addNotification } = useNotification();

  const { handleSubmit, errors } = useFormState(
    { name: "", email: "", password: "" },
    {
      name: { required: { value: true, message: "Name is required" } },
      email: {
        required: { value: true, message: "Email is required" },
        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
      },
      password: {
        required: { value: true, message: "Password is required" },
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      },
    }
  );

  React.useEffect(() => {
    if (actionData?.errors) {
      Object.values(actionData.errors).forEach((error) => {
        addNotification(error, "error");
      });
    }
  }, [actionData, addNotification]);

  const steps = [
    { title: "Personal Information", component: Step1 },
    { title: "Account Information", component: Step2 },
    { title: "Security", component: Step3 },
  ];

  const onSubmit = (formData) => {
    const formElement = document.createElement("form");
    formElement.method = "post";
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      formElement.appendChild(input);
    });
    document.body.appendChild(formElement);
    formElement.submit();
    document.body.removeChild(formElement);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <MultiStepForm steps={steps} onSubmit={onSubmit} />
        {Object.keys(errors).length > 0 && (
          <div className="mt-4">
            {Object.values(errors).map((error, index) => (
              <p key={index} className="text-red-500 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}
        {transition.state === "submitting" && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Creating your account...
          </div>
        )}
      </div>
    </div>
  );
}
