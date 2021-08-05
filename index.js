import server from "server";

import passport from "passport";

import github from "./strategy-github.js";
import twitter from "./strategy-twitter.js";

const modern = server.utils.modern;
const get = server.router.get;
const { redirect } = server.reply;

const callbackURL = "http://localhost:3000/callback";

export default {
  name: "auth",
  options: {
    // Creation on first/later logins
    findUser: { required: true, type: Function },
    createUser: { required: true, type: Function },

    // Serialization to/from session
    serialize: {
      default: user => user.id || user._id
    },
    deserialize: {
      required: true,
      type: Function
    },

    github: {
      type: Object,
      options: {
        id: {
          env: "GITHUB_ID"
        },
        secret: {
          env: "GITHUB_SECRET"
        },
        scope: {
          default: "user:email",
          env: "GITHUB_SCOPE"
        },
        callback: {
          default: "/callback/github"
        }
      }
    },

    twitter: {
      type: Object,
      options: {
        id: {
          env: "TWITTER_ID"
        },
        secret: {
          env: "TWITTER_SECRET"
        },
        scope: {
          default: "user:email",
          env: "TWITTER_SCOPE"
        },
        callback: {
          default: "/callback/twitter"
        }
      }
    }
  },
  init: ctx => {
    // GITHUB
    if (ctx.options.auth.github.id && ctx.options.auth.github.secret) {
      passport.use(github(ctx.options.auth, ctx.options.auth.github));
    }
    if (ctx.options.auth.twitter.id && ctx.options.auth.twitter.secret) {
      passport.use(twitter(ctx.options.auth, ctx.options.auth.twitter));
    }

    // General, for sessions
    const { serialize, deserialize } = ctx.options.auth;
    passport.serializeUser(async (user, done) => {
      try {
        done(null, await serialize(user));
      } catch (error) {
        done(error);
      }
    });
    passport.deserializeUser(async (id, done) => {
      try {
        done(null, await deserialize(id));
      } catch (error) {
        done(error);
      }
    });
  },
  before: [
    modern(passport.initialize()),
    modern(passport.session()),

    get("/login/:provider", ctx => {
      const provider = ctx.params.provider;
      const path = ctx.options.auth[provider].callback;
      const protocol = ctx.headers.host.startsWith("localhost:")
        ? "http"
        : "https";
      const callbackURL = protocol + "://" + ctx.headers.host + path;
      return modern(passport.authenticate(provider, { callbackURL }))(ctx);
    }),

    get(
      "/callback/:provider",
      ctx => modern(passport.authenticate(ctx.params.provider))(ctx),
      () => redirect("/")
    )
  ]
};
