import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  console.log("hi there");
});

app.listen("3000", () => {
  console.log("service listening on port 3000");
});
