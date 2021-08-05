export default clean => async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await clean(profile);
    cb(null, user);
  } catch (error) {
    cb(error);
  }
};
