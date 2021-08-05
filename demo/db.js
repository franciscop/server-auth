// A really tiny in-memory DB-like object. It's just for these examples,
// so it's def not comprehensive

const db = {
  data: {},
  find: id => db.data[id],
  findByEmail: email =>
    Object.entries(db.data).find(it => it.email === email)?.[0],
  save: data => (db.data[data.id] = data)
};

export default db;
