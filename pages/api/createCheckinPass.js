import ensureMethod from "../../utils/ensureMethod";
import airtable from "../../utils/airtable";

export default async (req, res) => {
  const { recordID } = req.body

  try {
    ensureMethod({req, method: 'POST'})
    const password = Math.random().toString(16).slice(2)
    await airtable.patch('Application Tracker', recordID, {
      'Check-In Pass': password
    })
    res.send({password})
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}