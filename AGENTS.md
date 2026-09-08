# Project conventions

- Spanish single-page course landing built with Next.js 15 App Router, TypeScript, Tailwind CSS 4, Lucide and React Hook Form. No database or authentication.
- `src/app/page.tsx` is a server component; interactive registration lives in `src/components/registration-form.tsx`.
- The shared validation contract is in `src/lib/registration.ts`. The server accepts a boolean `isAssociate`; the form converts its select value before submission.
- `POST /api/register` forwards only validated fields plus a server timestamp and fixed source. Never expose `N8N_WEBHOOK_URL` to browser code or log upstream credentials.
- Set `N8N_WEBHOOK_URL` in `.env.local` for local integration or Vercel environment variables for deployment. Restart/redeploy after changing it. Use an active production n8n webhook URL, not an ephemeral test URL.
- An unset webhook intentionally returns simulated success; no registrations are persisted. Development logs the mock payload; production redacts personal data. Configure the webhook before collecting real leads.
- Original promotional assets are under `Imágenes/`. The optimized hero crop is `public/course-landscape.webp`; no external image or font requests are needed.
- Preserve supplied dates and prices. Course timezone and a detailed official syllabus have not been provided; do not invent either.
- PostCSS is pinned through an npm override to 8.5.26 to address security advisories affecting Next.js 15's older transitive dependency. Keep security fixes when updating dependencies.

# Commands

- Install: `npm ci`
- Development: `npm run dev`
- Production verification: `npm run build`, `npm run lint`, `npm run typecheck`
- Production server: `npm run start`
- Browser setup: `npx playwright install chromium`
- Tests: run `npm run build` first, then `npm test`.
- Playwright starts the built application on ports 3000 (mock) and 3001 (configured local webhook), plus a local capture fixture on port 4318. Keep those ports free; tests never need real lead data or a real n8n service. Set `CI=1` to disable server reuse.
- Tests cover desktop/mobile browser flows, form validation, server validation, exact webhook payload, upstream failure/timeout and redirect protection. Screenshots and reports go to ignored `test-results/` and `playwright-report/` directories.
