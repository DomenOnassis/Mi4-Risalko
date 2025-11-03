"use client";
import DrawingCanvas from '../../components/DrawingCanvas';
import Link from 'next/link';
 import { useUser } from "../../hooks/useUser";

export default function DrawPage() {
  const userType = useUser();

  if (!userType) {
    return <p>Nisi prijavljen.</p>;
  }
  
  return (
    <div className="h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 dark:from-purple-900 dark:via-pink-900 dark:to-yellow-900 flex flex-col">
      <div className="px-4 py-3 flex-shrink-0 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-800 dark:to-purple-800 border-b-4 border-dashed border-yellow-400">
        <Link 
          href="/"
          className="inline-flex items-center text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-purple-100 transition-colors font-black text-lg transform hover:scale-110"
        >
          🏠 ← Nazaj na domačo stran
        </Link>
      </div>

      <div className="flex-1 px-4 pb-4 min-h-0">
        <DrawingCanvas />
      </div>
    </div>
  );
}
