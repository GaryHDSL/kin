# Zuri Logistics Group – Dynamic Website

A multilingual corporate website and planned business operations platform for Zuri Logistics Group.

## Website starter
The first responsive website prototype is available in:
- `index.html` — public homepage, company introduction, four divisions, partner network, portal previews and enquiry form.
- `styles.css` — responsive visual design and layout.
- `script.js` — mobile navigation, English/French text toggle, portal preview modals and email enquiry preparation.

Open the site from GitHub: https://github.com/GaryHDSL/kin/blob/main/index.html

## Business divisions
1. Logistics & Transport
2. Mining & Minerals
3. Agriculture & Farming
4. Engineering & Industrial Services

## Contact
- Website: https://zurilogisticsgroup.co.za
- ECU services: https://ecu.zurilogisticsgroup.co.za
- Email: sales@zurilogisticsgroup.co.za
- WhatsApp: +27 63 836 6355

## Planned portals
- **Admin:** manage users, partner approvals, divisions, contracts, quotations, invoices, staff, documents and reports.
- **Client:** register, submit enquiries, request quotations, view invoices/documents, track jobs/deliveries and message the team.
- **Partner:** register a business, submit verification documents, list services/products/equipment, respond to opportunities, submit proposals/quotes, manage availability and view assigned jobs/payment status.

## Planned platform architecture
- Frontend: Next.js / TypeScript (architecture to be finalised; current site is a static HTML/CSS/JS prototype).
- Backend and data: PostgreSQL with Supabase.
- Authentication: Supabase Auth with role-based access and row-level security.
- Hosting: Cloudflare Pages or Vercel, subject to deployment requirements.

## Important safeguards
- Portal cards and dashboards are currently illustrative previews, not secure login systems.
- The enquiry form opens a pre-filled email on the visitor's device; it does not save submissions to a server.
- Do not place credentials, private customer data or confidential documents in this repository.
- Marketing campaigns and customer messages must require explicit user approval before publishing or sending.

## Project specification
See [PROJECT_SPEC.md](PROJECT_SPEC.md) for the fuller functional requirements, initial data model, security considerations and implementation phases.
