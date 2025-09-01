"use client"

import Button from "@/components/Button";


export default function Home() {
  return (
    <div className="home-container">
      <h1>Chatsites</h1>
      <h2>Tu mejor lugar para comunicarte</h2>
      <div className="entrar-home">
        <p>Empieza a chatear ya</p>
        <Button text="ChatSites"></Button>
      </div>
      <p className="footer-home"></p>
    </div>
  );
}
