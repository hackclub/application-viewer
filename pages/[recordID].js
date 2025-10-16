import { Application } from '../js/components/Application.jsx'
import { ActionsDropDown } from '../js/components/ActionsDropDown.jsx'
import { Auth } from '../js/components/Auth.jsx'
import applicationTemplate from '../js/application-template.js'
import { useState } from 'react'
import airtable from '../utils/airtable'
import { getSession, useSession } from 'next-auth/client'

const CollapsibleSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="section">
      <h2 
        className={`section-header ${!isOpen ? 'collapsed' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className="toggle-arrow">▷</span>
      </h2>
      {isOpen && children}
    </div>
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
      <div className="main-layout">
        <div className="content-column">
          <div className="section">
            <h2 className="section-header">the breakdown (literally me)</h2>
            <Application template={applicationTemplate.clubs} content={application} />
          </div>
          
          {leaders.map((leader, i) => (
            <CollapsibleSection 
              key={i} 
              title={`Leader ${i + 1}`}
              defaultOpen={i === 0}
            >
              <Application template={applicationTemplate.leaders} content={leader} />
            </CollapsibleSection>
          ))}
        </div>
        
        <div className="decisions-column">
          <ActionsDropDown id={trackedApp.id} entry={trackedApp.fields} />
        </div>
      </div>
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
    const applicationRaw = (
      await airtable.find('Application Database', recordID)
    ).fields
    const includedKeys = applicationTemplate.clubs
      .map(x => x.items.map(x => x.key))
      .flat()
    for (const key in applicationRaw) {
      if (includedKeys.includes(key)) application[key] = applicationRaw[key]
    }

    let trackedApp = await airtable.find(
      'Application Tracker',
      `{App ID}='${recordID}'`
    )

    let leaders = await Promise.all(
      applicationRaw['Prospective Leaders'].map(async id => {
        const leader = {}
        const leaderRaw = (await airtable.find('Prospective Leaders', id))
          .fields
        const includedKeys = applicationTemplate.leaders
          .map(x => x.items.map(x => x.key))
          .flat()

        for (const key in leaderRaw) {
          if (includedKeys.includes(key)) leader[key] = leaderRaw[key]
        }

        return leader
      })
    )

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
