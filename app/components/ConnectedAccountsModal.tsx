import React, { useState } from 'react';
import { X, Plus, ExternalLink, AlertCircle } from 'lucide-react';

const ConnectedAccountsModal = ({ isOpen, onClose, connectedAccounts, onConnect, onDisconnect }) => {
  const [newConnectionType, setNewConnectionType] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Manage Connected Accounts
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Connect your bank accounts to automate transaction imports and improve your financial overview.
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Connected Accounts</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {connectedAccounts.map((account) => (
                      <li key={account.id} className="py-2 flex justify-between items-center">
                        <span>{account.name}</span>
                        <button
                          onClick={() => onDisconnect(account.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Disconnect
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Add New Connection</h4>
                  <div className="mt-2 flex">
                    <select
                      value={newConnectionType}
                      onChange={(e) => setNewConnectionType(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select a bank</option>
                      <option value="stripe">Connect via Stripe</option>
                      <option value="plaid">Connect via Plaid</option>
                      <option value="manual">Manual Connection</option>
                    </select>
                    <button
                      onClick={() => onConnect(newConnectionType)}
                      disabled={!newConnectionType}
                      className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus size={16} className="mr-2" /> Connect
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          For enhanced security, sensitive credentials are stored encrypted in Azure Key Vault. 
                          Automated connections may be subject to your bank's terms of service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccountsModal;
