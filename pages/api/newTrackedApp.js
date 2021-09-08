
function getDate() {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const newdate = `${year}-${month}-${day}`;

  return newdate;
}

export default async function handler(req, res) {
  const { base } = require('/js/airtable.js')

  // add authentication

  try {
    const application = (await base("Application Database").find(req.query.app)).fields;

    const newTrackedApp = {
      "Venue": application["School Name"],
      "Location": application["School Address"],
      "Leader(s)": application["Full Name"].map(x => x.split(" ").join("+")).join(","),
      "Leaders' Emails": application["Leaders Emails"].join(","),
      "Applied": getDate(),
      "Status": "applied",
      "Application": `https://application-viewer.hackclub.dev/?app=${req.query.app}`,
      "App ID": req.query.app,
      // newTrackedApp.duplicate = application["Prospective Leaders"], // need to check current clubs
      // newTrackedApp.ambassador = application["Prospective Leaders"], // india or not
    };

    // const postCreate = (err, records) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   // records.forEach(function (record) {
    //   //   console.log(record.getId());
    //   // });
    // }

    // const tracked = await base("Application Tracker");
    // tracked.create(newTrackedApp, postCreate);

    res.status(200).json(newTrackedApp);
  } catch (e) {
    // console.log(e)
    // res.statusCode = 302
    // res.setHeader('Location', `/`)
    res.status(404);
  }
}
