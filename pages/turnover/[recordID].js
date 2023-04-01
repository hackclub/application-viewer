import { Application } from '../../js/components/Application.jsx'
import { ActionsDropDown } from '../../js/components/ActionsDropDown.jsx'
import { Auth } from '../../js/components/Auth.jsx'
import applicationTemplate from '../../js/application-template.js'
import { useState } from 'react'
import airtable from '../../utils/airtable'
import { getSession, useSession } from 'next-auth/client'

const ApplicationDropDown = ({ template, content, name }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="application-link" onClick={() => setOpen(!open)}>
        <span>{name}</span>
        <span className="app-link-arrow noselect">{open ? '▽' : '▷'}</span>
      </div>
      {open && <Application template={template} content={content} />}
    </>
  )
}

export default function Home({
  query,
  application,
  leaders,
  trackedApp,
  session
}) {
  return true ? ( // was session
    <>
      <ApplicationDropDown
        template={applicationTemplate.clubs}
        content={application}
        name={'Club'}
      />
      {leaders.map((leader, i) => (
        <div key={i}>
          <hr />
          <ApplicationDropDown
            template={applicationTemplate.leaders}
            content={leader}
            name={`Leader ${i}`}
          />
        </div>
      ))}
      <hr />
      <ActionsDropDown
        id={trackedApp.id}
        entry={trackedApp.fields}
        refers="turnover"
      />
    </>
  ) : (
    <Auth />
  )
}

export async function getServerSideProps(ctx) {
  const { query } = ctx
  const { recordID } = query
  const session = await getSession(ctx)
  // add authentication

  try {
    const application = {}
    const applicationRaw = (await airtable.find('Turnover Database', recordID))
      .fields
    const includedKeys = applicationTemplate.clubs
      .map(x => x.items.map(x => x.key))
      .flat()
    for (const key in applicationRaw) {
      if (includedKeys.includes(key)) application[key] = applicationRaw[key]
    }
    let trackedApp = await airtable.find(
      'Application Tracker',
      `{Turnover Database}='${recordID}'`
    )

    let leaders = await Promise.all(
      applicationRaw['Prospective Leaders'].map(async id => {
        const leader = {}
        const leaderRaw = (await airtable.find('Prospective Leaders', id))
          .fields
        if (applicationRaw['Alumni'].includes(leaderRaw['Email'])) return []
        const includedKeys = applicationTemplate.leaders
          .map(x => x.items.map(x => x.key))
          .flat()

        for (const key in leaderRaw) {
          if (includedKeys.includes(key)) leader[key] = leaderRaw[key]
        }

        return leader
      })
    )
    leaders = leaders.filter(i => !Array.isArray(i))
    console.log(leaders)

    return {
      props: { query, application, leaders, trackedApp, session },
      notFound: false
    }
  } catch (e) {
    // console.log(e)
    // res.statusCode = 302
    // res.setHeader('Location', `/`)
    console.error(e)
    return { notFound: true }
  }
}
