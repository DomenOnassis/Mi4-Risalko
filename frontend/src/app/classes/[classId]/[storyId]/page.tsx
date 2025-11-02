"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

// 🔹 Primer strukture podatkov (zamenjaj z dejanskimi API podatki)
const mockData = {
  title: "Zgodba o prijateljstvu",
  excerpts: [
    { id: 1, text: "Nekoč sta živela dva prijatelja...", student: "Luka Novak" },
    { id: 2, text: "Skupaj sta hodila v šolo in delila skrivnosti.", student: "Ana Horvat" },
    { id: 3, text: "Nekega dne sta se sprla zaradi malenkosti.", student: "Niko Kralj" },
  ],
  students: ["Luka Novak", "Ana Horvat", "Niko Kralj", "Maja Zupan"],
};

export default function StoryPage() {
  const { classId, storyId } = useParams();
  const [story, setStory] = useState(mockData);

  // 🔹 Funkcija za spremembo učenca pri odlomku
  const handleStudentChange = (excerptId: number, newStudent: string) => {
    setStory((prev) => ({
      ...prev,
      excerpts: prev.excerpts.map((ex) =>
        ex.id === excerptId ? { ...ex, student: newStudent } : ex
      ),
    }));

    // Tukaj lahko dodaš klic na backend, npr:
    // await fetch(`/api/classes/${classId}/stories/${storyId}/excerpts/${excerptId}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ student: newStudent }),
    // });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {story.title}
        </h1>

        <div className="space-y-6">
          {story.excerpts.map((excerpt) => (
            <div
              key={excerpt.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-5"
            >
              <p className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed mb-4">
                {excerpt.text}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  📘 Učenec: <strong>{excerpt.student}</strong>
                </span>

                <select
                  value={excerpt.student}
                  onChange={(e) => handleStudentChange(excerpt.id, e.target.value)}
                  className="ml-4 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {story.students.map((student) => (
                    <option key={student} value={student}>
                      {student}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
