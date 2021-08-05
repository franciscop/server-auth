import server from "server";
import auth from "../index.js";

// Example database
import db from "./db.js";

server.plugins.push(auth);

const { get } = server.router;
const { redirect } = server.reply;

// You can use either the profile.id or the profile.email here
const findUser = async profile => db.findByEmail(profile.email);
const createUser = async profile => db.save(profile);
const serialize = async user => user.id;
const deserialize = async id => db.find(id);

server(
  { auth: { findUser, createUser, deserialize } },
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
