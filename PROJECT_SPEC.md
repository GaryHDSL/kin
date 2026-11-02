# Zuri Logistics Group Platform — Project Specification

## 1. Purpose
Build a modern corporate website and secure business platform for Zuri Logistics Group, connecting customers, verified partners and internal administrators across four business divisions.

## 2. Divisions and service catalogue
- Logistics & Transport: freight, transport coordination, truck capacity, cross-border logistics and delivery operations.
- Mining & Minerals: mining-sector services, minerals and commodities information, supplier and buyer enquiries.
- Agriculture & Farming: agricultural services, products, suppliers and opportunities.
- Engineering & Industrial Services: industrial services, equipment, engineering support, truck repairs and ECU diagnostics.

Each division should have its own landing page, service/product catalogue, enquiry workflow and relevant partner listings.

## 3. Public website
- Home, About, Divisions, individual division pages, Services, Partners, Opportunities, News/Insights, Contact and legal/privacy pages.
- Modern corporate visual design, responsive mobile/desktop layouts, animation used without harming accessibility or performance.
- English/French language support.
- Search-engine-friendly metadata, sitemap, structured content and accessible navigation.
- Contact and enquiry forms with spam protection.

## 4. User roles and portals

### Admin portal
- Dashboard with enquiries, active jobs, partner applications and outstanding quotations/invoices.
- Manage users, roles, business divisions, clients, partners, staff and company records.
- Review and approve/reject partner applications and compliance documents.
- Manage contracts, quotations, invoices, jobs, delivery records and uploaded documents.
- Reporting, audit history and platform settings.

### Client portal
- Account registration and secure login.
- Company profile and contact management.
- Submit service enquiries and request quotations.
- View quotation and invoice status; download permitted documents.
- Track assigned jobs/deliveries and communicate with the team.

### Partner portal
- Business registration and profile.
- Upload company, identity, vehicle, insurance, licence and compliance documents as applicable.
- Admin verification and approval before appearing as a verified partner.
- List services, products, minerals, equipment, vehicles and capacity.
- View opportunities and submit proposals/quotations.
- Manage availability, assigned jobs, document status and payment status.
- Secure messaging with authorised users.

## 5. Data model (initial)
Proposed entities:
- users, roles, user_profiles
- companies, clients, partners, partner_verifications
- divisions, services, products, minerals
- suppliers, transporters, vehicles, equipment, farms, mining_operations
- enquiries, opportunities, proposals
- quotations, quotation_items, contracts
- jobs, deliveries, tracking_events
- invoices, invoice_items, payments
- documents, messages, notifications
- audit_logs

Use relational constraints, timestamps, ownership fields and soft deletion where appropriate. Define retention and access rules before production.

## 6. Security and governance
- Enforce least-privilege role-based access.
- Use PostgreSQL row-level security for tenant and role isolation.
- Keep secrets and API keys out of source control; use environment variables.
- Validate and scan uploaded files; restrict file type and size.
- Log sensitive administrative actions.
- Require explicit admin approval for partner verification.
- Back up the database and test restoration.
- Apply privacy, POPIA and any applicable cross-border data requirements before launch.

## 7. Marketing and customer-contact approval
The system can draft campaign ideas, social posts, email and WhatsApp messages, and follow-up recommendations. It must not publish, send, or contact customers automatically without an explicit approval action from an authorised Zuri user. Record the approver, content and timestamp.

## 8. Suggested implementation phases
1. Confirm requirements, brand assets, domain and hosting.
2. Create Next.js application structure and design system.
3. Configure Supabase project, schema, authentication and row-level security.
4. Build public website and bilingual content.
5. Build admin, client and partner portals.
6. Implement enquiries, partner verification, quotations, contracts, jobs, invoices and documents.
7. Add notifications, messaging, reporting and approval-gated marketing workflows.
8. Test security, permissions, accessibility, performance and backups.
9. Deploy to staging, obtain business acceptance, then deploy production.

## 9. Open decisions before production
- Final brand kit, logo, colours and photography.
- Final list of services and division-specific workflows.
- Hosting provider and production database region.
- Partner onboarding and verification checklist.
- Payment gateway and accounting/invoicing requirements.
- Tracking integrations and messaging providers.
- Data retention, privacy notices and user consent requirements.
- Which pages and directories are public versus login-only.

## 10. Initial project contact details
- Website: https://zurilogisticsgroup.co.za
- ECU services website: https://ecu.zurilogisticsgroup.co.za
- Business email: sales@zurilogisticsgroup.co.za
- WhatsApp: +27 63 836 6355

These are project contact details only. Do not place credentials, private customer data or confidential documents in this repository.
