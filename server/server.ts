const express = require("express");
import { Request, Response } from "express";
const path = require("path");
import { Token, User } from "../src/types";
import { loadDB, saveDB } from "./db";
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../build")));
app.use((req: Request, res: Response, next: any) => {
  const maybeTokenId = req.headers["authorization"];
  if (!maybeTokenId) {
    next();
    return;
  }
  const tokenId = maybeTokenId.replace("Bearer ", "");
  const db = loadDB();
  const token = db.tokens.find((t) => t.id === tokenId);
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (new Date(token.expiresAt) < new Date()) {
    res.status(401).send("Token expired");
    return;
  }
  res.locals.token = token;
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("/api/users", (req: Request, res: Response) => {
  const db = loadDB();
  res.status(200).send(db.users);
});

app.get("/api/users/:id", (req: Request, res: Response) => {
  const db = loadDB();
  const user = db.users.find((u: User) => u.id === req.params.id);
  if (!user) {
    res.status(404).send("User not found");
  }
  res.status(200).send(user);
});

app.post("/api/users", (req: Request, res: Response) => {
  const db = loadDB();
  const user: User = req.body;
  if (db.users.find((u) => u.id === user.id)) {
    res.status(409).send("User already exists");
    return;
  }
  db.users.push(user);
  saveDB(db);
  res.status(201).send(user);
});

app.put("/api/users/:id", (req: Request, res: Response) => {
  const db = loadDB();
  if (req.params.id !== res.locals.token.userId) {
    res.status(403).send("Forbidden");
    return;
  }
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  saveDB({
    ...db,
    users: db.users.map((u) => (u.id === user.id ? { ...u, ...req.body } : u)),
  });
  res.status(200).send(user);
});

app.get("/api/rooms", (req: Request, res: Response) => {
  const { rooms, usersPerRoom } = loadDB();
  const roomIds = Object.keys(usersPerRoom).filter((roomId) =>
    usersPerRoom[roomId].includes(res.locals.token.userId)
  );
  res.status(200).send(rooms.filter((r) => roomIds.includes(r.id)));
});

app.get("/api/rooms/:id", (req: Request, res: Response) => {
  const { rooms, usersPerRoom } = loadDB();
  if (!usersPerRoom[req.params.id].includes(res.locals.token.userId)) {
    res.status(403).send("Forbidden");
    return;
  }
  const room = rooms.find((r) => r.id === req.params.id);
  if (!room) {
    res.status(404).send("Room not found");
    return;
  }
  res.status(200).send(room);
});

app.post("/api/rooms", (req: Request, res: Response) => {
  const db = loadDB();
  const room = req.body;
  db.rooms.push(room);
  db.usersPerRoom[room.id] = [res.locals.token.userId];
  saveDB(db);
  res.status(201).send(room);
});

app.put("/api/rooms/:id", (req: Request, res: Response) => {
  const db = loadDB();
  const room = db.rooms.find((r) => r.id === req.params.id);
  if (!room) {
    res.status(404).send("Room not found");
    return;
  }
  if (!db.usersPerRoom[room.id].includes(res.locals.token.userId)) {
    res.status(403).send("Forbidden");
    return;
  }
  saveDB({
    ...db,
    rooms: db.rooms.map((r) => (r.id === room.id ? { ...r, ...req.body } : r)),
  });
  res.status(200).send(room);
});

app.post("/auth/login", (req: Request, res: Response) => {
  const db = loadDB();
  const { username, password } = req.body;
  const user = db.users.find(
    (u) => u.name === username && u.password === password
  );
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }
  const token: Token = {
    id: Math.random().toString(36).substring(7),
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };
  db.tokens.push(token);
  saveDB(db);
  res.status(200).send(token);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
