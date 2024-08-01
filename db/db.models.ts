import Dexie, { Table } from "dexie";

// table inteface
export interface Message {
  id: string;
  content: string;
  role: "system" | "user" | "assistant" | "function" | "data" | "tool";
  createdAt: Date;
}

export class DB extends Dexie {
  messages!: Table<Message>;
  constructor() {
    super("myDatabase");
    this.version(1).stores({
      messages: "++id, role, content, createdAt",
    });
  }
}

export const db = new DB(); // export the db
