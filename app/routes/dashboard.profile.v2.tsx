import React from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Layout from '~/components/Layout';
import UserProfile from '~/components/UserProfile';

export const loader = async ({ params }) => {
  return json({ userId: params.userId });
};

export default function UserProfilePage() {
  const { userId } = useLoaderData();

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <UserProfile userId={userId} />
    </Layout>
  );
}
