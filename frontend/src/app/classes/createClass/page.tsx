'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Classes = () => {
    const router = useRouter();

    const [classData, setClassData] = useState({
        className: '',
        grade: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClassData({
            ...classData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts', { // Placeholder, change
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(classData),
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Ustvari nov razred</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Ime razreda:</label>
                        <input
                            type="text"
                            name="className"
                            placeholder='Ime razreda'
                            value={classData.className}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Stopnja:</label>
                        <input
                            type="text"
                            name="grade"
                            placeholder='Stopnja'
                            value={classData.grade}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors duration-200"
                    >
                        Ustvari razred
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Classes;
