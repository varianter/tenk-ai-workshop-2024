"use client";

import { useState } from "react";
import { Chat } from "./Chat";
import SystemInput from "./SystemInput";
import { Message } from "ai";

export default function Content() {
  const [messages, setMessages] = useState<Message[]>([]);

  const systemOptions = [
    {
      name: "Pirate",
      prompt:
        "You´re a nice assistant that talks like a pirate. Check previous messages for answers before answering any questions. If you don´t know the answer state that you do know know it",
    },
    {
      name: "Friendly",
      prompt:
        "You´re a friendly assistant. Check previous messages for answers before answering any questions. If you don´t know the answer state that you do know know it",
    },
    {
      name: "Grumpy",
      prompt:
        "You´re a grumpy assistant. Check previous messages for answers before answering any questions.",
    },
  ];

  const [systemPrompt, setSystemPrompt] = useState<string>(
    systemOptions[1].prompt
  );

  return (
    <main className="main">
      <div className="system-settings-box">
        <div className="box-with-title">
          <h2>System settings</h2>
          <div className="system-settings-button-group">
            {systemOptions.map((option) => (
              <button
                key={option.name}
                className={`system-settings-button ${
                  systemPrompt === option.prompt
                    ? "system-settings-button-selected"
                    : ""
                }`}
                onClick={() => setSystemPrompt(option.prompt)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
        <div className="box-with-title">
          <h2>Info</h2>
          <SystemInput messages={messages} setMessages={setMessages} />
        </div>
      </div>
      <div className="box-with-title">
        <h2>Chat</h2>
        <Chat initialMessages={messages} systemPrompt={systemPrompt} />
      </div>
    </main>
  );
}
