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
            Please sign in with your Hack Club email to access the application viewer.
          </p>
          <button 
            onClick={signIn}
            style={{
              background: '#ffffff',
              color: '#ec3750',
              border: '2px solid #ec3750',
              borderRadius: '8px',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#ec3750'
              e.target.style.color = '#ffffff'
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#ffffff'
              e.target.style.color = '#ec3750'
            }}
          >
            Sign In with Email
          </button>
        </div>
      </div>
    </>
  )
}
