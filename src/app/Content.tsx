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

  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  //Check previous messages for answers before answering any questions. If you don't know the answer state that you do know know it

  //const baseSystemPrompt = `Ta utgangspunkt i informasjonen gitt i system meldinger markert med "KONTEKST START" for å svare på spørsmål og kommentarer brukeren kommer med. Hvis du ikke vet svaret si at dette vet du ikke, men at brukeren kan legge inn infoen i boksen til venstre. Svar på samme språk som brukeren bruker  \n`;

  const baseSystemPrompt = `Take the information given in system messages marked with "CONTEXT START" as a basis for answering questions and comments the user comes with. If you do not know the answer, say that you do not know, but that the user can enter the information in the box to the left. Answer in the same language as the user uses \n`;

  const systemOptions = [
    {
      name: "Friendly",
      prompt: "You're a friendly assistant. " + baseSystemPrompt,
    },
    {
      name: "Grumpy",
      prompt: "You're a grumpy assistant. " + baseSystemPrompt,
    },
    {
      name: "Pirate",
      prompt:
        "You're a nice assistant that talks like a pirate. " + baseSystemPrompt,
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
          setLastMessage={setLastMessage}
        />
      </div>
      <div className={styles.printContainer}>
        <h2>Print</h2>
        <div style={{ overflow: "scroll" }}>
          <h3>Sendt</h3>
          <pre style={{ whiteSpace: "pre" }}>
            {JSON.stringify(
              [{ content: systemPrompt, role: "system", id: "0" }, ...messages],
              null,
              2
            )}
          </pre>
          <h3>Mottatt</h3>
          <pre style={{ whiteSpace: "pre" }}>
            {JSON.stringify(lastMessage, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
