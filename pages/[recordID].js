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
  session,
  accessDenied
}) {
  if (accessDenied) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#ec3750', fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          You are signed in as <strong>{session?.user?.name}</strong>, but you don't have permission to view this application.
        </p>
        <p style={{ color: '#666' }}>
          Only Hack Club Ambassadors can access the application viewer. If you believe this is an error, please contact the team.
        </p>
      </div>
    )
  }
  
  return session ? (
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
  
  // Check if user is authenticated
  if (!session) {
    return {
      props: { query, application: {}, leaders: [], trackedApp: { id: recordID, fields: {} }, session: null },
      notFound: false
    }
  }
  
  try {
    const startTime = Date.now()
    console.log('[TIMING] Starting page load...')
    
    // Parallel fetch: Check ambassador AND fetch club data at the same time
    const slackId = session.slackId
    
    const [ambassadorCheck, clubRecord] = await Promise.all([
      slackId ? airtable.find('Ambassadors', `{Slack ID}='${slackId}'`).catch(() => null) : Promise.resolve(null),
      airtable.find('Clubs', recordID)
    ])
    
    console.log(`[TIMING] Fetched club + ambassador check in ${Date.now() - startTime}ms`)
    
    // Check ambassador status
    if (slackId && !ambassadorCheck) {
      console.log(`[ACCESS DENIED] ${session.user?.name} (${slackId}) is not an ambassador`)
      return {
        props: { 
          query, 
          application: {}, 
          leaders: [], 
          trackedApp: { id: recordID, fields: {} }, 
          session,
          accessDenied: true 
        },
        notFound: false
      }
    }
    
    const clubRaw = clubRecord.fields
    
    // Find the exact field name for "What's going to be new"
    const whatIsNewFieldName = Object.keys(clubRaw).find(key => 
      key.includes("What's going to be new") || key.includes("coding clubs before")
    )
    console.log('[DEBUG] Found field name:', whatIsNewFieldName)
    console.log('[DEBUG] Field value:', clubRaw[whatIsNewFieldName])
    
    // Map club fields to the expected format
    const application = {
      'Club Name': clubRaw['Club Name'] || null,
      'Venue Type': clubRaw['Venue Type'] || null,
      'School Name': clubRaw['Venue Name'] || null,
      'School Address': [
        clubRaw['Venue Address Line 1'],
        clubRaw['Venue Address Line 2'],
        clubRaw['Venue City'],
        clubRaw['Venue State'],
        clubRaw['Venue Country'],
        clubRaw['Venue Zip Code']
      ].filter(Boolean).join(', ') || null,
      'Why': clubRaw['Why are you starting a Hack Club?'] || null,
      'Success': clubRaw['Describe what your club meetings will look like.'] || null,
      'Get Out Of HC': clubRaw['What do you hope to get from leading a club?'] || null,
      'Status': clubRaw['What steps have you taken to start a club?'] || null,
      'What Is New': clubRaw[whatIsNewFieldName] || null,
      'Hear About HC': clubRaw['referral_type'] || null,
      'Referral Code': clubRaw['referral_code'] || null,
      'Leaders Relationship': null // Not present in new structure
    }

    
    // Fetch all leaders in parallel (main leader + co-leaders)
    let leaders = []
    const leaderIds = [
      ...(clubRaw['Leader'] || []),
      ...(clubRaw['Co-leaders'] || [])
    ]
    
    if (leaderIds.length > 0) {
      try {
        const leaderStartTime = Date.now()
        // Fetch all leaders at once in parallel
        const leaderRecords = await Promise.all(
          leaderIds.map(id => airtable.find('Leaders', id).catch(() => null))
        )
        console.log(`[TIMING] Fetched ${leaderIds.length} leader(s) in ${Date.now() - leaderStartTime}ms`)
        
        // Process each leader record
        for (const leaderRecord of leaderRecords) {
          if (!leaderRecord) continue
          
          const leaderRaw = leaderRecord.fields
          const leader = {
          'Full Name': `${leaderRaw['First Name'] || ''} ${leaderRaw['Last Name'] || ''}`.trim() || null,
          'Birthday': leaderRaw['DOB'] || null,
          'School Year': leaderRaw['Graduation Year'] || null,
          'Phone': leaderRaw['Phone Number'] || null,
          'Slack ID': leaderRaw['Slack ID'] || null,
          'Address Formatted': [
            leaderRaw['Address Line 1'],
            leaderRaw['Address Line 2'],
            leaderRaw['City'],
            leaderRaw['State/Province'],
            leaderRaw['Country'],
            leaderRaw['Zip/Area Code']
          ].filter(Boolean).join(', ') || null,
          'Address Line 1': leaderRaw['Address Line 1'] || null,
          'Address Line 2': leaderRaw['Address Line 2'] || null,
          'Address City': leaderRaw['City'] || null,
          'Address State': leaderRaw['State/Province'] || null,
          'Address Zip': leaderRaw['Zip/Area Code'] || null,
          'Address Country': leaderRaw['Country'] || null,
          'Website': leaderRaw['link_personal_website'] || null,
          'GitHub': leaderRaw['link_github'] || null,
          'Twitter': leaderRaw['link_social_media'] || null,
          'Other': leaderRaw['link_other'] || null,
          'Achievement': leaderRaw['Tell us about something you made which was personally meaningful to you.'] || null,
          'New Fact': leaderRaw['What is something surprising or amusing you learned recently?'] || null,
          'Hacker Story': leaderRaw["If you had unlimited time, money, and resources, what's the most ridiculous/awesome thing you'd build?"] || null,
          'Pronouns': leaderRaw['Pronouns'] || null
        }
          leaders.push(leader)
        }
      } catch (err) {
        console.error('Error fetching leaders:', err)
      }
    }

    // Create a tracked app object for compatibility
    let trackedApp = {
      id: recordID,
      fields: {
        'Club Status': clubRaw['Club Status'] || null,
        'Application Status': clubRaw['Application Status'] || null,
        'Notes': clubRaw['Team Notes'] || null,
        'Ambassador': clubRaw['Ambassador'] || null
      }
    }

    console.log(`[TIMING] Total page load time: ${Date.now() - startTime}ms`)
    
    return {
      props: { query, application, leaders, trackedApp, session },
      notFound: false
    }
  } catch (e) {
    console.error(e)
    return { notFound: true }
  }
}
