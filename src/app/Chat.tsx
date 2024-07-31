"use client";

import { Message } from "ai";
import styles from "./chat.module.css";
import { useChat } from "ai/react";

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
    <div className="chat-box chat-box-main-chat">
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
  return (
    <ul className="message-list">
      {messages.map((message, index) => {
        if (message.role === "system") {
          return <></>;
        }
        return (
          <li
            key={index}
            className={`message-list-element ${
              message.role === "assistant"
                ? "message-list-element-chatbot"
                : "message-list-element-reply"
            }`}
          >
            <div
              className={`${
                message.role === "assistant"
                  ? "chatbot-message"
                  : "reply-message"
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
    <form onSubmit={handleSubmit} className="send-message-form">
      <input
        onChange={handleInputChange}
        value={input}
        placeholder="Hva lurer du på?"
        type="text"
      />
    </form>
  );
}
