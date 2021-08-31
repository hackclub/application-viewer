// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const { base } = require('/js/airtable.js')

  // add authentication

  try {
    const application = (await base("Application Database").find(req.query.app)).fields;
    const newTrackedApp = {
      "Venue": application["School Name"],
      "Address": application["School Address"],
      "Leaders": application["Full Name"],
      "Leaders' Emails": application["Leaders Emails"],
      "Applied": Date.now(),
      "Status": "applied",
      "Application": `https://application-viewer.hackclub.dev/?app=${req.query.app}`,
      "App ID": req.query.app,
      "Location": application["School Address"], // should I do google maps pin?
      // newTrackedApp.duplicate = application["Prospective Leaders"], // need to check current clubs
      // newTrackedApp.ambassador = application["Prospective Leaders"], // india or not
    };

    res.status(200).json(newTrackedApp);
  } catch (e) {
    // console.log(e)
    // res.statusCode = 302
    // res.setHeader('Location', `/`)
    res.status(404);
  }
}
