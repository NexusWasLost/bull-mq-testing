import Database from "better-sqlite3";

const db = new Database("./SQLite Database/bull-mq-testing.db", { verbose: console.log });
export default db;
