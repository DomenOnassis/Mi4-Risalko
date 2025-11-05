"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function useUser() {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const typeFromCookie = Cookies.get("userType");
    if (typeFromCookie) {
      setUserType(typeFromCookie);
      return;
    }

    try {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const parsed = JSON.parse(userRaw);
        if (parsed && parsed.type) {
          setUserType(parsed.type);
          return;
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }

    setUserType(null);
  }, []);

  return userType;
}
