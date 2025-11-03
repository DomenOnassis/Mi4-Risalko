"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const ClassPage = () => {
  type Story = {
    _id: string | { $oid: string };
    title: string;
    short_description: string;
    author?: string;
    is_finished?: boolean;
  };
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [className, setClassName] = useState('');
  const params = useParams();
  const router = useRouter();
  const classId = params.classId;
  const [activeTab, setActiveTab] = useState<"workshop" | "finished">(
    "workshop"
  );

  useEffect(() => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
      try {
        const user = JSON.parse(userStored);
        setUserType(user.type || null);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/classes/${classId}?populate=true`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.data) {
          const cls = data.data;
          setClassName(cls.class_name || '');
          
          const classStories = cls.stories || [];
          setStories(classStories);
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju podatkov razreda:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  if (loading) {
    return (
      <div className="background">
        <p className="text-text text-center pt-8">Nalaganje razreda...</p>
      </div>
    );
  }

  return (
    <div className="background">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gray-700/90 p-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => router.back()}
                className="text-gray-300 hover:text-gray-100 transition-colors text-lg font-semibold"
              >
                ←
              </button>
              <h1 className="text-3xl font-bold text-gray-200">{className || 'Razred'}</h1>
            </div>
            <p className="text-gray-300 font-semibold text-lg">Zgodbe in učenci</p>
          </div>

          {userType === "teacher" && (
            <Link
              href={`/classes/${classId}/addStory`}
              className="btn bg-yellow-100 text-text"
            >
              + Dodaj zgodbo
            </Link>
          )}
        </div>

        <div className="p-8">
          {/* Teacher Controls */}
          {userType === "teacher" && (
            <div className="mb-6">
              <Link
                href={`/classes/${classId}/addStudents`}
                className="inline-block bg-sky-400 hover:bg-sky-500 text-text font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                + Dodaj učenca
              </Link>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-300 mb-6 flex gap-6">
            <button
              onClick={() => setActiveTab("workshop")}
              className={`cursor-pointer pb-2 font-semibold text-lg ${
                activeTab === "workshop"
                  ? "text-sky-500 border-b-4 border-sky-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Delavnica
            </button>

            {userType === "teacher" && (
              <button
                onClick={() => setActiveTab("finished")}
                className={`cursor-pointer pb-2 font-semibold text-lg ${
                  activeTab === "finished"
                    ? "text-sky-500 border-b-4 border-sky-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dokončane
              </button>
            )}
          </div>

          {/* Active Stories */}
          {activeTab === "workshop" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Aktivne zgodbe</h2>

              {stories.length === 0 ? (
                <p className="text-text-muted text-center py-8">Ni aktivnih zgodb. Ustvarite novo!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map((story) => (
                    <Link
                      key={typeof story._id === "string" ? story._id : story._id.$oid}
                      href={`/classes/${classId}/${
                        typeof story._id === "string" ? story._id : story._id.$oid
                      }`}
                      className="card bg-sky-400 cursor-pointer hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-text mb-2">
                        {story.title}
                      </h3>
                      <p className="text-text-muted line-clamp-3">
                        {story.short_description || "Brez opisa"}
                      </p>
                      {story.author && (
                        <p className="text-sm text-text-muted mt-3 font-medium">
                          Avtor: {story.author}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Finished Stories */}
          {activeTab === "finished" && userType === "teacher" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dokončane zgodbe</h2>

              {stories.filter(s => s.is_finished).length === 0 ? (
                <p className="text-text-muted text-center py-8">Ni dokončanih zgodb.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories
                    .filter(s => s.is_finished)
                    .map((story) => (
                      <div
                        key={typeof story._id === "string" ? story._id : story._id.$oid}
                        className="card bg-green-400"
                      >
                        <h3 className="text-lg font-semibold text-text mb-2">
                          {story.title}
                        </h3>
                        <p className="text-text-muted line-clamp-3">
                          {story.short_description || "Brez opisa"}
                        </p>
                        {story.author && (
                          <p className="text-sm text-text-muted mt-3 font-medium">
                            Avtor: {story.author}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassPage;