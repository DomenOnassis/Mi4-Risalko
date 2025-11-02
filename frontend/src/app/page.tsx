"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="background">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-outline-dark text-[110px] font-bold mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-300 bg-clip-text text-transparent">
            Risalko
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Kjer zgodbe oživijo skozi otroško domišljijo in umetnost
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="section-gray">
            <div className="text-4xl mb-4">📖</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Preberi zgodbe
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Učitelji delijo vznemirljive odlomke zgodb, ki vzbudijo
              ustvarjalnost in radovednost
            </p>
          </div>

          <div className="section-gray">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Riši in ustvari
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Učenci oživijo svojo domišljijo s pisanimi risbami in
              ilustracijami
            </p>
          </div>

          <div className="section-gray">
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Ustvarjajte skupaj
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sodelujte pri ustvarjanju novih zgodb, polnih umetnosti in
              domišljije
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="section-dark">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Pripravljeni začeti svojo ustvarjalno pot?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Pridružite se Risalku in sprostite svojo domišljijo!
            </p>
             <div className="space-y-4">
      <button
        onClick={() => router.push("/register")}
        className="btn bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-300 text-black"
      >
        Registriraj se
      </button>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button
          onClick={() => router.push("/login-student")}
          className="btn bg-yellow-100 text-black"
        >
          Prijavi se kot učenec
        </button>
        <button
          onClick={() => router.push("/login-teacher")}
          className="btn bg-purple-100 text-black"
        >
          Prijavi se kot učitelj
        </button>
      </div>
          </div>
            
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-600 dark:text-gray-400">
        <p>© 2025 Risalko - Opolnomočimo mlade pripovedovalce in umetnike</p>
      </footer>
    </div>
  );
}
