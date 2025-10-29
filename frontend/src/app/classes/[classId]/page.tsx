"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ClassPage = () => {
  type Story = {
    _id: string | { $oid: string };
    title: string;
    short_description: string;
  };
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const classId = params.classId;
  const [activeTab, setActiveTab] = useState<"workshop" | "finished">(
    "workshop"
  );

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/stories", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.data) setStories(data.data);
      } catch (error) {
        console.error("Napaka pri pridobivanju zgodb:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) return <p>Nalaganje zgodb...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Class ID: {classId}</h1>

      <div className="mb-6">
        <Link
          href={`/classes/${classId}/addStudents`}
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Dodaj učenca
        </Link>
      </div>

      <div className="border-b border-gray-300 mb-4 flex gap-6">
        <button
          onClick={() => setActiveTab("workshop")}
          className={`cursor-pointer pb-2 font-semibold ${
            activeTab === "workshop"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Delavnica
        </button>

        <button
          onClick={() => setActiveTab("finished")}
          className={`cursor-pointer pb-2 font-semibold ${
            activeTab === "finished"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Dokončane zgodbe
        </button>
      </div>

      {activeTab === "workshop" && (
        <div>
          <div className="flex items-center gap-x-3 mb-6 pb-5">
            <h2 className="text-xl font-semibold">Aktivne zgodbe</h2>

            {/*addStory */}
            <Link
              href={`/classes/${classId}/addStory`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-full transition-colors text-lg"
            >
              +
            </Link>
          </div>

          <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stories.map((story) => (
              <div
                key={typeof story._id === "string" ? story._id : story._id.$oid}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 text-center line-clamp-3">
                  {story.short_description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "finished" && (
        <div>
          <h2 className="text-xl font-semibold mb-3 pb-5">
            Tukaj učitelj vidi že dokončane zgodbe svojih učencev
          </h2>

          <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stories.map((story) => (
              <div
                key={typeof story._id === "string" ? story._id : story._id.$oid}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 text-center line-clamp-3">
                  {story.short_description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;
