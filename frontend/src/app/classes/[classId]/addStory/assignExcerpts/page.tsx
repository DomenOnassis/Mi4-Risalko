'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Excerpt {
  id: string;
  text: string;
  order: number;
  assignedTo?: string;
}

interface Student {
  id: string;
  name: string;
}

const AssignExcerptsPage = () => {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId;

  const [storyData, setStoryData] = useState<any>(null);
  const [excerpts, setExcerpts] = useState<Excerpt[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignmentMode, setAssignmentMode] = useState<'manual' | 'random'>('manual');

  useEffect(() => {
    const storyStored = sessionStorage.getItem('newStory');
    const excerptsStored = sessionStorage.getItem('storyExcerpts');
    
    if (storyStored && excerptsStored) {
      setStoryData(JSON.parse(storyStored));
      setExcerpts(JSON.parse(excerptsStored));
    } else {
      router.push(`/classes/${classId}/addStory`);
    }

    setStudents([
      { id: '1', name: 'Ana Novak' },
      { id: '2', name: 'Luka Kovač' },
      { id: '3', name: 'Eva Marić' },
      { id: '4', name: 'Matej Horvat' },
      { id: '5', name: 'Nina Krajnc' },
      { id: '6', name: 'Žan Golob' },
    ]);
  }, [classId, router]);

  const handleManualAssign = (excerptId: string, studentId: string) => {
    setExcerpts(excerpts.map(excerpt => 
      excerpt.id === excerptId 
        ? { ...excerpt, assignedTo: studentId }
        : excerpt
    ));
  };

  const handleRandomAssign = () => {
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    const assigned = excerpts.map((excerpt, index) => ({
      ...excerpt,
      assignedTo: shuffledStudents[index % students.length].id,
    }));
    setExcerpts(assigned);
  };

  const clearAssignments = () => {
    setExcerpts(excerpts.map(excerpt => ({ ...excerpt, assignedTo: undefined })));
  };

  const getStudentName = (studentId?: string) => {
    if (!studentId) return null;
    return students.find(s => s.id === studentId)?.name;
  };

  const handleFinish = () => {
    const finalData = {
      story: storyData,
      excerpts: excerpts,
      classId,
    };

    console.log('Final story with assignments:', finalData);
    
    alert(`✅ Zgodba "${storyData.title}" z ${excerpts.length} odlomki uspešno ustvarjena!\n\n(Opomba: Ni bila shranjena v bazo - povezava ni aktivna)`);
    
    sessionStorage.removeItem('newStory');
    sessionStorage.removeItem('storyExcerpts');
    
    router.push(`/classes/${classId}`);
  };

  if (!storyData || excerpts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Nalaganje...</p>
      </div>
    );
  }

  const allAssigned = excerpts.every(e => e.assignedTo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            ← Nazaj
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dodeli odlomke učencem
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {storyData.title} - {excerpts.length} odlomkov
        </p>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setAssignmentMode('manual')}
                className={`py-2 px-6 rounded-lg font-semibold transition-all ${
                  assignmentMode === 'manual'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                ✋ Ročna dodelitev
              </button>
              <button
                onClick={() => setAssignmentMode('random')}
                className={`py-2 px-6 rounded-lg font-semibold transition-all ${
                  assignmentMode === 'random'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🎲 Naključna dodelitev
              </button>
            </div>

            {assignmentMode === 'random' && (
              <div className="flex gap-3">
                <button
                  onClick={handleRandomAssign}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
                >
                  🎲 Dodeli naključno
                </button>
                <button
                  onClick={clearAssignments}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Počisti
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {excerpts.map((excerpt) => (
              <div
                key={excerpt.id}
                className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-block bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded flex-shrink-0">
                    #{excerpt.order}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                      {excerpt.text}
                    </p>
                    
                    {assignmentMode === 'manual' ? (
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dodeli učencu:
                        </label>
                        <select
                          value={excerpt.assignedTo || ''}
                          onChange={(e) => handleManualAssign(excerpt.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="">-- Izberi učenca --</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {excerpt.assignedTo ? (
                          <>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Dodeljeno:
                            </span>
                            <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                              👤 {getStudentName(excerpt.assignedTo)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Ni dodeljeno
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Dodeljeno: {excerpts.filter(e => e.assignedTo).length} / {excerpts.length}
              </div>
              <button
                onClick={handleFinish}
                disabled={!allAssigned}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {allAssigned ? '✅ Zaključi in shrani' : '⚠️ Dodeli vse odlomke za nadaljevanje'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignExcerptsPage;
