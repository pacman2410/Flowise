# Career Lab HQ Production Deliverables

## 1. Complete Sitemap

Public: Home, About Career Lab HQ, Services, Career Lab AI, Leadership Lab, Resources, Pricing, FAQ, Contact, Book a Session, Login, Register.

Authenticated member: Dashboard, Career Lab AI, Career Blueprint, Interview Prep Center, Leadership Lab, Resource Library, Resume Vault, Coaching Sessions, Messages, Account, Billing.

Coach: Coach Dashboard, Client Roster, Session Notes, Recommendations, Follow-up Actions, Availability, Messages.

Admin: User Management, Subscription Management, Content Management, Resource Management, Coaching Analytics, Revenue Dashboard, CRM, Newsletter Management, AI Usage Analytics, Appointment Management.

Excluded from public nav: Podcast, Book, Meet Mario.

## 2. UX Wireframes

Home: sticky nav, hero with two CTAs, three value cards, four-step workflow, six problem cards, anonymous coach profiles, coach differentiation section, testimonial carousel, final CTA.

Member dashboard: top summary row with Career Health Score, goals progress, next session, and plan tier; center column for AI recommendations and Career Blueprint progress; side column for action items, learning progress, and recent activity.

Career Lab AI: left memory/context rail, center GPT-style thread, right recommendation panel with saved goals, action items, and escalation CTA.

Career Blueprint: current state and desired state at top, target role/salary/industry fields, skill gap table, milestone timeline, action checklist, progress meter.

Interview Prep Center: mode selector, question practice, live answer capture, STAR feedback, readiness score, session history, analytics.

Admin dashboard: KPI strip, user/subscription tables, AI usage chart, appointment queue, content queue, coaching analytics.

## 3. User Flows

Visitor to free member: lands on Home, clicks Try Career Lab AI, registers, completes assessment, receives starter blueprint, enters dashboard.

Free to Professional: reaches AI limit or clicks unlock, reviews pricing, pays with Stripe, receives unlimited AI coaching and resource access.

Professional to Premium: requests resume review, LinkedIn review, interview prep, or human coaching, upgrades, books through Cal.com.

Coach workflow: reviews assigned client, reads blueprint and AI history, adds session notes, creates follow-up actions, tracks progress.

Admin workflow: monitors acquisition, subscriptions, usage, coaching capacity, content performance, and support issues.

## 4. Database Schema

Core tables: profiles, roles, memberships, subscriptions, assessments, career_blueprints, blueprint_milestones, action_items, ai_conversations, ai_messages, memory_items, resumes, resume_versions, interview_sessions, interview_answers, readiness_scores, resources, resource_categories, learning_progress, coaching_sessions, session_notes, coach_assignments, messages, support_tickets, payments, invoices, audit_logs.

Important relationships: profiles has many career_blueprints, ai_conversations, resumes, coaching_sessions, action_items, learning_progress. coaches are profiles with coach role and many coach_assignments. subscriptions connect profiles to Stripe customer and price IDs.

Vector memory: store user-owned memory_items with type, content, metadata, embedding, source, confidence, retention policy, and last_accessed_at.

## 5. API Architecture

Frontend: Next.js App Router, server components for public pages, protected route groups for portals, route handlers for webhooks and server-only operations.

Backend: Supabase Auth, Postgres, Row Level Security, Storage for resumes/resources, Edge Functions for AI orchestration and scheduled emails.

Key API domains: auth, profile, assessment, blueprint, ai-coach, memory, resources, interviews, coaching, billing, admin, analytics, notifications.

Integrations: Stripe Checkout and Billing Portal, Cal.com booking, OpenAI and Anthropic model router, PostHog events, Google Analytics, email provider.

## 6. Design System

Brand feel: premium SaaS, practical coaching, executive clarity. Avoid generic coaching imagery and corporate buzzwords.

Palette: ink #111827, slate #5F6B7A, cloud #F6F8FB, white #FFFFFF, teal #0B5D5A, navy #101827, blue #2563EB, amber #B86B23, border #D9E1EA.

Typography: Inter or system sans for product UI, tight display sizing only for public hero sections, monospace only for scores or system metadata.

Components: Button, IconButton, Input, Select, Textarea, Tabs, SegmentedControl, Toggle, Progress, Badge, Card, Modal, Drawer, DataTable, EmptyState, Toast, MetricTile, Timeline, ChatThread, MessageComposer, ResourceCard, PricingCard.

Accessibility: WCAG 2.2 AA contrast, focus rings, keyboard navigation, semantic landmarks, reduced motion support, descriptive form errors.

## 7. Component Library

Public: TopNav, Hero, FeatureCards, HowItWorks, ProblemCards, CoachProfiles, TestimonialCarousel, PricingTable, FAQAccordion, ContactForm, FinalCTA.

Member: DashboardShell, MetricWidget, GoalProgress, ActivityFeed, RecommendationList, BlueprintProgress, ActionItemList, LearningProgress, PlanGate.

AI: ChatShell, MemoryRail, CoachingPromptLibrary, EscalationCTA, SavedInsight, ConversationSummary.

