'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

type Student = {
    firstName: string;
    lastName: string;
};

const AddStudentsPage = () => {
    const params = useParams();
    const classId = params.classId;

    const [students, setStudents] = useState<Student[]>([
        { firstName: '', lastName: '' },
    ]);

    // Handle input change
    const handleChange = (index: number, field: keyof Student, value: string) => {
        const updated = [...students];
        updated[index][field] = value;
        setStudents(updated);
    };

    // Add new empty student row
    const addStudent = () => {
        setStudents([...students, { firstName: '', lastName: '' }]);
    };

    // Remove a student row
    const removeStudent = (index: number) => {
        const updated = students.filter((_, i) => i !== index);
        setStudents(updated);
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts', { // Placeholder, change
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(students),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error || 'Something went wrong');

            console.log('Students for class', classId, students);
            setStudents([{ firstName: '', lastName: '' }]);

        } catch (error) {
            console.error('Error creating class:', error);
            alert('Failed to create class');
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
                    Dodajanje učencov v razred {classId}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {students.map((student, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Ime"
                                value={student.firstName}
                                onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Priimek"
                                value={student.lastName}
                                onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                                required
                            />
                            {students.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeStudent(index)}
                                    className="text-red-500 hover:text-red-700 font-bold px-2"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={addStudent}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                        >
                            Dodaj učenca
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                        >
                            Potrdi
                        </button>
                    </div>
                </form>
            </div>
        </div>//TODO: CSV button
    );
};

export default AddStudentsPage;
