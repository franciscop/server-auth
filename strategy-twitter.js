import TwitterStrategy from "passport-twitter";

const parseUser = ({ findUser, createUser }) => async (_, _1, profile, cb) => {
  try {
    delete profile._raw;
    const data = {
      id: "twitter:" + profile.id,
      name: profile.displayName || profile.username,
      email: profile.email || null,
      username: profile.username,
      location: profile._json.location || null,
      language: profile._json.status.lang || null,
      image: profile._json.profile_image_url_https,
      raw: { ...profile, ...profile._json }
    };
    delete data.raw._json;
    let user = await findUser(data);
    if (!user) {
      user = await createUser(data);
    }
    cb(null, user);
  } catch (err) {
    cb(err);
  }
};

export default ({ findUser, createUser }, { id, secret, scope }) => {
  return new TwitterStrategy(
    { consumerKey: id, consumerSecret: secret, includeEmail: true },
    parseUser({ findUser, createUser })
  );
};
