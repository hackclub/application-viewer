const { base } = require('/js/airtable.js')


async function getAll(baseName, view) {
  const appTracker = await base(baseName)
  const gridView = await appTracker.select({ view })
  const all = await gridView.all();

  return all.map(record => [record.id, record.fields]);
}

export default async function handler(req, res) {

  try {
    const submitted =  await getAll("Application Database", "Submitted");
    const tracked = await getAll("Application Tracker", "Main");
    const schools = tracked.map(x => x[1]["Venue"]);

    const untracked = submitted.filter( x => !schools.includes(x[1]["School Name"]) )

    res.status(200).json(untracked);
  } catch (e) {
    console.log(e);
    res.status(418);
  }
}