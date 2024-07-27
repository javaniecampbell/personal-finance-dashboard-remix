import React from 'react';
import { Form, useActionData, useNavigation, Link } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { login, createUserSession } from '~/utils/auth.server';
import { useNotification } from '~/components/ErrorNotification';
import { useFormState } from '~/hooks/useFormState';

export const action = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');
  const redirectTo = form.get('redirectTo') || '/dashboard';

  if (!email || !password) {
    return json({ errors: { email: 'Email is required', password: 'Password is required' } }, { status: 400 });
  }

  const user = await login({ email, password });
  if (!user) {
    return json({ errors: { email: 'Invalid email or password' } }, { status: 400 });
  }

  return createUserSession(user.id, redirectTo);
};

export default function LoginPage() {
  const actionData = useActionData();
  const transition = useNavigation();
  const { addNotification } = useNotification();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormState(
    { email: '', password: '' },
    {
      email: {
        required: { value: true, message: 'Email is required' },
        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
      },
      password: {
        required: { value: true, message: 'Password is required' },
        minLength: { value: 8, message: 'Password must be at least 8 characters' },
      },
    }
  );

  React.useEffect(() => {
    if (actionData?.errors) {
      Object.values(actionData.errors).forEach((error) => {
        addNotification(error, 'error');
      });
    }
  }, [actionData, addNotification]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <Form method="post" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  touched.email && errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  touched.password && errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={transition.state === 'submitting'}
            >
              {transition.state === 'submitting' ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </Form>
        <div className="text-center">
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
