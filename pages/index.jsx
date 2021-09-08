import { Application } from "/js/components/Application.jsx";
import { ActionsDropDown } from "/js/components/ActionsDropDown.jsx";
import applicationTemplate from "/js/application-template.js";
import { useState } from "react";
import { accept } from "/js/emails/accept.js";


const ApplicationDropDown = ({ template, content, name }) => {
  const [open, setOpen] = useState(false);

  return <>
    <div className="application-link" onClick={() => setOpen(!open)}>
      <span>{name}</span>
      <span className="app-link-arrow noselect">{open ? "▽" : "▷"}</span>
    </div>
    { open && <Application template={template} content={content}/> }
  </>
}

export default function Home({ query, application, leaders, trackedEntry }) {
  console.log(query, application, leaders, trackedEntry);

  return <>
    <ApplicationDropDown template={applicationTemplate.clubs} content={application} name={"Club"}/>
    {leaders.map( (leader, i) => <div key={i}>
      <hr/>
      <ApplicationDropDown template={applicationTemplate.leaders} content={leader} name={`Leader ${i}`}/>
    </div>)}
    <hr/>
    <ActionsDropDown id={trackedEntry[0]} entry={trackedEntry[1]}/>
  </>
}

async function airtableGet(key, value) {
  const { base } = require('/js/airtable.js')

  const appTracker = await base('Application Tracker')
  const gridView = await appTracker.select({view: "Main"})
  const all = await gridView.all();
  const matches = all.filter( record => record.get(key) === value);

  return matches.map(record => [ record.id, record.fields ]);
}

export async function getServerSideProps({ res, req, query }) {
  const { base } = require('/js/airtable.js')

  // add authentication

  try {
    const application = {};
    const applicationRaw = (await base("Application Database").find(query.app)).fields;
    const includedKeys = applicationTemplate.clubs.map(x => x.items.map(x => x.key)).flat();
    for (const key in applicationRaw) {
      if (includedKeys.includes(key)) application[key] = applicationRaw[key];
    }

    let leaders = await Promise.all(applicationRaw["Prospective Leaders"].map(
      async (id) => {
        const leader = {};
        const leaderRaw = (await base("Prospective Leaders").find(id)).fields;
        const includedKeys = applicationTemplate.leaders.map(x => x.items.map(x => x.key)).flat();

        for (const key in leaderRaw) {
          if (includedKeys.includes(key)) leader[key] = leaderRaw[key];
        }

        return leader;
      }
    ))

    let trackedEntry = {};
    try {
      const matches = await airtableGet("App ID", query.app);
      trackedEntry = matches.length > 0 ? matches[0] : {};
    } catch (err) {
      console.log(err);
    }

    return { props: { query, application, leaders, trackedEntry } }
  } catch (e) {
    // console.log(e)
    // res.statusCode = 302
    // res.setHeader('Location', `/`)
    return { props: { query, application: {}, leaders: [] } }
  }
}
