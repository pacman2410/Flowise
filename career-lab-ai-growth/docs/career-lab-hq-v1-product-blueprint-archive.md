# Career Lab HQ - Version 1 Product Blueprint

Archived on 2026-06-01.

This archive preserves the first full-platform product blueprint for future review. It should not be treated as the active Phase 1 build plan. Version 1 was valuable because it mapped the long-term product surface, but it assumed a feature-rich platform before validating the smallest paid Career Operating System.

## Website Architecture

Public pages: Home, About Career Lab HQ, Services, Career Lab AI, Leadership Lab, Resources, Pricing, FAQ, Contact, Book a Session, Login, Register.

Authenticated pages: Dashboard, Career Lab AI, Career Blueprint, Interview Prep Center, Leadership Lab, Resource Library, Resume Vault, Coaching Sessions, Messages, Account, Billing.

Coach pages: Coach Dashboard, Client Roster, Session Notes, Recommendations, Follow-up Actions, Availability, Messages.

Admin pages: User Management, Subscription Management, Content Management, Resource Management, Coaching Analytics, Revenue Dashboard, CRM, Newsletter Management, AI Usage Analytics, Appointment Management.

Excluded from public navigation: Podcast, Book, Meet Mario.

## Member Portal

The Version 1 portal centered on a member dashboard with Career Health Score, goals progress, upcoming sessions, AI recommendations, recent activity, Career Blueprint progress, action items, and learning progress.

## AI Coaching Framework

Career Lab AI was designed as a GPT-style assistant supporting career planning, promotion strategy, resume review, LinkedIn review, interview preparation, leadership coaching, conflict management, workplace politics, career transitions, salary negotiation, performance review preparation, new manager coaching, personal branding, and career development planning.

## Career Blueprint

The Career Blueprint module captured current state, desired state, target role, target salary, target industry, skill gaps, development plan, milestones, timeline, and action steps with visual progress tracking.

## Database Design

Core tables: profiles, roles, memberships, subscriptions, assessments, career_blueprints, blueprint_milestones, action_items, ai_conversations, ai_messages, memory_items, resumes, resume_versions, interview_sessions, interview_answers, readiness_scores, resources, resource_categories, learning_progress, coaching_sessions, session_notes, coach_assignments, messages, support_tickets, payments, invoices, audit_logs.

Vector memory was planned through user-owned memory_items with type, content, metadata, embedding, source, confidence, retention policy, and last_accessed_at.

## Pricing Model

Free: limited AI coaching, basic career assessment, limited resources, starter Career Blueprint.

Professional: $29/month, unlimited AI coaching, Career Blueprint, progress tracking, resource library, monthly group coaching.

Premium: $129/month, everything in Professional plus human coaching sessions, resume review, LinkedIn review, interview preparation, and priority support.

## User Flows

Visitor to free member: lands on Home, clicks Try Career Lab AI, registers, completes assessment, receives starter blueprint, enters dashboard.

Free to Professional: reaches AI limit or clicks unlock, reviews pricing, pays with Stripe, receives unlimited AI coaching and resource access.

Professional to Premium: requests resume review, LinkedIn review, interview prep, or human coaching, upgrades, books through Cal.com.

Coach workflow: reviews assigned client, reads blueprint and AI history, adds session notes, creates follow-up actions, tracks progress.

Admin workflow: monitors acquisition, subscriptions, usage, coaching capacity, content performance, and support issues.

## Admin Portal

The Version 1 admin portal included user management, subscription management, content management, resource management, coaching analytics, revenue dashboard, CRM, newsletter management, AI usage analytics, and appointment management.

## Coach Portal

The Version 1 coach portal included client roster, session notes, coaching recommendations, client history, progress tracking, follow-up actions, availability, and messages.

## Resource Library

Categories: Leadership, Career Growth, Interviewing, Workplace Strategy, Networking, Personal Branding, Templates, Worksheets, AI Prompts, Downloads, Videos.

## Revenue Model

Revenue streams included subscriptions, human coaching upgrades, digital products, resources, workshops, future community offerings, and later enterprise programs.

Early projection examples from Version 1:

Conservative 90-day target: 500 free members, 50 Professional at $29, 10 Premium at $129, producing $2,740 MRR.

Base 90-day target: 1,500 free members, 150 Professional at $29, 35 Premium at $129, producing $8,865 MRR.

Strong 90-day target: 3,000 free members, 350 Professional at $29, 90 Premium at $129, producing $21,760 MRR.

## Growth Strategy

Version 1 growth strategy included waitlist, founder-led coaching beta, anonymized outcomes, resource library development, pricing tests, weekly group coaching, LinkedIn content, referral offers, partnerships, enterprise waitlist, and outcome case studies.

## Strategic Note

This blueprint is preserved as the long-term platform map. The active Version 2 strategy should validate a smaller product first: assessment, proprietary scores, Career Blueprint, weekly check-in, AI advisor, and human escalation.
