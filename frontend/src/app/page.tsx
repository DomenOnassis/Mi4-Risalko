"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 dark:from-purple-900 dark:via-pink-900 dark:to-yellow-900">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-bounce-slow">
          <h1 className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl transform hover:scale-105 transition-transform">
            🎨 Risalko 🌈
          </h1>
          <p className="text-2xl md:text-3xl text-purple-700 dark:text-purple-300 max-w-3xl mx-auto leading-relaxed font-bold">
            Kjer zgodbe oživijo skozi otroško domišljijo in umetnost! ✨
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-700 dark:to-orange-700 rounded-3xl p-8 shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-110 hover:rotate-2">
            <div className="text-6xl mb-4 animate-wiggle">📖</div>
            <h2 className="text-3xl font-black mb-3 text-orange-800 dark:text-orange-100">
              Preberi zgodbe
            </h2>
            <p className="text-lg text-orange-700 dark:text-orange-200 font-semibold">
              Učitelji delijo vznemirljive odlomke zgodb, ki vzbudijo
              ustvarjalnost in radovednost! 🌟
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-200 to-purple-300 dark:from-pink-700 dark:to-purple-700 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-110 hover:rotate-2">
            <div className="text-6xl mb-4 animate-wiggle">🎨</div>
            <h2 className="text-3xl font-black mb-3 text-purple-800 dark:text-purple-100">
              Riši in ustvari
            </h2>
            <p className="text-lg text-purple-700 dark:text-purple-200 font-semibold">
              Učenci oživijo svojo domišljijo s pisanimi risbami in
              ilustracijami! 🖍️
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-200 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-110 hover:rotate-2">
            <div className="text-6xl mb-4 animate-wiggle">✨</div>
            <h2 className="text-3xl font-black mb-3 text-blue-800 dark:text-blue-100">
              Ustvarjajte skupaj
            </h2>
            <p className="text-lg text-blue-700 dark:text-blue-200 font-semibold">
              Sodelujte pri ustvarjanju novih zgodb, polnih umetnosti in
              domišljije! 🎪
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-block bg-gradient-to-br from-white to-yellow-100 dark:from-gray-800 dark:to-purple-900 rounded-3xl p-10 shadow-2xl border-4 border-dashed border-pink-400 dark:border-pink-600 transform hover:scale-105 transition-transform">
            <h3 className="text-4xl font-black mb-4 text-purple-700 dark:text-purple-200">
              🚀 Pripravljeni začeti svojo ustvarjalno pot?
            </h3>
            <p className="text-xl text-purple-600 dark:text-purple-300 mb-8 font-bold">
              Pridružite se Risalku in sprostite svojo domišljijo! 🎉
            </p>
             <div className="space-y-6">
      <button
        onClick={() => router.push("/register")}
        className="cursor-pointer bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-white font-black text-xl px-12 py-4 rounded-full hover:from-pink-500 hover:to-blue-600 transition-all shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 border-4 border-white"
      >
        🪄 Registriraj se 🌟
      </button>

      <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
        <button
          onClick={() => router.push("/login-student")}
          className="cursor-pointer bg-gradient-to-r from-green-400 to-blue-500 text-white font-black text-lg px-10 py-4 rounded-full hover:from-green-500 hover:to-blue-600 transition-all shadow-xl hover:shadow-green-500/50 transform hover:scale-110 border-4 border-white"
        >
          👦 Prijavi se kot učenec 🎒
        </button>
        <button
          onClick={() => router.push("/login-teacher")}
          className="cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-lg px-10 py-4 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all shadow-xl hover:shadow-yellow-500/50 transform hover:scale-110 border-4 border-white"
        >
          👨‍🏫 Prijavi se kot učitelj 📚
        </button>
      </div>
          </div>
            
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-purple-600 dark:text-purple-400 font-bold text-lg">
        <p>🌈 © 2025 Risalko - Opolnomočimo mlade pripovedovalce in umetnike! 🎨</p>
      </footer>
    </div>
  );
}