Blueprint: BlueprintEditor, MilestoneTimeline, SkillGapTable, SalaryTargetInput, ActionStepChecklist.

Interview: PracticeModeTabs, QuestionCard, AnswerRecorder, STARFeedback, ReadinessScore, SessionAnalytics.

Admin and coach: AdminShell, UserTable, RevenueChart, UsageChart, ClientRoster, SessionNoteEditor, FollowUpBuilder.

## 8. Development Backlog

Phase 1: public website, Supabase Auth, role model, onboarding assessment, member dashboard, Career Lab AI, memory store, Career Blueprint, Resume Vault, Resource Library, Cal.com booking, Stripe subscriptions, admin dashboard.

Phase 2: interview prep analytics, coach dashboard, message center, email automations, PWA install, push notifications, newsletter management.

Phase 3: enterprise accounts, team dashboards, manager enablement resources, SSO, advanced analytics, group coaching operations.

## 9. User Stories

As a visitor, I can understand what Career Lab HQ does and choose AI coaching or human coaching.

As a free member, I can complete an assessment and receive a starter Career Blueprint.

As a Professional member, I can use unlimited AI coaching and track progress against goals.

As a Premium member, I can book human coaching and receive resume, LinkedIn, and interview support.

As a coach, I can review client history, add session notes, and assign follow-up actions.

As an admin, I can manage users, subscriptions, resources, appointments, analytics, and content.

## 10. Acceptance Criteria

Authentication supports guest, free member, professional member, premium member, coach, and admin access.

Protected routes deny unauthorized users and redirect to login or upgrade flows.

Career Lab AI persists conversations, memory items, recommendations, and action items.

Career Blueprint supports current state, desired state, target role, target salary, industry, skill gaps, development plan, milestones, timeline, and action steps.

Stripe webhooks reliably update subscription state. Cal.com bookings create coaching sessions. Admin can view key platform metrics.

## 11. Testing Strategy

Unit: pricing logic, role gates, blueprint progress, AI memory transforms, schema validators.

Integration: Supabase RLS, Stripe webhook handling, Cal.com booking sync, AI conversation persistence, resource access by plan.

E2E: registration, onboarding, upgrade, AI coaching, blueprint update, booking, admin user review.

Quality gates: TypeScript strict, lint, accessibility checks, Playwright responsive screenshots, Lighthouse performance pass, webhook replay tests.

## 12. Security Architecture

Use Supabase RLS for all user-owned data. Store resumes in private buckets with signed URLs. Never expose service-role keys to the browser.

Encrypt secrets in platform env vars. Validate Stripe and Cal.com webhook signatures. Rate-limit AI endpoints. Log admin actions in audit_logs.

AI safety: do not present AI as legal, medical, or financial authority. Escalate high-stakes workplace, layoff, negotiation, harassment, or discrimination issues to human coach or appropriate professional support.

Privacy: data export, delete account path, retention windows for uploaded documents, opt-in memory controls, clear AI data usage disclosure.

## 13. Deployment Plan

Environments: local, preview, staging, production.

Hosting: Vercel for Next.js, Supabase for Postgres/Auth/Storage/Edge Functions, Stripe live mode, Cal.com production app, PostHog project.

CI: install, typecheck, lint, unit tests, build, Playwright smoke. Run migrations through Supabase CLI with reviewed SQL.

Release steps: deploy staging, validate webhooks, run smoke tests, seed resources, verify role gates, promote production, monitor logs and payment events.

## 14. Cost Estimates

Lean MVP monthly: Vercel $20, Supabase $25, PostHog free to low tier, email $15-$50, Cal.com $0-$15/user, AI usage $100-$500 depending on activity, monitoring $0-$50. Expected early monthly platform cost: $160-$700 before coach labor.

Coach labor is the largest variable cost. Premium pricing should reserve human coaching minutes carefully and make overages explicit.

## 15. Revenue Projections

Conservative 90-day target: 500 free members, 50 Professional at $29, 10 Premium at $129. MRR: $2,740.

Base 90-day target: 1,500 free members, 150 Professional at $29, 35 Premium at $129. MRR: $8,865.

Strong 90-day target: 3,000 free members, 350 Professional at $29, 90 Premium at $129. MRR: $21,760.

Primary conversion levers: AI limit gates, blueprint progress value, human coaching escalation, resume/interview review demand, group coaching retention.

## 16. Launch Strategy

Prelaunch: publish waitlist, run founder-led coaching beta, collect anonymized outcomes, build resource library, test pricing with 20-30 users.

Launch: ship public site, free assessment, starter blueprint, Professional plan, Premium coaching upgrade, weekly newsletter, and one live group coaching event.

Post-launch: instrument activation, AI engagement, blueprint completion, upgrade prompts, churn signals, and coach utilization.

## 17. 90-Day Growth Plan

Days 1-30: validate positioning, publish 12 practical career resources, run weekly group session, interview users who complete assessments but do not upgrade.

Days 31-60: add interview prep campaigns, launch referral offer, build LinkedIn content engine, improve onboarding based on activation data.

Days 61-90: introduce premium coaching bundles, run partnership tests with alumni groups and professional associations, create enterprise waitlist, publish outcome case studies.
