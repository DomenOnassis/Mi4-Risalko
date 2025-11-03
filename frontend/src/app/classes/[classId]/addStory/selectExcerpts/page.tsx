'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Excerpt {
  id: string;
  text: string;
  order: number;
}

const SelectExcerptsPage = () => {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId;

  const [storyData, setStoryData] = useState<any>(null);
  const [excerpts, setExcerpts] = useState<Excerpt[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [remainingContent, setRemainingContent] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('newStory');
    if (stored) {
      const data = JSON.parse(stored);
      setStoryData(data);
      setRemainingContent(data.content);
    } else {
      router.push(`/classes/${classId}/addStory`);
    }
  }, [classId, router]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    const text = selection.toString().trim();
    const range = selection.getRangeAt(0);
    
    const container = document.getElementById('story-content');
    if (!container) return;

    const preRange = document.createRange();
    preRange.selectNodeContents(container);
    preRange.setEnd(range.startContainer, range.startOffset);
    const start = preRange.toString().length;
    const end = start + text.length;

    setSelectedText(text);
    setSelectionStart(start);
    setSelectionEnd(end);
  };

  const addExcerpt = () => {
    if (!selectedText.trim()) return;

    const newExcerpt: Excerpt = {
      id: Date.now().toString(),
      text: selectedText,
      order: excerpts.length + 1,
    };

    setExcerpts([...excerpts, newExcerpt]);
    
    // Remove the selected text from remaining content
    const newRemainingContent = remainingContent.replace(selectedText, '');
    setRemainingContent(newRemainingContent);
    
    setSelectedText('');
    setSelectionStart(null);
    setSelectionEnd(null);
    
    window.getSelection()?.removeAllRanges();
  };

  const removeExcerpt = (id: string) => {
    const excerptToRemove = excerpts.find(e => e.id === id);
    if (excerptToRemove) {
      // Add the text back to remaining content
      setRemainingContent(remainingContent + '\n' + excerptToRemove.text);
    }
    
    const filtered = excerpts.filter(e => e.id !== id);
    const reordered = filtered.map((e, index) => ({
      ...e,
      order: index + 1,
    }));
    setExcerpts(reordered);
  };

  const moveExcerptUp = (index: number) => {
    if (index === 0) return;
    const newExcerpts = [...excerpts];
    [newExcerpts[index - 1], newExcerpts[index]] = [newExcerpts[index], newExcerpts[index - 1]];
    const reordered = newExcerpts.map((e, i) => ({ ...e, order: i + 1 }));
    setExcerpts(reordered);
  };

  const moveExcerptDown = (index: number) => {
    if (index === excerpts.length - 1) return;
    const newExcerpts = [...excerpts];
    [newExcerpts[index], newExcerpts[index + 1]] = [newExcerpts[index + 1], newExcerpts[index]];
    const reordered = newExcerpts.map((e, i) => ({ ...e, order: i + 1 }));
    setExcerpts(reordered);
  };

  const handleContinue = () => {
    sessionStorage.setItem('storyExcerpts', JSON.stringify(excerpts));
    router.push(`/classes/${classId}/addStory/assignExcerpts`);
  };

  if (!storyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Nalaganje...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 dark:from-purple-900 dark:via-pink-900 dark:to-yellow-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 transition-colors font-black text-xl transform hover:scale-110"
          >
            🏠 ← Nazaj
          </button>
        </div>

        <h1 className="text-5xl font-black text-center mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-bounce-slow">
          📚 Izberi odlomke zgodbe! ✨
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-white to-yellow-100 dark:from-gray-800 dark:to-purple-900 rounded-3xl shadow-2xl p-8 border-4 border-dashed border-pink-400">
            <h2 className="text-3xl font-black mb-4 text-purple-700 dark:text-purple-200 animate-wiggle">
              📖 Vsebina zgodbe
            </h2>
            <p className="text-lg text-purple-600 dark:text-purple-300 mb-4 font-bold">
              ✏️ Izberi besedilo in pritisni gumb za dodajanje odlomka!
            </p>
            
            <div
              id="story-content"
              className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 p-6 rounded-2xl border-4 border-purple-300 dark:border-purple-700 max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-gray-800 dark:text-gray-200 select-text cursor-text font-semibold text-lg shadow-inner"
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
            >
              {remainingContent}
            </div>

            {selectedText && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 border-4 border-blue-400 dark:border-blue-600 rounded-3xl shadow-xl">
                <p className="text-lg font-black text-blue-800 dark:text-blue-200 mb-3">
                  ⭐ Izbrano besedilo:
                </p>
                <p className="text-base text-blue-700 dark:text-blue-300 italic mb-4 font-semibold">
                  "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
                </p>
                <button
                  onClick={addExcerpt}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-black py-3 px-8 rounded-full hover:from-green-500 hover:to-blue-600 transition-all shadow-xl hover:shadow-green-500/50 transform hover:scale-110 text-xl border-4 border-white"
                >
                  ➕ Dodaj odlomek! 🎉
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-white to-pink-100 dark:from-gray-800 dark:to-pink-900 rounded-3xl shadow-2xl p-8 border-4 border-dashed border-purple-400">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-purple-700 dark:text-purple-200 animate-wiggle">
                🎯 Izbrani odlomki ({excerpts.length})
              </h2>
              {excerpts.length > 0 && (
                <button
                  onClick={() => {
                    setExcerpts([]);
                    setRemainingContent(storyData.content);
                  }}
                  className="text-base text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-black transform hover:scale-110 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-full"
                >
                  🗑️ Počisti vse
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {excerpts.length === 0 ? (
                <div className="text-center py-16 text-purple-500 dark:text-purple-400">
                  <p className="text-7xl mb-4 animate-bounce-slow">📝</p>
                  <p className="text-2xl font-black mb-2">Še nisi izbral nobenega odlomka!</p>
                  <p className="text-lg mt-4 font-bold">👈 Izberi besedilo na levi strani</p>
                </div>
              ) : (
                excerpts.map((excerpt, index) => (
                  <div
                    key={excerpt.id}
                    className="bg-gradient-to-br from-yellow-200 to-pink-200 dark:from-yellow-700 dark:to-pink-700 p-6 rounded-3xl border-4 border-purple-300 dark:border-purple-600 shadow-xl transform hover:scale-105 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-block bg-purple-600 text-white text-lg font-black px-4 py-2 rounded-full shadow-lg">
                        #{excerpt.order} 🌟
                      </span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => moveExcerptUp(index)}
                          disabled={index === 0}
                          className="text-3xl hover:scale-125 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Premakni gor"
                        >
                          ⬆️
                        </button>
                        <button
                          onClick={() => moveExcerptDown(index)}
                          disabled={index === excerpts.length - 1}
                          className="text-3xl hover:scale-125 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Premakni dol"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => removeExcerpt(excerpt.id)}
                          className="text-3xl hover:scale-125 transition-transform"
                          title="Odstrani"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                    <p className="text-base text-purple-800 dark:text-purple-200 line-clamp-4 font-semibold">
                      {excerpt.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {excerpts.length > 0 && (
              <div className="mt-8 pt-8 border-t-4 border-dashed border-purple-400">
                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-black py-4 rounded-full hover:from-green-600 hover:to-blue-700 transition-all shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 text-2xl border-4 border-white"
                >
                  ➡️ Nadaljuj na dodelitev učencem! 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectExcerptsPage;
                                                         