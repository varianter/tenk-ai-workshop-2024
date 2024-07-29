import "./globals.css";
import { Chat } from "./Chat";
import { useChat } from "ai/react";

export default async function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="Header-link"> AI Chat </p>
      </header>
      <main className="chat-box-container">
        {/* <AI system="You are a friendly assistant" /> */}
        <Chat />
      </main>
    </div>
  );
}
