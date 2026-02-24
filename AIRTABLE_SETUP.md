# Airtable + Netlify Setup

## 1) Create Airtable base and tables

Create two tables:

### `polls` table
Required fields:
- `poll_id` (Single line text)
- `question` (Long text)
- `options_json` (Long text)

### `votes` table
Required fields:
- `vote_id` (Single line text)
- `poll_id` (Single line text)
- `option_id` (Single line text)
- `voter_id` (Single line text)
- `created_at` (Date/time)

## 2) Create Airtable API token

Create a Personal Access Token with access to the base above and scope to read/write records.

## 3) Set Netlify environment variables

In Netlify site settings, add:
- `VITE_POLL_ID`
- `POLL_ID`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_POLLS_TABLE`
- `AIRTABLE_VOTES_TABLE`

Use the values from `.env.example` as the template.

## 4) Deploy

Connect GitHub repo to Netlify and deploy.

The app uses Netlify Functions under `/.netlify/functions/*`:
- `poll-state`
- `vote`
- `poll-config`
- `reset-votes`

## Notes

- Keep `poll_id` and each option `id` stable to preserve vote history when labels change.
- The client stores a local `voter_id` to reduce duplicate voting from the same browser.
