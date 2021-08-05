# Server Auth

An authentication plugin for server.js. So far it handles _Github_ and _Twitter_ login.

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
const serialize = user => { ... };  // Optional
const deserialize = id => { ... };

// Initialize server.js as usual, passing the options for auth
server(
  { auth: { findUser, createUser, deserialize } },
  get('/', ctx => `Hello ${ctx.user ? ctx.user.name : 'Anonymous'}`),
);
```

Finally start your server with `node .`, and visit `http://localhost:3000/login/github` or `http://localhost:3000/login/twitter` to login into your app. Visit `/user` to see your profile information.

## No Database

You can use it with no database by defining the helper functions like this:

```js
const findUser = profile => null;
const createUser = profile => profile;
const serialize = user => JSON.stringify(user);
const deserialize = id => JSON.parse(id);
```

This is very useful to quickly launch the app without being bothered to setup a database yet. If you set up a persistent cookie store, then the login will also persist! Otherwise when the server is restarted, the user will need to login again.
