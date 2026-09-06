# DEPLOYMENT_GUIDE.md

## Architecture

This application runs entirely on the client side using browser localStorage:

- **Frontend**: Next.js 16 (React) deployed on Vercel
- **Storage**: Browser localStorage (per-browser, no server-side database)
- **Auth**: Simple client-side session stored in localStorage

## Deployment to Vercel

1. Push this repository to GitHub
2. Import the repository into Vercel
3. No environment variables are required
4. Deploy

## Notes

- Data is stored per-browser in localStorage. It does not sync across devices.
- There are no user accounts. Anyone using the browser can access the journal.
- localStorage has a size limit of roughly 5-10MB depending on the browser.
- Clearing browser data will erase the journal.
