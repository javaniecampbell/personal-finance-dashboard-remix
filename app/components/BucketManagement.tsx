import { useState, useCallback } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

const BucketForm = ({ onSubmit, initialValues = {}, onCancel }) => {
  const [name, setName] = useState(initialValues.name || "");
  const [budget, setBudget] = useState(initialValues.budget || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, budget });
    setName("");
    setBudget(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Bucket Name
        </label>
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
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-gray-700"
        >
          Budget
        </label>
        <input
          type="number"
          id="budget"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value))}
          min="0"
          step="0.01"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

const BucketManagement = ({ initialBuckets, initialBucket }) => {
  const [buckets, setBuckets] = useState(initialBuckets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBucket, setEditingBucket] = useState(initialBucket);

  const addBucket = useCallback((newBucket) => {
    setBuckets((prevBuckets) => [
      ...prevBuckets,
      { ...newBucket, id: Date.now() },
    ]);
    setIsModalOpen(false);
  }, []);

  const updateBucket = useCallback((id, updatedBucket) => {
    setBuckets((prevBuckets) =>
      prevBuckets.map((bucket) =>
        bucket.id === id ? { ...bucket, ...updatedBucket } : bucket
      )
    );
    setEditingBucket(null);
  }, []);

  const deleteBucket = useCallback((id) => {
    setBuckets((prevBuckets) =>
      prevBuckets.filter((bucket) => bucket.id !== id)
    );
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Budget Buckets</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={16} className="inline mr-2" />
          Add Bucket
        </button>
      </div>

      {buckets.map((bucket) => (
        <div key={bucket.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {bucket.name}
              </h3>
              <p className="text-gray-600">
                Budget: ${bucket.budget.toFixed(2)}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setEditingBucket(bucket)}
                className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => deleteBucket(bucket.id)}
                className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {(isModalOpen || editingBucket) && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editingBucket ? "Edit Bucket" : "Add New Bucket"}
              </h3>
              <div className="mt-2 px-7 py-3">
                <BucketForm
                  onSubmit={
                    editingBucket
                      ? (updatedBucket) =>
                          updateBucket(editingBucket.id, updatedBucket)
                      : addBucket
                  }
                  initialValues={editingBucket}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setEditingBucket(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BucketManagement;
