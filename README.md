# Zuri Logistics Group — Digital Platform

A multilingual corporate website and business operations platform for Zuri Logistics Group.

## Business divisions
1. Logistics & Transport
2. Mining & Minerals
3. Agriculture & Farming
4. Engineering & Industrial Services

## Website
- Primary domain: https://zurilogisticsgroup.co.za
- Languages: English and French
- Public-facing corporate pages with responsive layouts, animations, imagery, service information and enquiry forms.

## Portals
- **Admin:** manage users, partner approvals, divisions, contracts, quotations, invoices, staff, documents and reports.
- **Client:** register, submit enquiries, request quotations, view invoices and documents, track jobs/deliveries and message the team.
- **Partner:** register a business, submit verification documents, list services/products/equipment, respond to opportunities, submit proposals/quotes, manage availability and view assigned jobs/payment status.

## Core platform capabilities
- Central business database for companies, suppliers, customers, transporters, trucks/equipment, mining operations, farms, engineering firms, products/minerals, contracts, quotations and invoices.
- Separate authenticated access and role-based permissions for administrators, clients and partners.
- Approval workflow for partner registrations and uploaded documents.
- Secure document storage and audit trails.
- English/French content support.
- Responsive dashboard and reporting.

## Suggested technical architecture
- Frontend: Next.js / TypeScript
- Backend and data: PostgreSQL with Supabase
- Authentication: Supabase Auth with role-based access and row-level security
- Hosting: Cloudflare Pages or Vercel, subject to deployment requirements

## Important business rule
The platform may prepare marketing campaigns, customer messages and social posts, but **must ask for the user's approval before publishing, contacting customers or sending messages**.

## Project status
This repository is the project workspace. This initial commit records the agreed project scope and proposed architecture; it is not yet the completed application. Implementation decisions and deployment configuration remain to be completed.
