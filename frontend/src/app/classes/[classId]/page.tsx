"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ClassPage = () => {
  type Story = {
    _id: string | { $oid: string };
    title: string;
    short_description: string;
    author?: string;
    is_finished?: boolean;
  };

  type FinalizedStory = {
    story_id: string | { $oid: string };
    images: string[];
    story?: {
      title: string;
      short_description: string;
      author?: string;
    };
  };

  const [stories, setStories] = useState<Story[]>([]);
  const [finalizedStories, setFinalizedStories] = useState<FinalizedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [className, setClassName] = useState('');
  const [userParagraphs, setUserParagraphs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"workshop" | "finished">(
    "workshop"
  );
  const [slideshowStory, setSlideshowStory] = useState<FinalizedStory | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const params = useParams();
  const router = useRouter();
  const classId = params.classId;

  useEffect(() => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
      try {
        const user = JSON.parse(userStored);
        setUserType(user.type || null);
        setUserId(user._id?.$oid || user._id || user.id);
        const paragraphIds = (user.paragraphs || []).map((p: any) => 
          typeof p === 'string' ? p : p.$oid
        );
        setUserParagraphs(paragraphIds);
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

          // Set finalized stories with story details
          const finalized = (cls.finalized_stories || []).map((fs: any) => ({
            story_id: fs.story_id,
            images: fs.images || [],
            story: fs.story || {
              title: 'Neznana zgodba',
              short_description: '',
              author: ''
            }
          }));
          setFinalizedStories(finalized);
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

  const isTeacher = userType === "teacher";
  const isStudent = userType === "student";

  const handleNextImage = () => {
    if (slideshowStory) {
      setCurrentImageIndex((prev) => (prev + 1) % slideshowStory.images.length);
    }
  };

  const handlePrevImage = () => {
    if (slideshowStory) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? slideshowStory.images.length - 1 : prev - 1
      );
    }
  };

  const openSlideshow = (story: FinalizedStory) => {
    setSlideshowStory(story);
    setCurrentImageIndex(0);
  };

  const closeSlideshow = () => {
    setSlideshowStory(null);
    setCurrentImageIndex(0);
  };

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
            <p className="text-gray-300 font-semibold text-lg">
              {isStudent ? 'Moje naloge' : 'Zgodbe in učenci'}
            </p>
          </div>

          {isTeacher && (
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
          {isTeacher && (
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
          </div>

          {/* Active Stories */}
          {activeTab === "workshop" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {isStudent ? 'Moje naloge' : 'Aktivne zgodbe'}
              </h2>

              {stories.length === 0 ? (
                <p className="text-text-muted text-center py-8">
                  {isStudent ? 'Nimate dodeljenih nalogic.' : 'Ni aktivnih zgodb. Ustvarite novo!'}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.filter(s => !s.is_finished).map((story) => (
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
                      {isStudent && (
                        <p className="text-xs text-text-muted mt-3 pt-3 border-t border-text-muted/30">
                          📝 Tvoja naloga
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Finalized Stories */}
          {activeTab === "finished" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Dokončane slikanice
              </h2>

              {finalizedStories.length === 0 ? (
                <p className="text-text-muted text-center py-8">Ni dokončanih slikanica.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {finalizedStories.map((story, idx) => {
                    const storyId = story.story_id 
                      ? (typeof story.story_id === "string" ? story.story_id : story.story_id.$oid)
                      : `story-${idx}`;
                    const hasImages = story.images && story.images.length > 0;
                    
                    return (
                      <button
                        key={storyId}
                        onClick={() => hasImages && openSlideshow(story)}
                        disabled={!hasImages}
                        className={`card cursor-pointer hover:shadow-xl transition-shadow text-left ${
                          hasImages 
                            ? 'bg-green-400' 
                            : 'bg-gray-400 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <h3 className="text-lg font-semibold text-text mb-2">
                          {story.story?.title || 'Neznana zgodba'}
                        </h3>
                        <p className="text-text-muted line-clamp-3">
                          {story.story?.short_description || "Brez opisa"}
                        </p>
                        {story.story?.author && (
                          <p className="text-sm text-text-muted mt-3 font-medium">
                            Avtor: {story.story.author}
                          </p>
                        )}
                        <p className="text-xs text-text-muted mt-3 pt-3 border-t border-text-muted/30">
                          📚 {story.images?.length || 0} slik
                        </p>
                        {!hasImages && (
                          <p className="text-xs text-red-600 font-semibold mt-2">
                            Ni slik za prikaz
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Slideshow Modal */}
      {slideshowStory && slideshowStory.images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={closeSlideshow}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>

          <div className="w-full h-full flex flex-col items-center justify-center px-4">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                {slideshowStory.story?.title}
              </h2>
              <p className="text-gray-300">
                Slika {currentImageIndex + 1} od {slideshowStory.images.length}
              </p>
            </div>

            {/* Image Container */}
            <div className="relative w-full max-w-4xl h-96 flex items-center justify-center mb-6">
              <img
                src={slideshowStory.images[currentImageIndex]}
                alt={`Slika ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-8">
              <button
                onClick={handlePrevImage}
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-full p-3 transition-colors"
                aria-label="Prejšnja slika"
              >
                <ChevronLeft size={32} />
              </button>

              {/* Progress Bar */}
              <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all"
                  style={{
                    width: `${((currentImageIndex + 1) / slideshowStory.images.length) * 100}%`,
                  }}
                />
              </div>

              <button
                onClick={handleNextImage}
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-full p-3 transition-colors"
                aria-label="Naslednja slika"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;