import passportGithub from "passport-github2";

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

const parseUser = ({ findUser, createUser }) => async (_, _1, profile, cb) => {
  try {
    delete profile._raw;
    const data = {
      id: "github:" + profile.id,
      name: profile.displayName || profile._json.login,
      email: getEmail(profile.emails),
      username: profile._json.login,
      location: profile._json.location || null,
      language: profile.language || "en",
      image: (profile.photos[0] || { value: "" }).value,
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
  const github = new passportGithub.Strategy(
    { clientID: id, clientSecret: secret, scope: scope },
    parseUser({ findUser, createUser })
  );
  return github;
};
