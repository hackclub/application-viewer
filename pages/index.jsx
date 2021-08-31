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

export default function Home({ query, application, leaders }) {
  console.log(query, application, leaders);

  return <>
    <ApplicationDropDown template={applicationTemplate.clubs} content={application} name={"Club"}/>
    {leaders.map( (leader, i) => <div key={i}>
      <hr/>
      <ApplicationDropDown template={applicationTemplate.leaders} content={leader} name={`Leader ${i}`}/>
    </div>)}
  </>
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

    return { props: { query, application, leaders } }
  } catch (e) {
    // console.log(e)
    // res.statusCode = 302
    // res.setHeader('Location', `/`)
    return { props: { query, application: {}, leaders: [] } }
  }
}
