"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Paragraph {
  _id: string | { $oid: string };
  story_id: string | { $oid: string };
  content: string;
  drawing: string | null;
  order: number;
}

interface Student {
  _id: string | { $oid: string };
  name: string;
  surname: string;
  email: string;
  code?: string;
  paragraphs: Array<string | { $oid: string }>;
}

interface Story {
  _id: string | { $oid: string };
  title: string;
  author: string;
  short_description: string;
  content: string;
  is_finished: boolean;
}

interface StoryData {
  story: Story | null;
  paragraphs: Paragraph[];
  students: Student[];
  paragraphAssignments: Map<string, string>;
}

export default function StoryPage() {
  const { classId, storyId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<StoryData>({
    story: null,
    paragraphs: [],
    students: [],
    paragraphAssignments: new Map(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch story details
        const storyRes = await fetch(`http://127.0.0.1:5000/api/stories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const storyData = await storyRes.json();
        const story = storyData.data?.find((s: any) => {
          const sid = typeof s._id === 'string' ? s._id : s._id.$oid;
          return sid === storyId;
        });

        if (!story) {
          setError("Zgodba ni najdena");
          setLoading(false);
          return;
        }

        const normalizedStoryId = typeof story._id === 'string' ? story._id : story._id.$oid;
        const paragraphsRes = await fetch(`http://127.0.0.1:5000/api/stories/${normalizedStoryId}/paragraphs`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const paragraphsData = await paragraphsRes.json();
        const paragraphs = paragraphsData.data || [];

        // Fetch class with students
        const classRes = await fetch(`http://127.0.0.1:5000/api/classes/${classId}?populate=true`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const classData = await classRes.json();

        if (!classData.data) {
          setError("Razred ni najden");
          setLoading(false);
          return;
        }

        const students = classData.data.students || [];
        
        const assignments = new Map<string, string>();
        
        for (const student of students) {
          const studentId = typeof student._id === 'string' ? student._id : student._id.$oid;
          const paragraphIds = student.paragraphs || [];
          
          for (const pId of paragraphIds) {
            const paragraphId = typeof pId === 'string' ? pId : pId.$oid;
            assignments.set(paragraphId, studentId);
          }
        }

        setData({
          story,
          paragraphs,
          students,
          paragraphAssignments: assignments,
        });
      } catch (err) {
        console.error("Napaka pri nalaganju podatkov:", err);
        setError("Napaka pri nalaganju podatkov");
      } finally {
        setLoading(false);
      }
    };

    if (classId && storyId) {
      fetchData();
    }
  }, [classId, storyId]);

  const handleStudentChange = async (paragraphId: string, newStudentId: string) => {
    setSaving(paragraphId);
    try {
      const oldStudentId = data.paragraphAssignments.get(paragraphId);
      
      if (oldStudentId) {
        const oldStudent = data.students.find(s => {
          const sid = typeof s._id === 'string' ? s._id : s._id.$oid;
          return sid === oldStudentId;
        });
        
        if (oldStudent) {
          const updatedParagraphs = oldStudent.paragraphs
            .filter(pId => {
              const pid = typeof pId === 'string' ? pId : pId.$oid;
              return pid !== paragraphId;
            })
            .map(pId => typeof pId === 'string' ? pId : pId.$oid);
          
          await fetch(`http://127.0.0.1:5000/api/users/${oldStudentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paragraphs: updatedParagraphs }),
          });
        }
      }
      
      if (newStudentId) {
        const newStudent = data.students.find(s => {
          const sid = typeof s._id === 'string' ? s._id : s._id.$oid;
          return sid === newStudentId;
        });
        
        if (newStudent) {
          const currentParagraphs = newStudent.paragraphs.map(pId => 
            typeof pId === 'string' ? pId : pId.$oid
          );
          const updatedParagraphs = [...currentParagraphs, paragraphId];
          
          await fetch(`http://127.0.0.1:5000/api/users/${newStudentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paragraphs: updatedParagraphs }),
          });
        }
      }
      
      setData(prev => {
        const newAssignments = new Map(prev.paragraphAssignments);
        if (newStudentId) {
          newAssignments.set(paragraphId, newStudentId);
        } else {
          newAssignments.delete(paragraphId);
        }
        
        const updatedStudents = prev.students.map(student => {
          const studentId = typeof student._id === 'string' ? student._id : student._id.$oid;
          
          if (studentId === oldStudentId) {
            return {
              ...student,
              paragraphs: student.paragraphs.filter(pId => {
                const pid = typeof pId === 'string' ? pId : pId.$oid;
                return pid !== paragraphId;
              }),
            };
          } else if (studentId === newStudentId) {
            return {
              ...student,
              paragraphs: [...student.paragraphs, paragraphId],
            };
          }
          return student;
        });
        
        return {
          ...prev,
          paragraphAssignments: newAssignments,
          students: updatedStudents,
        };
      });

      console.log('✅ Odlomek uspešno prerazporejen');
      
    } catch (err) {
      console.error("Napaka pri spreminjanju učenca:", err);
      alert("Napaka pri spreminjanju učenca");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Nalaganje zgodbe...</p>
      </div>
    );
  }

  if (error || !data.story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-4">{error || "Zgodba ni najdena"}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            ← Nazaj
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            ← Nazaj
          </button>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg backdrop-blur-md">
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {data.story.title}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
            Avtor: {data.story.author}
          </p>
          {data.story.short_description && (
            <p className="text-center text-gray-500 dark:text-gray-500 italic mb-6">
              {data.story.short_description}
            </p>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Odlomki in učenci</h2>
            
            {data.paragraphs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Ni odlomkov za to zgodbo.
              </p>
            ) : (
              <div className="space-y-6">
                {data.paragraphs.map((paragraph) => {
                  const paragraphId = typeof paragraph._id === 'string' ? paragraph._id : paragraph._id.$oid;
                  const assignedStudentId = data.paragraphAssignments.get(paragraphId);
                  const assignedStudent = data.students.find(s => {
                    const sid = typeof s._id === 'string' ? s._id : s._id.$oid;
                    return sid === assignedStudentId;
                  });

                  return (
                    <div
                      key={paragraphId}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-5"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="inline-block bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded flex-shrink-0">
                          #{paragraph.order}
                        </span>
                      </div>
                      
                      <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed mb-4">
                        {paragraph.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          📘 Učenec:{" "}
                          <strong>
                            {assignedStudent 
                              ? `${assignedStudent.name} ${assignedStudent.surname}`
                              : "Ni dodeljen"}
                          </strong>
                        </span>

                        <select
                          value={assignedStudentId || ''}
                          onChange={(e) => handleStudentChange(paragraphId, e.target.value)}
                          disabled={saving === paragraphId}
                          className="ml-4 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
                        >
                          <option value="">-- Izberi učenca --</option>
                          {data.students.map((student) => {
                            const studentId = typeof student._id === 'string' ? student._id : student._id.$oid;
                            return (
                              <option key={studentId} value={studentId}>
                                {student.name} {student.surname}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {paragraph.drawing && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            🎨 Risba učenca:
                          </p>
                          <img 
                            src={paragraph.drawing} 
                            alt="Student drawing" 
                            className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
