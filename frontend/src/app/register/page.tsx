"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      setError("Gesli se ne ujemata!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          surname,
          email,
          password,
          type: "teacher",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pri registraciji je prišlo do napake.");
        setSuccess(null);
        return;
      }


      router.push("/draw");



      setSuccess("Uporabnik uspešno ustvarjen!");
      setError(null);
      setName("");
      setSurname("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError("Napaka pri povezavi s strežnikom.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="bg-white/90 dark:bg-gray-800/80 p-10 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Ustvari račun
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ime
            </label>
            <input
              type="text"
              placeholder="vnesi ime"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priimek
            </label>
            <input
              type="text"
              placeholder="vnesi priimek"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-pošta
            </label>
            <input
              type="email"
              placeholder="vnesi e-poštni naslov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Geslo
            </label>
            <input
              type="password"
              placeholder="vnesi geslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Potrdi geslo
            </label>
            <input
              type="password"
              placeholder="ponovno vnesi geslo"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-semibold py-2 rounded-lg hover:from-pink-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Registracija
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Že imaš račun?{" "}
          <a href="/login-teacher" className="text-purple-600 hover:underline">
            Prijavi se
          </a>
        </p>
      </div>
    </div>
  );
}
