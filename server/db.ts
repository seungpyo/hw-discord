const fs = require("fs");
const path = require("path");
import {
  User,
  Room,
  UsersPerRoom,
  Message,
  MessagesPerRoom,
  Token,
} from "../src/types";

export type Record =
  | User
  | Room
  | Message
  | UsersPerRoom
  | MessagesPerRoom
  | Token;

export interface DB {
  users: User[];
  rooms: Room[];
  messages: Message[];
  usersPerRoom: UsersPerRoom;
  messagesPerRoom: MessagesPerRoom;
  tokens: Token[];
}

const dbPath = __dirname + "/db.json";

// 데이터베이스를 로드하는 함수
export function loadDB(): DB {
  if (!fs.existsSync(dbPath)) {
    // 파일이 존재하지 않으면 초기 데이터베이스 구조를 생성
    const initialDb = {
      users: [],
      tokens: [],
      rooms: [],
      usersPerRoom: {},
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2)); // 파일 생성
  }
  // 파일이 존재하면 데이터를 읽어옴
  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  return db;
}

// 데이터베이스를 저장하는 함수
export function saveDB(db: DB) {
  // 디렉토리가 존재하는지 확인하고, 없으면 생성
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // 데이터베이스 파일 저장
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
