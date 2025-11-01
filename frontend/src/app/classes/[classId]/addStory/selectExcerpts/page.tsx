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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
          >
            ← Nazaj
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Izberi odlomke zgodbe
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Vsebina zgodbe
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Izberi besedilo in pritisni gumb za dodajanje odlomka
            </p>
            
            <div
              id="story-content"
              className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-300 dark:border-gray-700 max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-gray-800 dark:text-gray-200 select-text cursor-text"
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
            >
              {remainingContent}
            </div>

            {selectedText && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Izbrano besedilo:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">
                  "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
                </p>
                <button
                  onClick={addExcerpt}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  ➕ Dodaj odlomek
                </button>
              </div>
            )}
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Izbrani odlomki ({excerpts.length})
              </h2>
              {excerpts.length > 0 && (
                <button
                  onClick={() => {
                    setExcerpts([]);
                    setRemainingContent(storyData.content);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                >
                  Počisti vse
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {excerpts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg mb-2">📝</p>
                  <p>Še nisi izbral nobenega odlomka</p>
                  <p className="text-sm mt-2">Izberi besedilo na levi strani</p>
                </div>
              ) : (
                excerpts.map((excerpt, index) => (
                  <div
                    key={excerpt.id}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="inline-block bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                        #{excerpt.order}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveExcerptUp(index)}
                          disabled={index === 0}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Premakni gor"
                        >
                          ⬆️
                        </button>
                        <button
                          onClick={() => moveExcerptDown(index)}
                          disabled={index === excerpts.length - 1}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Premakni dol"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => removeExcerpt(excerpt.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Odstrani"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                      {excerpt.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {excerpts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  ➡️ Nadaljuj na dodelitev učencem
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
