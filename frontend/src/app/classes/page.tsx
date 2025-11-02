'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

type ClassType = {
  _id?: { $oid?: string } | string;
  class_name?: string;
  students?: any[];
};

const Classes = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

  const teacherName = 'John Smith';

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userId = '68f2abbbf05e7dde3d965491';

        const res = await fetch(
          `http://127.0.0.1:5000/api/classes?user_id=${userId}&populate=true`
        );
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

        const result = await res.json();

        const normalized =
          result.data?.map((cls: any) => ({
            ...cls,
            _id: cls._id?.$oid || cls._id,
          })) || [];

          console.log(result);
          console.log(normalized);
        setClasses(normalized);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/classes/${id}/editClass`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      await fetch(`http://127.0.0.1:5000/api/classes/${id}`, { method: 'DELETE' });

      console.log(`Class ${id} deleted`);
      setClasses(prev => prev.filter(cls => cls._id !== id));
    } catch (err) {
      console.error('Error deleting class:', err);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-primary p-8">
          <div>
            <h1 className="text-3xl font-bold text-text">Your Classes</h1>
            <p className="text-text-light text-lg">
              Welcome back, <span className="font-semibold text-text">{teacherName}</span> 👋
            </p>
          </div>

          <Link
            href="/classes/createClass"
            className="bg-button hover:bg-gray-50 text-text font-bold py-2 px-4 rounded-lg shadow-sm hover:scale-110 transition-all duration-200"
          >
            + Create New Class
          </Link>
        </div>

        {loading ? (
          <p className="text-text text-center">Loading your classes...</p>
        ) : classes.length === 0 ? (
          <p className="text-text text-center">No classes found. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            {classes.map((cls, index) => (
              <div
                key={typeof cls._id === 'string' ? cls._id : cls._id?.$oid || index}
                className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-2 cursor-pointer"
                onClick={() => router.push(`/classes/${cls._id}`)}
              >
                <div
                  className="absolute bottom-2 right-3 flex gap-2 opacity-70 hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleEdit(cls._id as string)}
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    title="Edit Class"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id as string)}
                    className="p-2 rounded-md hover:bg-red-100 text-red-500 transition"
                    title="Delete Class"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <h2 className="text-xl font-semibold text-text mb-2">
                  {cls.class_name || 'Unnamed Class'}
                </h2>
                <p className="text-text-muted mt-3 font-medium">
                  👥 {cls.students?.length || 0}{' '}
                  {cls.students?.length === 1 ? 'Student' : 'Students'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;
