import ensureMethod from "../../utils/ensureMethod";

export default async (req, res) => {
  const { recordID } = req.body

  try {
    ensureMethod({req, method: 'POST'})
    res.send({password: 'hunter2!'})
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}