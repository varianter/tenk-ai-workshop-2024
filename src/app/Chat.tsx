"use client";

import { Message } from "ai";
import styles from "./chat.module.css";
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleSubmit, handleInputChange, metadata } =
    useChat({
      //streamMode: "text",
      body: { system: "You´re a nice assistant that talks like a pirate" },
    });

  console.log(metadata);
  console.log(messages);

  return (
    <div className="chat-box">
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
        return (
          <li
            key={message.id}
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
