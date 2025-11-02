"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    console.log("FORM SUBMITTED!");
    e.preventDefault();
    
try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pri prijavi je prišlo do napake.");
        setSuccess(null);
        return;
      }

      Cookies.set("userType", "teacher", { expires: 7 }); 
      router.push("/classes");
     


      setSuccess("Uporabnik uspešno ustvarjen!");
      setError(null);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Napaka pri povezavi s strežnikom.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Prijavi se kot učitelj
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
     
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-pošta
            </label>
            <input
              id="email"
              type="email"
              placeholder="vnesi e-poštni naslov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Geslo
            </label>
            <input
              id="password"
              type="password"
              placeholder="vnesi geslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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