import React from 'react';
import Layout from '~/components/Layout';
import MetricsDisplay from '~/components/MetricsDisplay';

export { loader } from '~/components/MetricsDisplay';

export default function MetricsPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Application Metrics</h1>
      <MetricsDisplay />
    </Layout>
  );
}
