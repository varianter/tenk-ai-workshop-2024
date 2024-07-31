"use client";

import { Message } from "ai";
import styles from "./styles.module.css";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export function Chat({
  initialMessages,
  systemPrompt,
}: {
  initialMessages: Message[];
  systemPrompt: string;
}) {
  const { messages, input, handleSubmit, handleInputChange } = useChat({
    //streamMode: "text",
    body: {
      system:
        systemPrompt ||
        "You´re a nice assistant that talks like a pirate. Check previous messages for answers before answering any questions",
    },
    initialMessages: initialMessages,
  });

  console.log("ai messages ", messages);
  console.log("systemPrompt ", systemPrompt);

  return (
    <div className={styles.chatBox}>
      <MessageList messages={messages} />{" "}
      <InputField
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
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
      {messages.map((message, index) => {
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
              {message.content}
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
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.sendMessageForm}>
      <input
        onChange={handleInputChange}
        value={input}
        placeholder="Hva lurer du på?"
        type="text"
      />
    </form>
  );
}
