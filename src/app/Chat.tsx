"use client";

import styles from "./chat.module.css";

export type Message = {
  id: string;
  text: string;
  senderId: string;
};

export function Chat({ messages }: { messages: Message[] }) {
  return (
    <div className="chat-box">
      <MessageList messages={messages} /> <InputField />
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
              message.senderId === "ChatBot"
                ? "message-list-element-chatbot"
                : "message-list-element-reply"
            }`}
          >
            <div
              className={`${
                message.senderId === "ChatBot"
                  ? "chatbot-message"
                  : "reply-message"
              }`}
            >
              {message.text}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function InputField() {
  return (
    <form onSubmit={() => console.log("submit")} className="send-message-form">
      <input
        /*onChange={() => console.log("change")}
        value={""}*/
        placeholder="Hva lurer du på?"
        type="text"
      />
    </form>
  );
}
