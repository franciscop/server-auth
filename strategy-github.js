import passportGithub from "passport-github2";
import verify from "./verify.js";

const getEmail = emails => {
  if (!emails) {
    throw new Error("Emails not found for this user");
  }
  if (emails.filter(e => e.verified && e.primary).length) {
    return emails.filter(e => e.verified && e.primary)[0].value;
  }
  if (emails.filter(e => e.verified).length) {
    return emails.filter(e => e.verified)[0].value;
  }
  if (emails.filter(e => e.primary).length) {
    return emails.filter(e => e.primary)[0].value;
  }
  return emails[0].value;
};

const cleanProfile = profile => {
  delete profile._raw;
  const user = {
    id: "github:" + profile.id,
    name: profile.displayName || profile._json.login,
    email: getEmail(profile.emails),
    username: profile._json.login || null,
    location: profile._json.location || null,
    language: profile.language || null,
    image: profile.photos[0]?.value,
    raw: { ...profile, ...profile._json }
  };
  delete user.raw._json;
  return user;
};

export default ({ findUser, createUser }, { id, secret, scope }) => {
  return new passportGithub.Strategy(
    { clientID: id, clientSecret: secret, scope },
    verify(async raw => {
      const profile = cleanProfile(raw);
      let user = await findUser(profile);
      if (!user) user = await createUser(profile);
      return user;
    })
  );
};
