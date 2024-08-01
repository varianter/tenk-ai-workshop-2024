"use client";

import { Message } from "ai";
import styles from "./styles.module.css";
import { useChat } from "ai/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db.models";
import { v4 as uuidv4 } from "uuid";
import { set } from "zod";

export function Chat({
  initialMessages: infoMessages,
  systemPrompt,
  setAllMessages,
}: {
  initialMessages: Message[];
  systemPrompt: string;
  setAllMessages: (messages: Message[]) => void;
}) {
  const [recievedDbMessages, setRecievedDbMessages] = useState<boolean>(false);

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
        setAllMessages(messages);
      },
      initialMessages: dbMessages,
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
    setMessages(filterMessages([...messages, ...infoMessages, ...dbMessages]));
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
      <MessageList messages={messages.length ? messages : dbMessages} />
      <InputField
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
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
    <ul className={styles.messageList} ref={chatContainerRef}>
      {messages
        .sort(
          (a, b) =>
            (a.createdAt || new Date()).getTime() -
            (b.createdAt || new Date()).getTime()
        )
        .map((message, index) => {
          if (message.role === "system") {
            return <></>;
          }
          return (
            <li
              key={index}
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
          role: "user",
          id: uuidv4(),
          content: input,
          createdAt: new Date(),
        });
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
