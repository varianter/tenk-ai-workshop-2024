"use client";
import { Message } from "ai";
import { useState } from "react";

export default function SystemInput({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages([
      ...messages,
      { content: input, role: "system", id: messages.length.toString() },
    ]);

    setInput("");
  };

  console.log("system messages ", messages);

  return (
    <div className="chat-box">
      <MessageList messages={messages} />{" "}
      <InputField
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <ul className="message-list">
      {messages.map((message, index) => {
        return (
          <li key={index} className={`input-box-message`}>
            <div className="input-message">{message.content}</div>
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
        placeholder="Legg inn info"
        type="text"
      />
    </form>
  );
}
