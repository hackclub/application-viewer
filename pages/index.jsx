import { Application } from "../js/components/Application.jsx";
import applicationTemplate from "../js/application-template.js";
import { useState } from "react";

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

const ActionsDropDown = ({ status }) => {
  const [open, setOpen] = useState(false);

  return <>
    <div className="application-link" onClick={() => setOpen(!open)}>
      <span>IN PROGRESS: Actions</span>
      <span className="app-link-arrow noselect">{open ? "▽" : "▷"}</span>
    </div>
    { open && <>
        <div className="item-key"><b>Current Status:</b> {status}</div>
        <div className="actions-buttons">
          <button className="action-button accept">accept</button>
          <button className="action-button reject">reject</button>
          <button className="action-button teacher">teacher</button>
        </div> 
        <div className="item-key"><b>accept:</b> sends acceptance email, creates slack channel and invites leaders</div>
        <div className="item-key"><b>reject:</b> sends rejection email</div>
        <div className="item-key"><b>teacher:</b> sends teacher rejection email</div>
      </>
    }
  </>
}

export default function Home({ query, application, leaders, status }) {
  console.log(query, application, leaders, status);

  return <>
    <ApplicationDropDown template={applicationTemplate.clubs} content={application} name={"Club"}/>
    {leaders.map( (leader, i) => <div key={i}>
      <hr/>
      <ApplicationDropDown template={applicationTemplate.leaders} content={leader} name={`Leader ${i}`}/>
    </div>)}
    <hr/>
    <ActionsDropDown status={status}/>
  </>
}

async function airtableGet(key, value) {
  const { base } = require('/js/airtable.js')

  const appTracker = await base('Application Tracker')
  const gridView = await appTracker.select({view: "Grid view"})
  const all = await gridView.all();
  const matches = all.filter( record => record.get(key) === value);

  return matches.map(record => record.fields);
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
    // console.log(application);
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


    // const tracked = (await base("Application Database").find(query.app)).fields;
    let status = "unknown";
    try {
      const matches = await airtableGet("Venue", application["School Name"]);
      status = matches.length > 0 ? matches[0]["Status"] : "unknown";
    } catch (err) {
      status = "no record"
    }

    return { props: { query, application, leaders, status } }
  } catch (e) {
    // console.log(e)
    // res.statusCode = 302
    // res.setHeader('Location', `/`)
    return { props: { query, application: {}, leaders: [] } }
  }
}
