"use client";
import { Message } from "ai";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

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
    <div className={styles.chatBox}>
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
      {messages.map((message, index) => {
        return (
          <li key={index} className={styles.inputBoxMessage}>
            <div className={styles.inputMessage}>{message.content}</div>
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
        placeholder="Legg inn info"
        type="text"
      />
    </form>
  );
}
