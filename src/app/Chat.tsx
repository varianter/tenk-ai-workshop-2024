"use client";

import { Message } from "ai";
import styles from "./styles.module.css";
import { useChat } from "ai/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db.models";
import { v4 as uuidv4 } from "uuid";

export function Chat({
  initialMessages: infoMessages,
  systemPrompt,
  setAllMessages,
  setLastMessage,
}: {
  initialMessages: Message[];
  systemPrompt: string;
  setAllMessages: (messages: Message[]) => void;
  setLastMessage: (message: Message | null) => void;
}) {
  const [recievedDbMessages, setRecievedDbMessages] = useState<boolean>(false);

  const [error, setError] = useState<boolean>(false);

  // dexie hook to get live data
  const dbMessages = useLiveQuery(() => db.messages.toArray()) || [];

  const { messages, input, handleSubmit, handleInputChange, setMessages } =
    useChat({
      //streamMode: "text",
      body: {
        system:
          systemPrompt ||
          "You´re a nice assistant that talks like a pirate. Check previous messages for answers before answering any questions",
      },
      onFinish: (message) => {
        addMessage(message);
        setLastMessage(message);
      },
      initialMessages: dbMessages,
      onError: (error) => {
        console.log("Error", error), setError(true);
      },
    });

  useEffect(() => {
    if (recievedDbMessages || dbMessages.length < 1) return;
    setMessages(dbMessages);
    setRecievedDbMessages(true);
    setAllMessages(dbMessages);
  }, [dbMessages, recievedDbMessages, setMessages]);

  function filterMessages(messages: Message[]) {
    const uniqueMessagesIds = new Set(messages.map((m) => m.id));
    return Array.from(uniqueMessagesIds).map(
      (id) => messages.find((m) => m.id === id) as Message
    );
  }

  useEffect(() => {
    setMessages(filterMessages([...messages, ...infoMessages]));
    setAllMessages(filterMessages([...messages, ...infoMessages]));
  }, [infoMessages]);

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
      {error ? (
        <p className={styles.error}>
          Det har skjedd en feil. Vent litt, og prøv på nytt. Hvis feilen
          fortsetter spør en veileder om hjelp
        </p>
      ) : null}
      <MessageList messages={messages.length ? messages : dbMessages} />
      <InputField
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        addMessage={addMessage}
        setAllMessages={setAllMessages}
        messages={messages}
        setError={setError}
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
    <ul className={styles.messageList} ref={chatContainerRef}>
      {messages
        .filter((m) => m.role !== "system")
        .sort(
          (a, b) =>
            (a.createdAt || new Date()).getTime() -
            (b.createdAt || new Date()).getTime()
        )
        .map((message) => {
          return (
            <li
              key={message.id}
              className={`${styles.messageListElement} ${
                message.role === "assistant"
                  ? styles.messageListElementChatbot
                  : styles.messageListElementReply
              }`}
            >
              <div
                className={`${
                  message.role === "assistant"
                    ? styles.chatbotMessage
                    : styles.replyMessage
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
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
  setAllMessages,
  messages,
  setError,
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  addMessage: (message: Message) => void;
  setAllMessages: (messages: Message[]) => void;
  messages: Message[];
  setError: (error: boolean) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
        const newMessage: Message = {
          role: "user",
          id: uuidv4(),
          content: input,
          createdAt: new Date(),
        };
        addMessage(newMessage);
        setAllMessages([...messages, newMessage]);
        setError(false);
      }}
      className={styles.sendMessageForm}
    >
      <input
        onChange={handleInputChange}
        value={input}
        placeholder="Hva lurer du på?"
        type="text"
      />
    </form>
  );
}
