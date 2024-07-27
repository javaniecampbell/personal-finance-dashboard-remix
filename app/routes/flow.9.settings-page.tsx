import React, { useState } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';
import { getUserSettings, updateUserSettings } from '~/utils/settings.server';
import { useNotification } from '~/components/ErrorNotification';
import { useFormState } from '~/hooks/useFormState';
import { Settings, Bell, Link, Moon, Sun, ChevronRight } from 'lucide-react';

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const settings = await getUserSettings(userId);
  return json({ settings });
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  
  await updateUserSettings(userId, updates);
  return redirect('/settings');
};

const SettingsSection = ({ title, children, icon }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
    <div className="px-4 py-5 sm:px-6 flex items-center">
      {icon}
      <h3 className="text-lg leading-6 font-medium text-gray-900 ml-2">{title}</h3>
    </div>
    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl className="sm:divide-y sm:divide-gray-200">
        {children}
      </dl>
    </div>
  </div>
);

const SettingsItem = ({ label, children }) => (
  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {children}
    </dd>
  </div>
);

export default function SettingsPage() {
  const { settings } = useLoaderData();
  const fetcher = useFetcher();
  const { addNotification } = useNotification();
  const [theme, setTheme] = useState(settings.theme || 'light');

  const { values, handleChange, handleSubmit } = useFormState(
    {
      email: settings.email,
      notifyOnLowBalance: settings.notifyOnLowBalance,
      notifyOnBillDue: settings.notifyOnBillDue,
      lowBalanceThreshold: settings.lowBalanceThreshold,
      theme: settings.theme,
    },
    {}
  );

  const handleSettingsSubmit = (formData) => {
    fetcher.submit(formData, { method: 'post' });
    addNotification('Settings updated successfully', 'success');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    handleSettingsSubmit({ ...values, theme: newTheme });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <form onSubmit={(e) => handleSubmit(e, handleSettingsSubmit)}>
        <SettingsSection title="Account Settings" icon={<Settings size={24} />}>
          <SettingsItem label="Email">
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </SettingsItem>
          <SettingsItem label="Password">
            <button
              type="button"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change Password
            </button>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Notification Preferences" icon={<Bell size={24} />}>
          <SettingsItem label="Low Balance Alert">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notifyOnLowBalance"
                checked={values.notifyOnLowBalance}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2">Notify me when my balance is low</span>
            </div>
          </SettingsItem>
          {values.notifyOnLowBalance && (
            <SettingsItem label="Low Balance Threshold">
              <input
                type="number"
                name="lowBalanceThreshold"
                value={values.lowBalanceThreshold}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </SettingsItem>
          )}
          <SettingsItem label="Bill Due Alert">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notifyOnBillDue"
                checked={values.notifyOnBillDue}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2">Notify me when a bill is due</span>
            </div>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Connected Accounts" icon={<Link size={24} />}>
          <SettingsItem label="Bank Accounts">
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-900 flex items-center"
            >
              Manage Connected Accounts <ChevronRight size={16} className="ml-1" />
            </button>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Appearance" icon={theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}>
          <SettingsItem label="Theme">
            <div className="flex items-center">
              <span className="mr-2">{theme === 'light' ? 'Light' : 'Dark'} Mode</span>
              <button
                type="button"
                onClick={toggleTheme}
                className={`${
                  theme === 'light' ? 'bg-gray-200' : 'bg-indigo-600'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span className="sr-only">Toggle theme</span>
                <span
                  className={`${
                    theme === 'light' ? 'translate-x-0' : 'translate-x-5'
                  } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                >
                  <span
                    className={`${
                      theme === 'light' ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
                    } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                  >
                    <Sun size={12} />
                  </span>
                  <span
                    className={`${
                      theme === 'light' ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
                    } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                  >
                    <Moon size={12} />
                  </span>
                </span>
              </button>
            </div>
          </SettingsItem>
        </SettingsSection>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
