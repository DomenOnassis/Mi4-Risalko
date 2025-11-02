"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function LoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    console.log("FORM SUBMITTED!");
    e.preventDefault();
    Cookies.set("userType", "student", { expires: 7 });
    router.push("/classes");{/**classes/id/  vidi svoje zgodbe -> ko na zgodbo klikne vidi paragraph, in ko klikne na exceprt lahko riše*/}
    console.log("key:", key);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Prijavi se kot učenec
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="key"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Ključ
            </label>
            <input
              id="key"
              name="key"
              type="text"
              placeholder="vnesi ključ"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            Prijava
          </button>
        </form>
      </div>
    </div>
  );
}
