"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

const ClassPage = () => {
  type Story = {
    _id: string | { $oid: string };
    title: string;
    short_description: string;
  };
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const params = useParams();
  const classId = params.classId;
  const [activeTab, setActiveTab] = useState<"workshop" | "finished">(
    "workshop"
  );
useEffect(() => {
  const type = Cookies.get("userType");
  setUserType(type || null); 
}, []);



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
// 🔹 Če je študent, pokažemo samo njegove zgodbe
  const filteredStories =
    userType === "student"
      ? stories.filter((s) => {
          // preprosto filtriranje po nečem (tu lahko dodaš dejansko logiko po ID-ju)
          // če boš kasneje imel story_id pri študentu, filtriraj po njem
          return true; // zdaj še vsi
        })
      : stories;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200">
      <h1 className="text-5xl font-black mb-6 text-purple-700 animate-bounce-slow">🎪 Razred ID: {classId}</h1>

      {/* 🔹 Gumb "Dodaj učenca" samo za učitelja */}
      {userType === "teacher" && (
        <div className="mb-8">
          <Link
            href={`/classes/${classId}/addStudents`}
            className="inline-block bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-black py-3 px-8 rounded-full transition-all shadow-xl transform hover:scale-110 text-xl border-4 border-white"
          >
            👦 Dodaj učenca 🎒
          </Link>
        </div>
      )}

      <div className="border-b border-gray-300 mb-4 flex gap-6">
        <button
          onClick={() => setActiveTab("workshop")}
          className={`cursor-pointer pb-3 font-black text-xl transform transition-all ${
            activeTab === "workshop"
              ? "text-pink-600 border-b-4 border-pink-600 scale-110"
              : "text-purple-500 hover:text-purple-700 hover:scale-105"
          }`}
        >
          🎨 Delavnica
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
          <div className="flex items-center gap-x-4 mb-8">
            <h2 className="text-4xl font-black text-purple-700">📚 Aktivne zgodbe</h2>

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
                <div className="text-5xl mb-3 animate-float">📖</div>
                <h3 className="text-2xl font-black text-purple-800 mb-3 text-center">
                  {story.title}
                </h3>
                <p className="text-base text-purple-700 text-center line-clamp-3 font-semibold">
                  {story.short_description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === "finished" && userType === "teacher" && (
        <div>
          <h2 className="text-4xl font-black mb-6 text-purple-700 animate-wiggle">
            🌟 Tukaj učitelj vidi že dokončane zgodbe svojih učencev! 🎉
          </h2>

          <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stories.map((story) => (
              <div
                key={typeof story._id === "string" ? story._id : story._id.$oid}
                className="bg-gradient-to-br from-yellow-200 to-green-300 rounded-3xl shadow-2xl p-6 flex flex-col items-center justify-center hover:shadow-green-500/50 transition-all transform hover:scale-110 hover:rotate-2 border-4 border-white"
              >
                <div className="text-5xl mb-3 animate-wiggle">✨</div>
                <h3 className="text-2xl font-black text-green-800 mb-3 text-center">
                  {story.title}
                </h3>
                <p className="text-base text-green-700 text-center line-clamp-3 font-semibold">
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