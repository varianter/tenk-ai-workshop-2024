"use client";
import { Message } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db.models";
import { v4 } from "uuid";

export default function SystemInput({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}) {
  const [input, setInput] = useState("");
  const [recievedDbMessages, setRecievedDbMessages] = useState<boolean>(false);

  const dbMessages = useLiveQuery(() => db.messages.toArray()) || [];

  useEffect(() => {
    if (recievedDbMessages || dbMessages.length < 1) return;
    setMessages(dbMessages);
    setRecievedDbMessages(true);
  }, [dbMessages, recievedDbMessages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages([
      ...messages,
      { content: input, role: "system", id: messages.length.toString() },
    ]);

    setInput("");
  };

  const addMessage = useCallback(async (message: Message) => {
    await db.messages.add({
      content: message.content,
      role: message.role,
      id: message.id,
      createdAt: message.createdAt || new Date(),
    });
  }, []);

  return (
    <div className={styles.chatBox}>
      <MessageList messages={messages} />{" "}
      <InputField
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={(e) => setInput(e.target.value)}
        addMessage={addMessage}
      />
    </div>
  );
}

function MessageList({ messages }: { messages: Message[] }) {
  const chatContainerRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    <ul className={` ${styles.messageList} `} ref={chatContainerRef}>
      {messages
        .filter((message) => message.role == "system")
        .map((message, index) => {
          return (
            <li key={index} className={styles.inputBoxMessage}>
              <div className={styles.inputMessage}>
                <p style={{ whiteSpace: "pre", textWrap: "wrap" }}>
                  {message.content}
                </p>
              </div>
            </li>
          );
        })}
    </ul>
  );
}

function InputField({
  input,
  handleInputChange,
  handleSubmit,
  addMessage,
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  addMessage: (message: Message) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
        addMessage({
          role: "system",
          content: input,
          id: v4(),
          createdAt: new Date(),
        });
      }}
      className={styles.sendMessageForm}
    >
      <input
        onChange={handleInputChange}
        value={input}
        placeholder="Legg inn info"
        type="text"
      />
    </form>
  );
}
