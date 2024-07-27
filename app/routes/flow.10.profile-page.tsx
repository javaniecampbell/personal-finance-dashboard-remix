import React, { useState } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';
import { getUserProfile, updateUserProfile } from '~/utils/user.server';
import { useNotification } from '~/components/ErrorNotification';
import { useFormState } from '~/hooks/useFormState';
import { User, Mail, Phone, Calendar, MapPin, Camera, Key, Activity } from 'lucide-react';

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const userProfile = await getUserProfile(userId);
  return json({ userProfile });
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  
  await updateUserProfile(userId, updates);
  return redirect('/profile');
};

const ProfileSection = ({ title, children, icon }) => (
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

const ProfileItem = ({ label, value, editable, name, type = 'text', onChange }) => (
  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {editable ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
        />
      ) : (
        value
      )}
    </dd>
  </div>
);

export default function ProfilePage() {
  const { userProfile } = useLoaderData();
  const fetcher = useFetcher();
  const { addNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);

  const { values, handleChange, handleSubmit, errors } = useFormState(
    {
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      dateOfBirth: userProfile.dateOfBirth,
      address: userProfile.address,
    },
    {
      name: { required: 'Name is required' },
      email: { 
        required: 'Email is required',
        pattern: { 
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      },
      phone: {
        pattern: {
          value: /^\+?[1-9]\d{1,14}$/,
          message: 'Invalid phone number'
        }
      },
    }
  );

  const handleProfileSubmit = (formData) => {
    fetcher.submit(formData, { method: 'post' });
    setIsEditing(false);
    addNotification('Profile updated successfully', 'success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {userProfile.name}'s Profile
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, handleProfileSubmit)}>
        <ProfileSection title="Personal Information" icon={<User size={24} />}>
          <ProfileItem label="Name" value={values.name} editable={isEditing} name="name" onChange={handleChange} />
          <ProfileItem label="Email" value={values.email} editable={isEditing} name="email" type="email" onChange={handleChange} />
          <ProfileItem label="Phone" value={values.phone} editable={isEditing} name="phone" onChange={handleChange} />
          <ProfileItem label="Date of Birth" value={values.dateOfBirth} editable={isEditing} name="dateOfBirth" type="date" onChange={handleChange} />
          <ProfileItem label="Address" value={values.address} editable={isEditing} name="address" onChange={handleChange} />
        </ProfileSection>

        <ProfileSection title="Account Security" icon={<Key size={24} />}>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Password</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <button
                type="button"
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-2 px-4 rounded inline-flex items-center"
              >
                Change Password
              </button>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Two-Factor Authentication</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <button
                type="button"
                className="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-4 rounded inline-flex items-center"
              >
                Enable 2FA
              </button>
            </dd>
          </div>
        </ProfileSection>

        <ProfileSection title="Account Activity" icon={<Activity size={24} />}>
          <div className="py-4 sm:py-5 sm:px-6">
            <ul className="divide-y divide-gray-200">
              {userProfile.recentActivity.map((activity, index) => (
                <li key={index} className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{activity.action}</h3>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <p className="text-sm text-gray-500">{activity.details}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ProfileSection>

        {isEditing && (
          <div className="mt-6">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
