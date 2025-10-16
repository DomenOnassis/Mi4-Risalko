export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Risalko
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Kjer zgodbe oživijo skozi otroško domišljijo in umetnost
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📖</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Preberi zgodbe
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Učitelji delijo vznemirljive odlomke zgodb, ki vzbudijo ustvarjalnost in radovednost
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Riši in ustvari
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Učenci oživijo svojo domišljijo s pisanimi risbami in ilustracijami
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Ustvarjajte skupaj
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sodelujte pri ustvarjanju novih zgodb, polnih umetnosti in domišljije
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-block bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Pripravljeni začeti svojo ustvarjalno pot?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Pridružite se Risalku in sprostite svojo domišljijo!
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
              Začni
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-600 dark:text-gray-400">
        <p>© 2025 Risalko - Opolnomočimo mlade pripovedovalce in umetnike</p>
      </footer>
    </div>
  );
}
