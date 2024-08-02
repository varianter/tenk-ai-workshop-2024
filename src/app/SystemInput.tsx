"use client";
import { Message } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db.models";
import { v4 as uuidv4 } from "uuid";

//const inputMessageStart = `Teksten nedenfor frem til "KONTEKST SLUTT" er informasjon gitt til bakgrunn for spørsmål og kommentarer brukeren kommer med. Du skal ta utgangspunkt i den informasjonen når du svarer. \n`;

const inputMessageStart = `"CONTEXT START" The text below until "CONTEXT END" is information given as background for questions and comments from the user. Base your answers on this information \n`;

const inputMessageEnd = `\n CONTEXT END`;

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

    const newMessage: Message = {
      content: inputMessageStart + input + inputMessageEnd,
      role: "system",
      id: uuidv4(),
      createdAt: new Date(),
    };
    setMessages([...messages, newMessage]);

    addMessage(newMessage);

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

  function removeSytstemPrompt(content: string) {
    return content.replace(inputMessageStart, "").replace(inputMessageEnd, "");
  }

  return (
    <ul className={` ${styles.messageList} `} ref={chatContainerRef}>
      {messages
        .filter((message) => message.role == "system")
        .map((message) => {
          return (
            <li key={message.id} className={styles.inputBoxMessage}>
              <div className={styles.inputMessage}>
                <p style={{ whiteSpace: "pre", textWrap: "wrap" }}>
                  {removeSytstemPrompt(message.content)}
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
}: {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
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
