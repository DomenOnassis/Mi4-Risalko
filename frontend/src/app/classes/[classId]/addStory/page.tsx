'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const AddStoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'text' | 'txt'>('text');
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txtContent, setTxtContent] = useState<string>('');
  const [isReadingTxt, setIsReadingTxt] = useState(false);

  const handleTxtFileRead = async (file: File): Promise<string> => {
    try {
      const text = await file.text();
      if (!text || text.trim().length === 0) {
        throw new Error('TXT datoteka ne vsebuje besedila');
      }
      return text;
    } catch (e) {
      console.error('TXT read error:', e);
      throw new Error('Napaka pri branju TXT datoteke');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      setTxtFile(file);
      setError(null);
      setIsReadingTxt(true);

      try {
        const text = await handleTxtFileRead(file);
        setTxtContent(text);
        setContent(text);
      } catch (err) {
        console.error('TXT read failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Napaka pri branju TXT datoteke';
        setError(errorMessage);
        setTxtContent('');

        alert('Napaka pri branju .txt datoteke. Lahko vnesete besedilo ročno v polje za besedilo.');
        setUploadMethod('text');
      } finally {
        setIsReadingTxt(false);
      }
    } else {
      setError('Prosim naložite .txt datoteko');
      setTxtFile(null);
      setTxtContent('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let storyContent = content;

      if (uploadMethod === 'txt' && txtFile && txtContent) {
        storyContent = txtContent;
      }

      // Store story data with all required backend fields
      const storyData = {
        title,
        author,
        shortDescription,
        content: storyContent,
        fullText: storyContent, // Keep fullText for paragraph extraction
      };

      sessionStorage.setItem('newStory', JSON.stringify(storyData));
      
      router.push(`/classes/${classId}/addStory/selectExcerpts`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka pri ustvarjanju zgodbe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
            >
              ← Nazaj
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dodaj novo zgodbo
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Naslov zgodbe *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Vnesi naslov zgodbe"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avtor *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Vnesi ime avtorja"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kratek opis
              </label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Vnesi kratek opis zgodbe (opciono)..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Dolžina: {shortDescription.length} znakov
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Način vnosa vsebine *
              </label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('text')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    uploadMethod === 'text'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  📝 Besedilo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('txt')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    uploadMethod === 'txt'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  📄 .txt
                </button>
              </div>
            </div>

            {uploadMethod === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vsebina zgodbe *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Vnesi ali prilepi vsebino zgodbe..."
                  required
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Dolžina: {content.length} znakov
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Naloži .txt datoteko *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="txt-upload"
                    required={uploadMethod === 'txt'}
                    disabled={isReadingTxt}
                  />
                  <label
                    htmlFor="txt-upload"
                    className={`cursor-pointer inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg ${
                      isReadingTxt ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isReadingTxt ? '⏳ Branje .txt...' : '📤 Izberi .txt datoteko'}
                  </label>
                  
                  {txtFile && (
                    <div className="mt-4 text-gray-700 dark:text-gray-300">
                      <p className="font-medium">Izbrana datoteka:</p>
                      <p className="text-sm">{txtFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(txtFile.size / 1024).toFixed(2)} KB
                      </p>
                      {isReadingTxt && (
                        <p className="text-sm text-blue-600 mt-2">
                          ⏳ Branje .txt datoteke...
                        </p>
                      )}
                      {txtContent && !isReadingTxt && (
                        <p className="text-sm text-green-600 mt-2">
                          ✅ Besedilo uspešno naloženo ({txtContent.length} znakov)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {txtContent && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vsebina iz .txt datoteke:
                    </label>
                    <textarea
                      value={txtContent}
                      onChange={(e) => {
                        setTxtContent(e.target.value);
                        setContent(e.target.value);
                      }}
                      placeholder="Vsebina iz .txt datoteke se bo pojavila tukaj..."
                      rows={10}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Dolžina: {txtContent.length} znakov - Lahko uredite besedilo po potrebi
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 Besedilo iz .txt datoteke bo prikazano za urejanje
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Prekliči
              </button>
              <button
                type="submit"
                disabled={isLoading || isReadingTxt || (uploadMethod === 'txt' && !txtContent)}
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '⏳ Ustvarjam...' : 
                 isReadingTxt ? '⏳ Branje .txt...' :
                 uploadMethod === 'txt' && !txtContent ? '📄 Najprej naložite .txt' :
                 '✨ Ustvari zgodbo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStoryPage;