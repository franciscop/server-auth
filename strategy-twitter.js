import TwitterStrategy from "passport-twitter";
import verify from "./verify.js";

const cleanProfile = profile => {
  delete profile._raw;
  const user = {
    id: "twitter:" + profile.id,
    name: profile.displayName || profile.username,
    email: profile.email || null,
    username: profile.username,
    location: profile._json.location || null,
    language: profile._json.status.lang || null,
    image: profile._json.profile_image_url_https,
    raw: { ...profile, ...profile._json }
  };
  delete user.raw._json;
  return user;
};

export default ({ findUser, createUser }, { id, secret, scope }) => {
  return new TwitterStrategy(
    { consumerKey: id, consumerSecret: secret, includeEmail: true },
    verify(async raw => {
      const profile = cleanProfile(raw);
      let user = await findUser(profile);
      if (!user) user = await createUser(profile);
      return user;
    })
  );
};
