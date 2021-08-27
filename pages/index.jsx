import { Application } from "../components/Application.jsx";
import applicationTemplate from "../js/application-template.js";

export default function Home({ query, application, leaders }) {
  console.log(query, application, leaders);

  return <>
    <Application template={applicationTemplate.clubs} content={application}/>
    {leaders.map( (leader, i) => <div key={i}>
      <hr/>
      <Application template={applicationTemplate.leaders} content={leader}/>
    </div>)}
  </>
}

export async function getServerSideProps({ res, req, query }) {
  const { base } = require('/js/airtable.js')

  // add authentication

  try {

    let application = (await base("Applications").find(query.app)).fields;
    // console.log(application);
    let leaders = await Promise.all(application["Prospective Leaders"].map(
      async (id) => (await base("Prospective Leaders").find(id)).fields
    ))

    return { props: { query, application, leaders } }
  } catch (e) {
    // console.log(e)
    // res.statusCode = 302
    // res.setHeader('Location', `/`)
    return { props: { query, application: {}, leaders: {} } }
  }
}
