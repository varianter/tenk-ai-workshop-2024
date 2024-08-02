import { Message } from "ai";
import styles from "./styles.module.css";
import { useState } from "react";

export default function ExtraInfo({
  messages,
  lastMessage,
  systemPrompt,
  showExtraInfo,
}: {
  messages: Message[];
  lastMessage: Message | null;
  systemPrompt: string;
  showExtraInfo: boolean;
}) {
  return (
    <>
      {showExtraInfo ? (
        <div className={styles.extraInfoContainer}>
          <h3>Hva som sist ble mottatt fra ChatBoten</h3>
          {lastMessage?.content ? (
            <pre className={styles.extraInfo}>
              {JSON.stringify(lastMessage, null, 2)}
            </pre>
          ) : (
            <p className={styles.extraInfo}>Ingen melding mottatt</p>
          )}
          <h3>Hva som sist ble sendt til ChatBoten</h3>
          <pre className={styles.extraInfo}>
            {JSON.stringify(
              [{ content: systemPrompt, role: "system", id: "0" }, ...messages],
              null,
              2
            )}
          </pre>
        </div>
      ) : null}
    </>
  );
}
