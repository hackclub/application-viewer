import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";
import sendEmail from "../../utils/sendEmail";

export default async (req, res) => {
  const { recordID, teacher, email } = req.body

  try {
    ensureMethod({ req, method: 'POST' })

    const currentEntryNote = (await airtable.find('Application Tracker', recordID)).fields["Notes"];

    const note = currentEntryNote
      ? `${currentEntryNote}\nUpdated with webhook: ${teacher ? "teacher" : "reject"}`
      : `Updated with webhook: ${teacher ? "teacher" : "reject"}`

    await airtable.patch('Application Tracker', recordID, {
      "Notes": note,
      "Status": "rejected",
      "Date Responded": new Date().toISOString().slice(0, 10)
    })

    // send email
    await sendEmail(email);

    res.send({ ok: true })
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}