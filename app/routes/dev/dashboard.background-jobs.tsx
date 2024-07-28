import React, { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import Layout from "~/components/Layout";
import { Play, Pause, RefreshCw } from "lucide-react";

// Mock job data
let mockJobs = [
  {
    id: "1",
    name: "Data Import",
    status: "running",
    progress: 45,
    type: "import",
  },
  {
    id: "2",
    name: "Report Generation",
    status: "queued",
    progress: 0,
    type: "report",
  },
  {
    id: "3",
    name: "Database Backup",
    status: "paused",
    progress: 70,
    type: "backup",
  },
  {
    id: "4",
    name: "Email Campaign",
    status: "completed",
    progress: 100,
    type: "email",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json({ jobs: mockJobs });
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);
  const formData = await request.formData();
  const jobId = formData.get("jobId");
  const action = formData.get("action");

  if (typeof jobId !== "string" || typeof action !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const job = mockJobs.find((j) => j.id === jobId);
  if (!job) {
    return json({ error: "Job not found" }, { status: 404 });
  }

  switch (action) {
    case "pause":
      job.status = "paused";
      break;
    case "resume":
      job.status = "running";
      break;
    case "retry":
      job.status = "queued";
      job.progress = 0;
      break;
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }

  return json({ job });
};

const JobItem = ({ job }) => {
  const fetcher = useFetcher();

  const handleAction = (action) => {
    fetcher.submit({ jobId: job.id, action }, { method: "post" });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{job.name}</h3>
        <span
          className={`px-2 py-1 rounded text-sm ${
            job.status === "completed"
              ? "bg-green-200 text-green-800"
              : job.status === "running"
              ? "bg-blue-200 text-blue-800"
              : job.status === "paused"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {job.status}
        </span>
      </div>
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${job.progress}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-500">{job.progress}% complete</span>
      </div>
      <div className="flex space-x-2">
        {job.status !== "completed" && (
          <>
            {job.status === "paused" ? (
              <button
                onClick={() => handleAction("resume")}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Play size={16} />
              </button>
            ) : (
              <button
                onClick={() => handleAction("pause")}
                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                <Pause size={16} />
              </button>
            )}
          </>
        )}
        {(job.status === "paused" || job.status === "completed") && (
          <button
            onClick={() => handleAction("retry")}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <RefreshCw size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default function BackgroundJobs() {
  const { jobs } = useLoaderData();
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (filter === "all") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((job) => job.status === filter));
    }
  }, [filter, jobs]);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Background Jobs
      </h2>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">
          Filter by status:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="queued">Queued</option>
          <option value="running">Running</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        {filteredJobs.map((job) => (
          <JobItem key={job.id} job={job} />
        ))}
      </div>
    </Layout>
  );
}
