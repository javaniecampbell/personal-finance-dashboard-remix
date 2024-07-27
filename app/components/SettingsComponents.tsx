import React from 'react';
import { useFormState } from '~/hooks/useFormState';

type SettingsFormProps = {
  initialSettings: {
    theme: 'light' | 'dark';
    language: string;
    notificationPreferences: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    currency: string;
  };
  onSubmit: (settings: any) => void;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialSettings, onSubmit }) => {
  const { values, handleChange, handleSubmit } = useFormState(initialSettings);

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
        <select
          id="theme"
          name="theme"
          value={values.theme}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
        <select
          id="language"
          name="language"
          value={values.language}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div>
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">Notification Preferences</legend>
          <div className="mt-2 space-y-2">
            {Object.entries(values.notificationPreferences).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  id={`notifications-${key}`}
                  name={`notificationPreferences.${key}`}
                  type="checkbox"
                  checked={value}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`notifications-${key}`} className="ml-2 block text-sm text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
        <select
          id="currency"
          name="currency"
          value={values.currency}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Settings
        </button>
      </div>
    </form>
  );
};

type ConnectedAccountsListProps = {
  accounts: Array<{
    id: string;
    provider: string;
    accountName: string;
    accountType: string;
  }>;
  onRemove: (accountId: string) => void;
};

export const ConnectedAccountsList: React.FC<ConnectedAccountsListProps> = ({ accounts, onRemove }) => (
  <ul className="divide-y divide-gray-200">
    {accounts.map((account) => (
      <li key={account.id} className="py-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-900">{account.accountName}</p>
          <p className="text-sm text-gray-500">{account.provider} - {account.accountType}</p>
        </div>
        <button
          onClick={() => onRemove(account.id)}
          className="ml-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Remove
        </button>
      </li>
    ))}
  </ul>
);
