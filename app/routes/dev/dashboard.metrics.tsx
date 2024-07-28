import Layout from "~/components/Layout";
import MetricsDisplay from "~/components/MetricsDisplay";
import { createSpan } from "~/utils/tracing.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
export const loader = async () => {
  return createSpan("fetch-metrics", async () => {
    // In a real application, you would fetch this data from your OpenTelemetry backend
    const mockMetrics = [
      {
        timestamp: "2024-07-26T00:00:00",
        requestCount: 100,
        responseTime: 250,
        errorRate: 0.02,
      },
      {
        timestamp: "2024-07-26T01:00:00",
        requestCount: 120,
        responseTime: 230,
        errorRate: 0.01,
      },
      {
        timestamp: "2024-07-26T02:00:00",
        requestCount: 80,
        responseTime: 280,
        errorRate: 0.03,
      },
      // ... more data points
    ];

    return json({ metrics: mockMetrics });
  });
};

export default function MetricsPage() {
  const { metrics } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Application Metrics</h1>
      <MetricsDisplay metrics={metrics} />
    </Layout>
  );
}
