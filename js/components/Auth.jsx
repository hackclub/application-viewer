import { signIn } from 'next-auth/client'

export const Auth = () => {
  return (
    <>
      <a href="https://hackclub.com/">
        <img 
          className="hackclub-banner"
          src="https://assets.hackclub.com/flag-standalone-bw.svg" 
          alt="Hack Club"
        />
      </a>
      <div className="main-layout" style={{ gridTemplateColumns: '1fr', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ec3750',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Authentication Required
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#1f2d3d', 
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem auto'
          }}>
            Please sign in with your Slack account. Only Hack Club Ambassadors can access this application viewer.
          </p>
          <button 
            onClick={() => signIn('slack')}
            style={{
              background: '#4A154B',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#611f69'
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#4A154B'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 122.8 122.8" fill="currentColor">
              <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"/>
              <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"/>
              <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"/>
              <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"/>
            </svg>
            Sign In with Slack
          </button>
        </div>
      </div>
    </>
  )
}
