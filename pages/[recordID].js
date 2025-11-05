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
  
  // Check if user is an ambassador
  try {
    const slackId = session.slackId
    if (slackId) {
      const ambassador = await airtable.find('Ambassadors', `{slack_id}='${slackId}'`)
      if (!ambassador) {
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
      console.log(`[ACCESS GRANTED] Ambassador ${session.user?.name} (${slackId})`)
    }
  } catch (error) {
    console.error('[AUTH CHECK] Error:', error)
  }

  try {
    // Fetch the club record from the Clubs table
    const clubRecord = await airtable.find('Clubs', recordID)
    const clubRaw = clubRecord.fields
    
    // Map club fields to the expected format
    const application = {
      'Club Name': clubRaw['club_name'] || null,
      'Venue Type': clubRaw['venue_type'] || null,
      'School Name': clubRaw['venue_name'] || null,
      'School Address': [
        clubRaw['venue_address_line_1'],
        clubRaw['venue_address_line_2'],
        clubRaw['venue_address_city'],
        clubRaw['venue_address_state'],
        clubRaw['venue_address_country'],
        clubRaw['venue_address_zip']
      ].filter(Boolean).join(', ') || null,
      'Why': clubRaw['club_app_why'] || null,
      'Success': clubRaw['club_app_meetings'] || null,
      'Get Out Of HC': clubRaw['club_app_personal'] || null,
      'Status': clubRaw['club_app_steps'] || null,
      'What Is New': clubRaw['club_app_history'] || null,
      'Hear About HC': clubRaw['referral_type'] || null,
      'Referral Code': clubRaw['referral_code'] || null,
      'Leaders Relationship': null // Not present in new structure
    }
    
    // Fetch the main leader from the Leaders table
    let leaders = []
    
    console.log('Club data:', { 
      rel_leader: clubRaw['rel_leader'], 
      rel_co_leaders: clubRaw['rel_co_leaders'] 
    })
    
    if (clubRaw['rel_leader'] && clubRaw['rel_leader'][0]) {
      try {
        const leaderRecord = await airtable.find('Leaders', clubRaw['rel_leader'][0])
        console.log('Main leader record:', leaderRecord)
        if (leaderRecord) {
          const leaderRaw = leaderRecord.fields
        const mainLeader = {
          'Full Name': leaderRaw['name'] || `${leaderRaw['first_name'] || ''} ${leaderRaw['last_name'] || ''}`.trim() || null,
          'Birthday': leaderRaw['birthday'] || leaderRaw['dob'] || leaderRaw['date_of_birth'] || null,
          'School Year': leaderRaw['year'] || leaderRaw['graduation_year'] || null,
          'Phone': leaderRaw['phone'] || leaderRaw['phone_number'] || null,
          'Slack ID': leaderRaw['slack_id'] || null,
          'Address Formatted': [
            leaderRaw['address_line_1'],
            leaderRaw['address_line_2'],
            leaderRaw['address_city'] || leaderRaw['city'],
            leaderRaw['address_state'] || leaderRaw['state'],
            leaderRaw['address_country'] || leaderRaw['country'],
            leaderRaw['address_zip'] || leaderRaw['zip']
          ].filter(Boolean).join(', ') || null,
          'Address Line 1': leaderRaw['address_line_1'] || null,
          'Address Line 2': leaderRaw['address_line_2'] || null,
          'Address City': leaderRaw['address_city'] || leaderRaw['city'] || null,
          'Address State': leaderRaw['address_state'] || leaderRaw['state'] || null,
          'Address Zip': leaderRaw['address_zip'] || leaderRaw['zip'] || null,
          'Address Country': leaderRaw['address_country'] || leaderRaw['country'] || null,
          'Website': leaderRaw['link_personal_website'] || leaderRaw['website'] || null,
          'GitHub': leaderRaw['link_github'] || leaderRaw['github'] || null,
          'Twitter': leaderRaw['link_social_media'] || leaderRaw['twitter'] || null,
          'Other': leaderRaw['link_other'] || null,
          'Achievement': leaderRaw['app_build'] || null,
          'New Fact': leaderRaw['app_learning'] || null,
          'Hacker Story': leaderRaw['app_evidence'] || null,
          'Pronouns': leaderRaw['pronouns'] || null
        }
        leaders.push(mainLeader)
        console.log('Added main leader:', mainLeader['Full Name'])
      }
      } catch (err) {
        console.error('Error fetching main leader:', err)
      }
    }
    
    // Get co-leaders if they exist
    if (clubRaw['rel_co_leaders'] && clubRaw['rel_co_leaders'].length > 0) {
      console.log(`Fetching ${clubRaw['rel_co_leaders'].length} co-leaders...`)
      for (const coLeaderId of clubRaw['rel_co_leaders']) {
        try {
          const coLeaderRecord = await airtable.find('Leaders', coLeaderId)
          console.log('Co-leader record:', coLeaderRecord)
          if (coLeaderRecord) {
            const leaderRaw = coLeaderRecord.fields
          const coLeader = {
            'Full Name': leaderRaw['name'] || `${leaderRaw['first_name'] || ''} ${leaderRaw['last_name'] || ''}`.trim() || null,
            'Birthday': leaderRaw['birthday'] || leaderRaw['dob'] || leaderRaw['date_of_birth'] || null,
            'School Year': leaderRaw['year'] || leaderRaw['graduation_year'] || null,
            'Phone': leaderRaw['phone'] || leaderRaw['phone_number'] || null,
            'Slack ID': leaderRaw['slack_id'] || null,
            'Address Formatted': [
              leaderRaw['address_line_1'],
              leaderRaw['address_line_2'],
              leaderRaw['address_city'] || leaderRaw['city'],
              leaderRaw['address_state'] || leaderRaw['state'],
              leaderRaw['address_country'] || leaderRaw['country'],
              leaderRaw['address_zip'] || leaderRaw['zip']
            ].filter(Boolean).join(', ') || null,
            'Address Line 1': leaderRaw['address_line_1'] || null,
            'Address Line 2': leaderRaw['address_line_2'] || null,
            'Address City': leaderRaw['address_city'] || leaderRaw['city'] || null,
            'Address State': leaderRaw['address_state'] || leaderRaw['state'] || null,
            'Address Zip': leaderRaw['address_zip'] || leaderRaw['zip'] || null,
            'Address Country': leaderRaw['address_country'] || leaderRaw['country'] || null,
            'Website': leaderRaw['link_personal_website'] || leaderRaw['website'] || null,
            'GitHub': leaderRaw['link_github'] || leaderRaw['github'] || null,
            'Twitter': leaderRaw['link_social_media'] || leaderRaw['twitter'] || null,
            'Other': leaderRaw['link_other'] || null,
            'Achievement': leaderRaw['app_build'] || null,
            'New Fact': leaderRaw['app_learning'] || null,
            'Hacker Story': leaderRaw['app_evidence'] || null,
            'Pronouns': leaderRaw['pronouns'] || null
          }
          leaders.push(coLeader)
          console.log('Added co-leader:', coLeader['Full Name'])
        }
        } catch (err) {
          console.error('Error fetching co-leader:', err)
        }
      }
    }
    
    console.log(`Total leaders fetched: ${leaders.length}`)

    // Create a tracked app object for compatibility
    let trackedApp = {
      id: recordID,
      fields: {
        'Club Status': clubRaw['Club Status'] || null,
        'Application Status': clubRaw['Application Status'] || null,
        'Notes': clubRaw['notes'] || null,
        'Ambassador': clubRaw['rel_ambassador'] || null
      }
    }

    return {
      props: { query, application, leaders, trackedApp, session },
      notFound: false
    }
  } catch (e) {
    console.error(e)
    return { notFound: true }
  }
}
