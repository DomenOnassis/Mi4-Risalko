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
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex flex-col">
      <div className="px-4 py-3 flex-shrink-0">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
        >
          ← Nazaj na domačo stran
        </Link>
      </div>

      <div className="flex-1 px-4 pb-4 min-h-0">
        <DrawingCanvas />
      </div>
    </div>
  );
}
