import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

// This would typically come from props or a data fetching hook
const initialJobs = [
  { id: '1', name: 'Data Import', status: 'running', progress: 45, type: 'import' },
  { id: '2', name: 'Report Generation', status: 'queued', progress: 0, type: 'report' },
  { id: '3', name: 'Database Backup', status: 'paused', progress: 70, type: 'backup' },
  { id: '4', name: 'Email Campaign', status: 'completed', progress: 100, type: 'email' },
];

const JobItem = ({ job, onAction }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{job.name}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          job.status === 'completed' ? 'bg-green-200 text-green-800' :
          job.status === 'running' ? 'bg-blue-200 text-blue-800' :
          job.status === 'paused' ? 'bg-yellow-200 text-yellow-800' :
          'bg-gray-200 text-gray-800'
        }`}>
          {job.status}
        </span>
      </div>
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${job.progress}%` }}></div>
        </div>
        <span className="text-sm text-gray-500">{job.progress}% complete</span>
      </div>
      <div className="flex space-x-2">
        {job.status !== 'completed' && (
          <>
            {job.status === 'paused' ? (
              <button onClick={() => onAction(job.id, 'resume')} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                <Play size={16} />
              </button>
            ) : (
              <button onClick={() => onAction(job.id, 'pause')} className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                <Pause size={16} />
              </button>
            )}
          </>
        )}
        {(job.status === 'paused' || job.status === 'completed') && (
          <button onClick={() => onAction(job.id, 'retry')} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <RefreshCw size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const BackgroundJobs = ({ onAction }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [filter, setFilter] = useState('all');

  const filteredJobs = jobs.filter(job => filter === 'all' || job.status === filter);

  // Simulating job updates
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.status === 'running') {
            return { ...job, progress: Math.min(100, job.progress + 5) };
          }
          return job;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (jobId, action) => {
    setJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.id === jobId) {
          switch (action) {
            case 'pause':
              return { ...job, status: 'paused' };
            case 'resume':
              return { ...job, status: 'running' };
            case 'retry':
              return { ...job, status: 'queued', progress: 0 };
            default:
              return job;
          }
        }
        return job;
      })
    );
    onAction(jobId, action);
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter by status:</label>
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
        {filteredJobs.map(job => (
          <JobItem key={job.id} job={job} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
};

export default BackgroundJobs;
