'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Student = {
    firstName: string;
    lastName: string;
};



const AddStudentsPage = () => {
    const [classData, setClassData] = useState({
        class_name: ''
    });
    const params = useParams();
    const classId = params.classId;

    const [loading, setLoading] = useState(true);
    useEffect(() => {

        if (!classId) return;

        const fetchClass = async () => {
            try {

                const res = await fetch(`http://127.0.0.1:5000/api/classes/${classId}`);
                if (!res.ok) throw new Error('Failed to fetch class data');

                const result = await res.json();
                const cls = result.data;

                setClassData({
                    class_name: cls.class_name || '',
                });
            } catch (error) {
                console.error('Error fetching class:', error);
                alert('Could not load class data');
            } finally {
                setLoading(false);
            }
        };

        fetchClass();
    }, [classId]);

    const [students, setStudents] = useState<Student[]>([
        { firstName: '', lastName: '' },
    ]);

    const handleChange = (index: number, field: keyof Student, value: string) => {
        const updated = [...students];
        updated[index][field] = value;
        setStudents(updated);
    };

    const addStudent = () => {
        setStudents([...students, { firstName: '', lastName: '' }]);
    };

    const removeStudent = (index: number) => {
        const updated = students.filter((_, i) => i !== index);
        setStudents(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validStudents = students.filter(s => s.firstName.trim() && s.lastName.trim());
        
        if (validStudents.length === 0) {
            alert('Prosim dodajte vsaj enega učenca');
            return;
        }

        try {
            const createdStudentIds: string[] = [];
            
            for (const student of validStudents) {
                const email = `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@student.risalko.si`;
                const password = 'student123'; // Default password for students
                
                const res = await fetch('http://127.0.0.1:5000/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: student.firstName,
                        surname: student.lastName,
                        email: email,
                        password: password,
                        type: 'student'
                    }),
                });

                const result = await res.json();
                
                if (!res.ok) {
                    console.error('Failed to create student:', result.error);
                    throw new Error(result.error || 'Failed to create student');
                }
                
                const studentId = result.data?._id?.$oid || result.data?._id;
                if (studentId) {
                    createdStudentIds.push(studentId);
                }
            }

            const classRes = await fetch(`http://127.0.0.1:5000/api/classes/${classId}`);
            const classData = await classRes.json();
            
            if (!classRes.ok) {
                throw new Error('Failed to fetch class data');
            }

            const existingStudentIds = classData.data?.students?.map((s: any) => s._id?.$oid || s._id || s) || [];
            
            const allStudentIds = [...existingStudentIds, ...createdStudentIds];

            const updateRes = await fetch(`http://127.0.0.1:5000/api/classes/${classId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    students: allStudentIds
                }),
            });

            const updateResult = await updateRes.json();

            if (!updateRes.ok) {
                throw new Error(updateResult.error || 'Failed to update class');
            }

            alert(`✅ Uspešno dodanih ${createdStudentIds.length} učencev v razred ${classData.data?.class_name || ''}`);
            
            setStudents([{ firstName: '', lastName: '' }]);

        } catch (error) {
            console.error('Error adding students:', error);
            alert(`Napaka pri dodajanju učencev: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

    };

    if (loading) {
        return (
            <div className="background flex items-center justify-center">
                Nalagam podatke o razredu...
            </div>
        );
    }

    return (
        <div className="background flex items-center justify-center">
            <div className="section-dark w-2xl">
                <h1 className="text-3xl font-bold text-center mb-6 gradient-text">
                    Dodajanje učencov v razred {classData.class_name}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {students.map((student, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Ime"
                                value={student.firstName}
                                onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                                className="input-text"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Priimek"
                                value={student.lastName}
                                onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                                className="input-text"
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
                            className="btn bg-yellow-100 text-black"
                        >
                            Dodaj učenca
                        </button>

                        <button
                            type="submit"
                            className="btn bg-purple-200 text-black"
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
