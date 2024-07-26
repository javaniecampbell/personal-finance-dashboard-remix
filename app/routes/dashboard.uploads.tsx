import { useState, useCallback } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  json,
  unstable_parseMultipartFormData,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import Layout from "~/components/Layout";
import { useDropzone } from "react-dropzone-esm";
// const { useDropzone } = dropZone;

// Mock data - replace with actual data fetching in a real application
const mockFiles = [
  { id: 1, name: "document1.pdf", status: "Completed", progress: 100 },
  { id: 2, name: "image1.jpg", status: "In Progress", progress: 60 },
  { id: 3, name: "spreadsheet1.xlsx", status: "Failed", progress: 30 },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return json({ files: mockFiles });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  const uploadHandler = unstable_createMemoryUploadHandler({
    // maxFileSize: 5_000_000,
    maxPartSize: 5_000_000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const file = formData.get("file") as File;

  if (!file) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  // In a real application, you would process the file here
  // For now, we'll just return a success message
  return json({ success: true, fileName: file?.name });
};

export default function Uploads() {
  const { files } = useLoaderData<typeof loader>();
  const [uploadProgress, setUploadProgress] = useState({});
  const fetcher = useFetcher();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);

        fetcher.submit(formData, {
          method: "post",
          encType: "multipart/form-data",
        });

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 500);
      });
    },
    [fetcher]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        File Uploads
      </h2>

      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Uploaded Files
        </h3>
        <ul className="bg-white rounded-lg shadow overflow-hidden">
          {files.map((file) => (
            <li key={file.id} className="border-b last:border-b-0 p-4">
              <div className="flex justify-between items-center">
                <span>{file.name}</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    file.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : file.status === "In Progress"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {file.status}
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${uploadProgress[file.name] || file.progress}%`,
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
