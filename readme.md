# Server Auth

An authentication plugin for server.js. So far it handles _Github_ and _Twitter_ login.

```js
import server from "server";
import auth from "@server/auth";

server.plugins.push(auth);

server(
  get("/", ctx => {
    return `
      Hello ${ctx.user ? ctx.user.name : "Anonymous"}.<br />
      <a href="/login/github">Login with Github</a>
    `;
  })
);
```

## Getting Started

First install server and this module:

```bash
npm i server @server/auth
```

Then setup your app in Github or Twitter, and fill in the secrets into your `.env` file:

```bash
# Fill with the Github info
GITHUB_ID=
GITHUB_SECRET=

# Fill with the Twitter App info:
TWITTER_ID=
TWITTER_SECRET=
```

Finally include the plugin in your main app, the helper functions and the options, alongside with a small route to show the home and username:

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
  { auth: { findUser, createUser, deserialize } },
  get('/', ctx => `Hello ${ctx.user ? ctx.user.name : 'Anonymous'}`),
);
```

Finally start your server with `node .`, and visit `http://localhost:3000/login/github` or `http://localhost:3000/login/twitter` to login into your app. Visit `/user` to see your profile information.

## Database Integration

The default shown in the beginning is for a no-db. When you have a DB, you need to write two functions to save and find the user in the database, and another two functions to make the auth system to use the sessions/cookies.

This is achieved with these functions (all of them are async):

- `findUser(profile) => user`: given the profile retrieved from the social network, this function will return the user from your database. You can make the match however you prefer; through the `profile.email`, or `profile.username`, or `profile.id` depending on your needs and whether you have one or multiple providers.
- `createUser(profile) => user`: TODO
- `serialize(user) => id`: TODO
- `deserialize(id) => user`: TODO
