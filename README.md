# Core Webber — Property, Renovation & Construction

Responsive public website and Supabase-ready client portal for Core Webber.

## Public website
- Property sales and rentals
- Home renovations and property improvements
- Small construction and building works
- Plumbing, painting and electrical services
- Building plans and drawing coordination
- Project enquiry form

## Client portal pages
- `client-register.html` — create an account
- `client-login.html` — sign in
- `reset-password.html` — request a password reset
- `update-password.html` — choose a new password
- `client-dashboard.html` — submit and view enquiries, quotations and project records

## Database
Supabase (PostgreSQL + Supabase Auth) is the selected backend.

### Setup steps
1. Create a Supabase project at https://supabase.com.
2. In Supabase **SQL Editor**, run `supabase/migrations/001_core_webber.sql`.
3. In **Project Settings → API**, copy the Project URL and the publishable/anon public key.
4. Put those two public values in `js/supabase-config.js`. Never use the secret/service-role key in browser code.
5. In **Authentication → URL Configuration**, add the deployed website URL to the Site URL and add these Redirect URLs:
   - `https://YOUR-DOMAIN/client-dashboard.html`
   - `https://YOUR-DOMAIN/update-password.html`
   Also add the local development URL if you use one.
6. Configure the Supabase email provider / SMTP and test signup confirmation and password reset.
7. Deploy the static website to a host that serves the pages over HTTPS.
8. Create the first administrator role only from the trusted Supabase SQL Editor after confirming that person's auth user ID. Example:
   `update public.profiles set role = 'admin' where id = 'AUTH-USER-UUID';`

## Database tables
- `profiles` — client identity/contact details and staff role
- `properties` — sale/rental listings
- `enquiries` — client service and property requests
- `quotations` — quotations linked to clients/enquiries
- `projects` — approved project records
- `documents` — private document metadata

Row Level Security is enabled. Clients can read their own profile, enquiries, quotations, projects and document metadata. Clients can submit their own enquiries. Published property listings are readable publicly. Staff-managed records have no client write policies. Passwords are managed by Supabase Auth and are never stored in the app database.

## Important launch notes
- The portal pages and SQL migration are committed, but **the live database is not connected yet**. A Supabase project must be created and its URL/public key configured.
- The current client dashboard is a first functional portal foundation. Admin/staff management screens, document storage permissions, quotation acceptance/payment, and project status update workflows still need implementation and testing.
- The public website contact/enquiry form is still a prototype. Connect it to a secure backend/email workflow before launch.
- Add a privacy notice and retention policy before collecting real client information. Confirm POPIA requirements and any applicable local building/electrical compliance.
- Property photos are illustrative stock imagery, not actual listings. Only publish listings with verified availability, pricing and permission.
- Do not commit passwords, database credentials, service-role keys or private customer documents.
