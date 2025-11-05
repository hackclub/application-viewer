# HTTPS Local Development Setup

SSL certificates have been generated for local HTTPS development.

## Usage

### Start with HTTPS (recommended for OAuth testing):
```bash
npm run dev:https
```

Access the app at: **https://localhost:3001**

### Start without HTTPS (regular):
```bash
npm run dev
```

Access the app at: **http://localhost:3001**

## Important Notes

1. **Certificate Warning**: Your browser will show a security warning because this is a self-signed certificate. This is normal for local development.

2. **Accept the Certificate**:
   - **Chrome/Edge**: Click "Advanced" → "Proceed to localhost (unsafe)"
   - **Firefox**: Click "Advanced" → "Accept the Risk and Continue"
   - **Safari**: Click "Show Details" → "visit this website"

3. **OAuth Configuration**: 
   - Update your Slack app redirect URLs to include:
     - `https://localhost:3001/api/auth/callback/slack`
   - Update `.env.local`:
     ```bash
     NEXTAUTH_URL=https://localhost:3001
     ```

4. **Certificate Location**: 
   - Certificates are stored in `.cert/` directory
   - They are valid for 365 days
   - They are gitignored for security

## Regenerate Certificates

If you need to regenerate the certificates:

```bash
cd .cert
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-key.pem -out localhost-cert.pem -days 365
```

## Troubleshooting

### "Cannot find module 'https'"
Make sure you're using Node.js (not Deno or Bun).

### Port already in use
Change the port in `server.js` and update NEXTAUTH_URL accordingly.

### OAuth still not working locally
1. Make sure NEXTAUTH_URL uses `https://` not `http://`
2. Verify the Slack redirect URL includes `https://localhost:3001`
3. Clear your browser cookies/cache
4. Try in an incognito/private window
