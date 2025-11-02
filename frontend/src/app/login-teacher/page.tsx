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
    <div className="background flex items-center justify-center">
      <div className="section-dark w-md">
        <h1 className="text-3xl font-bold text-center mb-6 gradient-text">
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
              className="input-text"
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