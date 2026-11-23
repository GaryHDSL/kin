# Core Webber Property Portal — Project Specification

## 1. Purpose
Build a South African property marketplace and home-improvement platform for Core Webber. The public site helps visitors search properties for sale or rent and request support with selling, renovations and small construction. Registered clients can securely manage enquiries and project information.

## 2. Public website
- Property search homepage with sale/rent tabs.
- Search by suburb/city, property type, price range, bedrooms and features.
- Property cards and detail pages with approved photos, prices, location and features.
- Property sales and rental enquiries.
- Service pages for renovations, small construction, plumbing, painting, electrical services, and building plans/drawings.
- About, contact, privacy, terms and POPIA information pages.
- Responsive desktop and mobile design, accessible navigation and search controls.
- Search-engine-friendly titles, descriptions, sitemap and structured property data.

The design may take inspiration from familiar property marketplace patterns, but must use original Core Webber branding, copy, layouts and imagery.

## 3. User roles and portals

### Public visitor
- Search published listings.
- View public property information.
- Submit an enquiry or register for an account.

### Client
- Register, sign in and reset password securely.
- Manage own name and contact details.
- Submit property, renovation and construction enquiries.
- View own enquiries, quotations, projects and permitted documents.
- Save property searches/favourites (future enhancement).

### Admin/staff
- Create, edit, publish, unpublish and archive property listings.
- Upload and manage property images.
- Manage client enquiries and lead status.
- Prepare quotations and update project milestones.
- Manage users and staff permissions.
- Review activity and audit administrative changes.

Admin screens and secure staff write workflows remain to be implemented. Never grant admin privileges from browser-side code.

## 4. Database
Supabase PostgreSQL and Supabase Auth are the selected backend.

Initial entities:
- profiles
- properties
- enquiries
- quotations
- projects
- documents

Property records include listing type (sale/rent), type, price/currency, address, suburb, city, bedrooms, bathrooms, parking, floor/erf size, features, status and image URLs.

## 5. Security and privacy
- Supabase Auth handles passwords; never store raw passwords.
- Enable PostgreSQL Row Level Security on all client-related tables.
- Public visitors may read only published property listings.
- Clients may read only their own profile, enquiries, quotations, projects and document metadata.
- Staff writes must use trusted server-side or administrator workflows.
- Keep secret/service-role keys out of browser code and source control.
- Validate and restrict uploads; keep private documents in protected storage.
- Apply POPIA, consent, retention and privacy requirements before collecting real customer data.
- Use HTTPS in production and test account recovery, permissions and backups.

## 6. Development phases
1. Confirm brand identity, domain, contact information and service coverage.
2. Finalise public marketplace design and responsive layouts.
3. Create and configure Supabase project and apply SQL migration.
4. Connect authentication and test registration/login/password reset.
5. Connect public property search to published database listings.
6. Build property detail pages and enquiry workflows.
7. Build admin listing management and image storage.
8. Complete client dashboard, quotation and project workflows.
9. Test security, accessibility, performance, SEO and backup/restore.
10. Deploy to staging, obtain acceptance and deploy production.

## 7. Launch decisions
- Final logo, brand colours and approved property photography.
- Property listing regions and listing verification process.
- Business contact email and phone/WhatsApp.
- Production domain and hosting.
- Supabase project URL, public key, email/SMTP configuration and database region.
- Admin users and approval workflow.
- Privacy notice, POPIA processes and document retention.
- Any payment gateway or third-party property listing integrations.
