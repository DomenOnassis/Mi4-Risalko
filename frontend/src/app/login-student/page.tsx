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
    <div className="background flex items-center justify-center">
      <div className="section-dark w-md">
        <h1 className="text-3xl font-bold text-center mb-6 gradient-text">
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
              className="input-text"
              required
            />
          </div>

          <button
            type="submit"
            className="btn bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-100 text-black w-full"
          >
            Prijava
          </button>
        </form>
      </div>
    </div>
  );
}
