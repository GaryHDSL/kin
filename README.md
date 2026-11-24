# Core Webber — Property, Renovation & Construction

A responsive property-search portal and client account foundation for Core Webber.

## Property portal design
The homepage uses a property marketplace layout inspired by common South African property portals:
- Search tabs for properties for sale and to rent.
- Location, property type, price range, bedroom and garden filters.
- Property cards with price, location, photos and enquiry links.
- Responsive navigation and mobile layout.
- Dedicated sections for renovations, construction and maintenance services.

The visual layout is an original Core Webber design. It does not copy Property24 branding, text or proprietary assets.

## Listings and data
- The homepage currently includes clearly labelled illustrative demo cards.
- When Supabase is configured, the homepage loads published records from the `properties` table.
- Only records with `status = 'published'` are visible to public visitors.
- Do not publish demo/sample data as real property inventory. Add only verified listings with owner/agent permission, accurate pricing, location and availability.

## Client portal pages
- `client-register.html` — create an account
- `client-login.html` — sign in
- `reset-password.html` — request a password reset
- `update-password.html` — choose a new password
- `client-dashboard.html` — submit and view enquiries, quotations and project records

## Database
Supabase (PostgreSQL + Supabase Auth) is the selected backend. The migration is in `supabase/migrations/001_core_webber.sql`.

### Database tables
- `profiles` — client identity/contact details and staff role
- `properties` — sale/rental listings, pricing, location, rooms, sizes, features and image URLs
- `enquiries` — property, renovation and construction requests
- `quotations` — client quotations and status
- `projects` — approved renovation/construction project records
- `documents` — private document metadata

Row Level Security is enabled. Passwords are managed by Supabase Auth and are never stored in the app database. Clients can access their own profile, enquiries, quotations, projects and document metadata. Published property listings are readable publicly. Staff-managed records have no client write policies.

### Connect the live database
1. Create a Supabase project at https://supabase.com.
2. In Supabase **SQL Editor**, run `supabase/migrations/001_core_webber.sql`.
3. In **Project Settings → API**, copy the Project URL and publishable/anon public key.
4. Put those two public values in `js/supabase-config.js`. Never use the secret/service-role key in browser code.
5. In **Authentication → URL Configuration**, add the deployed website URL to the Site URL and add these Redirect URLs:
   - `https://YOUR-DOMAIN/client-dashboard.html`
   - `https://YOUR-DOMAIN/update-password.html`
   Also add your local development URL if needed.
6. Configure the Supabase email provider/SMTP and test signup confirmation and password reset.
7. Deploy the website over HTTPS.
8. Add verified property records using a trusted admin workflow or the Supabase dashboard. Set `status = 'published'` only after checking the listing.
9. Create the first administrator role only from the trusted Supabase SQL Editor after confirming that person's auth user ID:
   `update public.profiles set role = 'admin' where id = 'AUTH-USER-UUID';`

## Launch status and remaining work
- Client registration, login, password reset and dashboard page foundations are in the repository.
- Database schema and Row Level Security migration are prepared, but **the live Supabase project is not yet connected**. The website needs the project's URL and public key.
- Property search can read published database listings after Supabase is configured.
- The current demo property cards are illustrative and must be replaced by verified listings before launch.
- Admin/staff property-management screens, listing photo upload/storage policies, document storage permissions, and full quotation/project management workflows still need implementation and testing.
- Add a privacy notice and retention policy before collecting real client information. Confirm POPIA requirements and applicable building/electrical compliance.
- Do not commit passwords, database credentials, service-role keys or private customer documents.

## Agent portal (new)
- Footer **Join as an agent** opens `agent-register.html`.
- Agent applicants register with Supabase Auth and submit their agency details. Registration does not grant agent privileges automatically.
- After identity/agency checks, approve the applicant in Supabase SQL Editor:
  `update public.profiles set role = 'agent' where id = 'AUTH-USER-UUID';`
  `update public.agent_applications set status = 'approved' where id = 'AUTH-USER-UUID';`
- Approved agents sign in through `client-login.html` and are routed to `agent-dashboard.html`.
- The agent dashboard supports sale/rental property submissions, price, address, suburb/city, bedrooms/bathrooms, description, features and image URLs.
- Agent submissions are saved as `pending_review`. They are not public until Core Webber verifies and publishes them:
  `update public.properties set status = 'published' where id = 'PROPERTY-UUID';`
- Apply the additional database migration `supabase/migrations/002_agent_listings.sql` after the initial migration. It adds agent applications, ownership fields and Row Level Security policies.
- Images are currently supplied as externally hosted image URLs; direct photo upload/storage is not included in this first version.
- The live agent portal requires the real Supabase project URL/public key in `js/supabase-config.js`. The repository still contains placeholders, so registration and listings will not work live until configured.
