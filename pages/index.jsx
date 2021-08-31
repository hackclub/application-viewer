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

    let application = (await base("Application Database").find(query.app)).fields;
    // console.log(application);
    let leaders = await Promise.all(application["Prospective Leaders"].map(
      async (id) => {
        const leader = (await base("Prospective Leaders").find(id)).fields;
        delete leader["Accepted Tokens"];
        delete leader["Application"];
        delete leader["Application ID"];
        delete leader["ID"];
        delete leader["Log In Path"];
        delete leader["Logins"];

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
