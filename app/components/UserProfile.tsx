import React from 'react';
import { useApiCall } from '~/hooks/useApiCall';
// Example Component Using API Call Hook
// Mock API function
const fetchUserData = async (userId) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (Math.random() < 0.3) { // 30% chance of error
    throw new Error('Failed to fetch user data');
  }
  return { id: userId, name: 'John Doe', email: 'john@example.com' };
};

const UserProfile = ({ userId }) => {
  const { execute: fetchUser, data: user, loading, error } = useApiCall(fetchUserData);

  React.useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error.message}</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default UserProfile;
