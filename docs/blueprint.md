# **App Name**: AgentFlow

## Core Features:

- Agent Onboarding Form: Public-facing form for agents to submit onboarding details (name, email, phone, documents, etc.). Form data is stored in the database.
- Admin Review and Approval: Secure admin dashboard to review submitted agent requests.  Admins can approve or reject requests. Upon approval, a secure password is auto-generated and emailed to the agent via SMTP. The agent's status is updated in the database.
- Role-Based Dashboard: Role-based access control for admins, ops, and agents.  Admins have full access, ops have view-only access, and agents can log in to a personal dashboard to see their own info. Uses JWT for authentication and authorization middleware to protect routes.

## Style Guidelines:

- Primary color: White or light grey for a clean, professional look.
- Secondary color: A calming blue (#3498db) for headers and accents.
- Accent: A warm green (#2ecc71) for approval buttons and success messages.
- Clear and readable sans-serif fonts for all text.
- Simple, consistent icons to represent actions and status indicators.
- Responsive layout that adapts to different screen sizes.

## Original User Request:
Build a full-stack role-based agent onboarding dashboard with the following functionality and tech stack:

🎯 Core Functionality
Agent Onboarding Flow:

Public webpage with a form where agents can submit onboarding details (name, email, phone, documents, etc.)

Admin reviews submitted requests from a secure dashboard and can approve or reject each request

On approval:

System auto-generates a secure password

Sends an email to the agent via SMTP containing login credentials

Marks agent as "approved" in the database

On rejection:

Sends rejection email (with optional message)

🔐 Role-Based Access Control
Three roles: admin, ops, agent

Admin:

Full access: view, approve/reject agent requests, manage users

Ops:

View-only access to agent data

Agent:

After approval, can log into a personal dashboard to see their own info

🧱 Tech Stack
Frontend: React + Redux Toolkit + TailwindCSS

Backend: Node.js + Express

Database: MySQL

Auth: JWT-based login, role stored in token payload

Email: SMTP (e.g., Nodemailer with Gmail or any SMTP service)

File Upload (optional): Allow agents to upload ID/documents (store securely with links in DB)

🔧 Key Implementation Requirements
Authentication middleware (JWT verification)

Authorization middleware (role-checking, e.g., authorizeRoles('admin'))

Clean UI layout with role-based route protection and menu visibility

MySQL schema with at least:

users (id, name, email, password_hash, role)

agent_requests (id, name, email, status, created_at, approved_at, doc_urls, etc.)

Agent form data stored in DB until approved (then optionally moved to users)

Admin UI with list of pending/approved/rejected agents and action buttons

SMTP email triggers on approval/rejection
  