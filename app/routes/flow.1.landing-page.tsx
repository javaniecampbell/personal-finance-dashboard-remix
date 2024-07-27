import React from 'react';
import { Link } from '@remix-run/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/logo.svg" alt="FinanceDashboard" />
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/flow/2/login-page" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Log in
              </Link>
              <Link to="/register" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Sign up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Take Control of Your Finances</h1>
            <p className="text-xl text-gray-600 mb-8">FinanceDashboard helps you manage your money, track expenses, and reach your financial goals.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Easy Budgeting</h3>
                  <p className="mt-1 text-sm text-gray-500">Create and manage budgets with our intuitive bucket system.</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Transaction Tracking</h3>
                  <p className="mt-1 text-sm text-gray-500">Easily import and categorize your transactions.</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Insightful Analytics</h3>
                  <p className="mt-1 text-sm text-gray-500">Gain valuable insights with our detailed financial reports.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link to="/register" className="px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
