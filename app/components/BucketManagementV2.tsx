import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const BucketForm = ({ onSubmit, initialValues, onCancel }) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [budget, setBudget] = useState(initialValues?.budget || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, budget: parseFloat(budget) });
    setName('');
    setBudget('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Bucket Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</label>
        <input
          type="number"
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          min="0"
          step="0.01"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialValues ? 'Update' : 'Create'} Bucket
        </button>
      </div>
    </form>
  );
};

const BucketManagement = ({ initialBuckets, onCreateBucket, onUpdateBucket, onDeleteBucket }) => {
  const [buckets, setBuckets] = useState(initialBuckets);
  const [editingBucket, setEditingBucket] = useState(null);

  const handleCreateBucket = (newBucket) => {
    const bucketWithId = { ...newBucket, id: Date.now().toString() };
    setBuckets([...buckets, bucketWithId]);
    onCreateBucket(bucketWithId);
  };

  const handleUpdateBucket = (updatedBucket) => {
    setBuckets(buckets.map(b => b.id === updatedBucket.id ? updatedBucket : b));
    setEditingBucket(null);
    onUpdateBucket(updatedBucket);
  };

  const handleDeleteBucket = (id) => {
    setBuckets(buckets.filter(b => b.id !== id));
    onDeleteBucket(id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Bucket</h3>
        <BucketForm onSubmit={handleCreateBucket} />
      </div>

      {buckets.map((bucket) => (
        <div key={bucket.id} className="bg-white shadow-md rounded-lg p-4">
          {editingBucket?.id === bucket.id ? (
            <BucketForm
              initialValues={editingBucket}
              onSubmit={handleUpdateBucket}
              onCancel={() => setEditingBucket(null)}
            />
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{bucket.name}</h3>
                <p className="text-sm text-gray-500">Budget: ${bucket.budget.toFixed(2)}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingBucket(bucket)}
                  className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteBucket(bucket.id)}
                  className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BucketManagement;