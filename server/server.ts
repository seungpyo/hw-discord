const express = require("express");
import { Request, Response } from "express";
const path = require("path");
import { User } from "../src/types";
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, "../build")));

app.get("/", (req: Request, res: Response) => {
  // Send static HTML file
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
app.get("/greetings", (req: Request, res: Response) => {
  console.log("Received request for greetings");
  res.status(200).send("Hello from the server! Current time: " + new Date());
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
