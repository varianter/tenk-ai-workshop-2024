import "./globals.css";
import { Chat } from "./Chat";

export default function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="Header-link"> AI Chat </p>
      </header>
      <main className="chat-box-container">
        <Chat
          messages={[
            { id: "0", senderId: "ChatBot", text: "This is a text" },
            { id: "2", senderId: "Deg", text: "Another text" },
            {
              id: "3",
              senderId: "ChatBot",
              text: "This a longer text that goes on for a longer time",
            },
            { id: "4", senderId: "ChatBot", text: "Short message" },
            {
              id: "5",
              senderId: "Deg",
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            },
            { id: "6", senderId: "Deg", text: "A random message" },
            {
              id: "7",
              senderId: "ChatBot",
              text: "This is a longer message with more content to demonstrate the variability of message lengths.",
            },
            { id: "8", senderId: "Deg", text: "Yet another text" },
            {
              id: "9",
              senderId: "ChatBot",
              text: "This is a very short message",
            },
            { id: "10", senderId: "ChatBot", text: "This is a message" },
            {
              id: "11",
              senderId: "Deg",
              text: `"Oh, it is hard to think of it, and I cannot understand; but at least I shall go with you and wait." It was just a quarter before twelve o'clock when we got into the churchyard over the low wall. The night was dark with occasional gleams of moonlight between the rents of the heavy clouds that scudded across the sky. We all kept somehow close together, with Van Helsing slightly in front as he led the way. When we had come close to the tomb I looked well at Arthur, for I feared that the proximity to a place laden with so sorrowful a memory would upset him; but he bore himself well. I took it that the very mystery of the proceeding was in some way a counteractant to his grief. The Professor unlocked the door, and seeing a natural hesitation amongst us for various reasons, solved the difficulty by entering first himself. The rest of us followed, and he closed the door. He then lit a dark lantern and pointed to the coffin. Arthur stepped forward hesitatingly; Van Helsing said to me:--`,
            },
          ]}
        />
      </main>
    </div>
  );
}
