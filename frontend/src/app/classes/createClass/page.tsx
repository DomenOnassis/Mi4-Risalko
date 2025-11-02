'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Classes = () => {
  const router = useRouter();

  const [classData, setClassData] = useState({
    className: '',
    color: '#4F46E5',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const placeholderTeacher = '68f2abbbf05e7dde3d965491';

      const payload = {
        ...classData,
        teacher: placeholderTeacher,
      };

      const res = await fetch('http://127.0.0.1:5000/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Something went wrong');

      console.log('Class created:', result);
      router.back();
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class');
    }
  };

  return (
    <div className="background flex items-center justify-center">
      <div className="section-dark w-md">
        <h1 className="text-3xl font-bold text-center mb-6 gradient-text">
          Ustvari nov razred
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ime razreda
            </label>
            <input
              type="text"
              name="className"
              placeholder="Ime razreda"
              value={classData.className}
              onChange={handleChange}
              required
              className="input-text"
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Barva razreda
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="color"
                value={classData.color}
                onChange={handleChange}
                className="w-12 h-12 cursor-pointer rounded-md border border-gray-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-100 text-black w-full"
          >
            Ustvari razred
          </button>
        </form>
      </div>
    </div>
  );
};

export default Classes;
