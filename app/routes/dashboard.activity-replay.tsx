import React from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Layout from '~/components/Layout';
import ReplayDemo from '~/components/ReplayDemo';

export const loader = async () => {
  // You could load any necessary data here
  return json({ pageTitle: 'Activity Replay' });
};

export default function ActivityReplayPage() {
  const { pageTitle } = useLoaderData();

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>
      <ReplayDemo />
    </Layout>
  );
}
