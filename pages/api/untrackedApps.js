import airtable from '../../utils/airtable'

export default async function handler(req, res) {
  try {
    const submitted = await airtable.get('Application Database', {view: 'Submitted'})
    const trackedSubmitted = await airtable.get('Application Tracker')
    const trackedSubmittedIDs = trackedSubmitted.map(record => record.get('App ID'))

    const untracked = submitted.filter(app => !trackedSubmittedIDs.includes(app.id) )

    res.status(200).json(untracked);
  } catch (e) {
    console.log(e);
    res.status(418).send(e);
  }
}