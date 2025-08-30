'use client'
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";
import Login from "./(auth)/AuthPage/page";
import { useState } from "react";

export default function Home() {
  const [user, setUser] = useLocalStorage("currentUser", null);

  if (!user) {
    return <Login onLogin={setUser}/>;
  }
  return (
    <div className="">

      Hello World
    </div>
  );
}
