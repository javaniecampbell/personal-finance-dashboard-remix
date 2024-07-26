import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import BucketManagement from '~/components/BucketManagement';
// import EventSourcingAndMonitoring from '~/components/EventSourcingAndMonitoring';
import Layout from '~/components/Layout';

export const loader = async () => {
  // Fetch initial data from your backend
  const initialBuckets = [
    { id: '1', name: 'Groceries', budget: 500 },
    { id: '2', name: 'Entertainment', budget: 200 },
  ];

  return json({ initialBuckets });
};

export default function DashboardPage() {
  const { initialBuckets } = useLoaderData<typeof loader>();

  const handleCreateBucket = (newBucket) => {
    // Send create request to your backend
    console.log('Creating bucket:', newBucket);
  };

  const handleUpdateBucket = (updatedBucket) => {
    // Send update request to your backend
    console.log('Updating bucket:', updatedBucket);
  };

  const handleDeleteBucket = (bucketId) => {
    // Send delete request to your backend
    console.log('Deleting bucket:', bucketId);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Budget Buckets</h2>
        <BucketManagement
          initialBuckets={initialBuckets}
          
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">System Monitoring</h2>
        {/* <EventSourcingAndMonitoring /> */}
      </section>
    </Layout>
  );
}