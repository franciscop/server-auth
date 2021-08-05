# Server Auth

An authentication plugin for server.js. So far it handles **Github** and **Twitter** login.

```js
import server from "server";
import auth from "@server/auth";

server.plugins.push(auth);

server(ctx => `Hello ${ctx.user ? ctx.user.name : "Anonymous"}`);
```

## Getting Started

We are going to see how to setup **Github Login**. First install server and this plugin:

```bash
npm i server @server/auth
```

Setup your app in Github and fill in the secrets in your `.env` file:

```bash
GITHUB_ID=
GITHUB_SECRET=
```

Include the plugin in your main app alongside with a small route with some helper just to see the data:

```js
import server from "server";
import auth from "@server/auth";

server.plugins.push(auth);

const home = ctx => {
  console.log(ctx.user);
  return `Hello ${ctx.user ? ctx.user.name : "Anonymous"}`;
};

server(get("/", home));
```

Finally start your server with `node .`, and visit `http://localhost:3000/login/github` to login into your app. The homepage will show your name, and the terminal all of your info.

## Database Integration

The default shown in the Getting Started is the setup just for login. When you have a DB you need to write some extra methods to connect Auth to your specific database data and to the session/cookies. This is achieved with these (all of them are async):

- `findUser(profile) => user`: given the profile retrieved from the social network, this function will return the user from your database. You can make the match however you prefer; through the `profile.email`, or `profile.username`, or `profile.id` depending on your needs and whether you have one or multiple providers.
- `createUser(profile) => user`: given the profile retrieved from the social network, it creates a user in the database and returns this newly created user.
- `serialize(user) => id`: given the user from your database, extract a uniquely identifying ID. This is usually something like the `user.id`, `user._id` with Mongoose, or similar. That ID will be stored in the session store for later usage.
- `deserialize(id) => user`: given the id extracted from the previous serialization method, this method finds the full user from your database.

```js
import server from "server";
import auth from "@server/auth";

const { get } = server.router;

// Add it to the list of plugins
server.plugins.push(auth);

// Define these 3-4 methods to access your local DB:
const findUser = profile => { ... };
const createUser = profile => { ... };
const serialize = user => user.id;
const deserialize = id => { ... };

// Initialize server.js as usual, passing the options for auth
server(
  { auth: { findUser, createUser, serialize, deserialize } },
  get('/', ctx => `Hello ${ctx.user ? ctx.user.name : 'Anonymous'}`),
);
```
