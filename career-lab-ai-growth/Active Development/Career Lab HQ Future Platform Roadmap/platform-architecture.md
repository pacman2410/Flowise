# Future Platform Architecture

## CRM Architecture

Purpose: manage lead, customer, revenue, coaching, and lifecycle data.

Entities:

- Lead
- Contact
- Customer
- Account
- Opportunity
- Payment
- Subscription
- Assessment
- Blueprint
- Coaching review
- Lifecycle event

Pipeline stages:

- New lead
- Qualified
- Assessment started
- Assessment completed
- Paid diagnostic
- Blueprint delivered
- Check-in active
- Human review requested
- Converted to subscription
- Churn risk
- Alumni or inactive

CRM metrics:

- Lead source
- Conversion rate
- Revenue by offer
- Time to first payment
- Human review conversion
- Retention intent

## Analytics Architecture

Primary metric:

- Weekly Completed Career Actions Per Active Member.

Product metrics:

- Assessment start
- Assessment completion
- Scorecard delivered
- Blueprint completed
- Week 1 check-in
- Week 4 check-in
- Score movement
- Evidence items added
- AI recommendations accepted
- Human escalation requested

Revenue metrics:

- Paid assessment conversion
- Average order value
- Human review attach rate
- Monthly recurring revenue
- Retention
- Refunds
- Revenue by segment

AI metrics:

- AI sessions
- Recommendation completion
- Escalation trigger accuracy
- Repeated blocker patterns
- Human override rate

## Coach Portal Architecture

Purpose: allow humans to review high-stakes cases efficiently.

Coach views:

- Client profile
- Active goal
- Assessment scores
- Score history
- Blueprint
- Weekly check-ins
- Promotion evidence
- AI recommendations
- Escalation reason
- Recommended review template

Coach actions:

- Add review note
- Approve or revise AI recommendation
- Assign follow-up action
- Mark escalation resolved
- Recommend session or sprint

## Admin Portal Architecture

Purpose: manage system operations without overbuilding early.

Admin views:

- Users
- Assessments
- Payments
- Revenue
- Score trends
- Engagement
- Human escalations
- Content library
- Knowledge items
- System health

Admin actions:

- Manage user access
- Adjust subscription status
- Review failed payments
- Manage assessment versions
- Approve knowledge items
- Export reports

## Authentication Architecture

MVP:

- Email login or magic link.
- Role values: guest, beta_user, paid_user, coach, admin.
- Protect assessment reports and user memory.

Future:

- Supabase Auth.
- Row Level Security.
- OAuth optional.
- Admin impersonation only with audit logs.

Security principles:

- Users can only access their own reports, blueprints, evidence, and check-ins.
- Coaches only access assigned clients.
- Admin actions are logged.

## Stripe Integration Architecture

MVP:

- Stripe Payment Links for $99, $299, and $499 offers.
- Manual fulfillment allowed during validation.

Future:

- Stripe Checkout.
- Stripe Customer Portal.
- Webhooks for payment_succeeded, subscription_updated, payment_failed, refund.
- Map Stripe customer ID to user profile.

Products:

- Diagnostic.
- Diagnostic plus review.
- 30-day sprint.
- Monthly operating system subscription.
- Human review add-on.

## Human Escalation Architecture

Escalation record:

- User ID
- Trigger type
- Risk level
- Related assessment
- Related score
- User context
- AI summary
- Requested output
- Assigned reviewer
- Status

Statuses:

- Open
- Assigned
- Reviewed
- Follow-up assigned
- Resolved

Risk levels:

- Low: tactical script review.
- Medium: promotion, interview, or manager conversation.
- High: salary negotiation, performance concern, workplace conflict.
- Critical: legal, harassment, discrimination, safety, or crisis-adjacent issue.

Critical issues should receive careful boundary language and referral to appropriate professional support where needed.
