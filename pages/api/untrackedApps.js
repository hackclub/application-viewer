import airtable from '../../utils/airtable'

export default async function handler(req, res) {
  try {
    // Get all records from Clubs table where Application Status is empty or null
    const allLeaders = await airtable.get('Clubs')
    
    // Filter for untracked applications (those without Application Status set)
    const untracked = allLeaders.filter(record => {
      const status = record.fields['Application Status']
      return !status || status === ''
    })

    res.status(200).json(untracked);
  } catch (e) {
    console.log(e);
    res.status(418).send(e);
  }
}