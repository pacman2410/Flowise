# Career Lab HQ AI Knowledge System

Purpose: build the company's moat by turning founder expertise, coaching patterns, frameworks, templates, and user outcomes into a continuously improving Digital Career Strategist.

The AI should behave like an experienced HR Business Partner, leadership coach, promotion strategist, talent advisor, and career coach. It should ask follow-up questions, challenge assumptions, identify blind spots, recommend actions, and track progress.

## Knowledge Architecture

Knowledge domains:

- Career clarity
- Promotion strategy
- Leadership development
- New manager readiness
- Interview preparation
- Workplace influence
- Manager conversations
- Performance reviews
- Salary negotiation
- Career transition
- Layoff recovery
- Personal branding

Knowledge object types:

- Framework
- Playbook
- Template
- Script
- Checklist
- Article
- Workshop
- Coaching insight
- FAQ
- Case pattern
- Assessment rubric
- Recommendation rule

## Content Ingestion

Sources:

- Founder coaching sessions
- Leadership insights
- Promotion strategies
- Interview strategies
- New manager guidance
- LinkedIn content
- Articles
- Templates
- Future book content
- Workshop content
- Frequently asked questions

Ingestion workflow:

1. Capture raw content.
2. Classify by domain and object type.
3. Extract actionable principles.
4. Convert into reusable framework or recommendation rule.
5. Tag with audience, situation, risk level, and maturity level.
6. Version and approve.
7. Add to retrieval index.
8. Test against sample user scenarios.

## Version Control

Each knowledge item should include:

- ID
- Title
- Domain
- Object type
- Version
- Status: draft, reviewed, active, retired
- Owner
- Source
- Last reviewed date
- Applicable user segment
- Confidence level
- Review notes

Never overwrite frameworks silently. Create new versions so recommendations can be audited.

## Content Tagging

Required tags:

- Domain
- Career stage
- User goal
- Readiness level
- Risk level
- Conversation type
- Assessment component
- Plan horizon
- Human escalation relevance

Example:

`domain: promotion`, `career_stage: senior_ic`, `goal: promotion`, `component: visibility`, `risk: medium`, `output: manager_script`.

## Framework Storage

Frameworks should be stored as structured records:

- Name
- Purpose
- When to use
- Inputs required
- Steps
- Output format
- Anti-patterns
- Example
- Related scores
- Human escalation criteria

## Retrieval Model

Retrieval should combine:

- User goal
- Current score components
- Blueprint context
- Recent check-in
- Evidence vault
- Conversation intent
- Risk level

The AI should retrieve the smallest relevant set of frameworks instead of flooding the response with generic advice.

## Future Learning System

Feedback loops:

- Did user complete recommended action?
- Did score improve?
- Did user request human review?
- Did human coach approve or revise recommendation?
- Did user report outcome?

Use feedback to improve:

- Recommendation priority
- Escalation rules
- Score interpretation
- Framework examples
- Landing page copy

## Digital Career Strategist Behavior

The AI should:

- Ask clarifying questions when goals are vague.
- Challenge assumptions respectfully.
- Identify missing evidence.
- Recommend next action, not long lists.
- Explain why the action matters.
- Track commitments.
- Escalate high-stakes or sensitive issues.

The AI should not:

- Pretend to guarantee promotions, jobs, or compensation.
- Give legal advice.
- Encourage reckless workplace behavior.
- Replace human review for high-risk issues.
- Generate generic motivational content.

## Founder Knowledge Capture Operating Rhythm

After every coaching session:

- Capture problem type.
- Capture useful question asked.
- Capture recommended action.
- Capture blind spot.
- Capture outcome if known.
- Add reusable insight to knowledge backlog.

Weekly:

- Review top user blockers.
- Convert repeated patterns into playbooks.
- Retire weak recommendations.
- Add examples from real user language.

Monthly:

- Audit knowledge base quality.
- Review score-to-recommendation mapping.
- Identify missing frameworks.
- Add new beta learnings.
