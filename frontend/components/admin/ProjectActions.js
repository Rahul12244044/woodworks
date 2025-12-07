// components/admin/ProjectActions.js
'use client';

import Link from 'next/link';

export default function ProjectActions({ projectId, onDelete }) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(projectId);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={`/admin/projects/${projectId}/edit`}
        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  );
}