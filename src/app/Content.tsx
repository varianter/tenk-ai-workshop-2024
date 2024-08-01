"use client";

import { useState } from "react";
import { Chat } from "./Chat";
import SystemInput from "./SystemInput";
import { Message } from "ai";
import styles from "./styles.module.css";
import SystemSettingButtons from "./SystemSettingButtons";

export default function Content() {
  const [infoMessages, setInfoMessages] = useState<Message[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  const systemOptions = [
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
    {
      name: "Pirate",
      prompt:
        "You´re a nice assistant that talks like a pirate. Check previous messages for answers before answering any questions. If you don´t know the answer state that you do know know it",
    },
  ];

  const [systemPrompt, setSystemPrompt] = useState<string>(
    systemOptions[0].prompt
  );

  return (
    <main className={styles.gridWrapper}>
      <div className={styles.systemSettingsContainer}>
        <h2>System settings</h2>
        <SystemSettingButtons
          systemOptions={systemOptions}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
        />
      </div>
      <div className={styles.inputBoxContainer}>
        <h2>Info</h2>
        <SystemInput messages={infoMessages} setMessages={setInfoMessages} />
      </div>
      <div className={styles.chatBoxContainer}>
        <h2>Chat</h2>
        <Chat
          initialMessages={infoMessages}
          systemPrompt={systemPrompt}
          setAllMessages={setMessages}
        />
      </div>
      <div className={styles.printContainer}>
        <h2>Print</h2>
        <div style={{ overflow: "scroll" }}>
          <h3>System Prompt</h3>
          <p>{systemPrompt}</p>
          <h3>Messages</h3>
          <pre>{JSON.stringify(messages, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
