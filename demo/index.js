import server from "server";
import auth from "../index.js";

// Example database
import db from "./db.js";

server.plugins.push(auth);

const { get } = server.router;
const { redirect } = server.reply;

server(
  get(
    "/",
    ctx =>
      `<a href="/login/github">Github</a> • <a href="/login/twitter">Twitter</a><pre>${JSON.stringify(
        ctx.user,
        null,
        2
      )}`
  ),
  get("/abc", () => redirect("/")),
  get("/favicon.ico", () => 404)
);
