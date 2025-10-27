'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ClassPage = () => {
  const params = useParams();
  const classId = params.classId;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Class ID: {classId}</h1>

      <Link
        href={`/classes/${classId}/addStudents`}
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        Add Students
      </Link>
    </div>
  );
};

export default ClassPage;
