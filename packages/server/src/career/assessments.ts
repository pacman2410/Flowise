export interface Question {
    id: string
    text: string
    dimension: string
    reverseScored?: boolean
}

export interface DimensionDefinition {
    name: string
    label: string
    weight: number // fraction that sums to 1.0
    description: string
}

export interface AssessmentDefinition {
    type: string
    title: string
    description: string
    estimatedMinutes: number
    questions: Question[]
    dimensions: DimensionDefinition[]
}

// ----------------------------------------
// Career Health Assessment
// ----------------------------------------

const careerHealthQuestions: Question[] = [
    // role_clarity
    { id: 'ch_1', text: 'I have a clear picture of where I want my career to be in 3 years', dimension: 'role_clarity' },
    { id: 'ch_2', text: 'I understand exactly what success looks like in my current role', dimension: 'role_clarity' },
    { id: 'ch_3', text: 'I know which skills I need to develop to reach my next career milestone', dimension: 'role_clarity' },
    { id: 'ch_4', text: 'My daily work aligns with my long-term career goals', dimension: 'role_clarity' },
    // performance_impact
    { id: 'ch_5', text: 'I consistently meet or exceed the expectations set for my role', dimension: 'performance_impact' },
    {
        id: 'ch_6',
        text: 'I can clearly articulate the business impact of my work in measurable terms',
        dimension: 'performance_impact'
    },
    {
        id: 'ch_7',
        text: 'I proactively identify and solve problems before they are escalated to me',
        dimension: 'performance_impact'
    },
    {
        id: 'ch_8',
        text: 'My manager and team view me as a high-performer and reliable contributor',
        dimension: 'performance_impact'
    },
    // visibility
    { id: 'ch_9', text: 'Senior leaders in my organization know who I am and the value I bring', dimension: 'visibility' },
    {
        id: 'ch_10',
        text: 'I regularly communicate my accomplishments and contributions to decision-makers',
        dimension: 'visibility'
    },
    { id: 'ch_11', text: 'I have a strong professional brand both internally and in my industry', dimension: 'visibility' },
    {
        id: 'ch_12',
        text: 'I am seen as a go-to expert in at least one important area in my organization',
        dimension: 'visibility'
    },
    // relationships
    {
        id: 'ch_13',
        text: 'I have strong, trusting relationships with key stakeholders across my organization',
        dimension: 'relationships'
    },
    {
        id: 'ch_14',
        text: 'I have a mentor or sponsor who actively advocates for my career advancement',
        dimension: 'relationships'
    },
    {
        id: 'ch_15',
        text: 'I invest time building relationships with people above and across my level',
        dimension: 'relationships'
    },
    { id: 'ch_16', text: 'I have a robust professional network outside my current company', dimension: 'relationships' },
    // growth
    { id: 'ch_17', text: 'I am actively learning new skills that will be valuable in my next role', dimension: 'growth' },
    {
        id: 'ch_18',
        text: 'I seek out stretch assignments and projects that push me beyond my comfort zone',
        dimension: 'growth'
    },
    { id: 'ch_19', text: 'I regularly ask for and act on feedback to improve my performance', dimension: 'growth' },
    { id: 'ch_20', text: 'I have a concrete development plan that I am actively executing', dimension: 'growth' }
]

const careerHealthDimensions: DimensionDefinition[] = [
    {
        name: 'role_clarity',
        label: 'Role Clarity & Direction',
        weight: 0.2,
        description: 'How clear you are about your career direction and current role'
    },
    {
        name: 'performance_impact',
        label: 'Performance & Impact',
        weight: 0.25,
        description: 'How effectively you deliver results and create measurable impact'
    },
    {
        name: 'visibility',
        label: 'Visibility & Influence',
        weight: 0.2,
        description: 'How visible your work and brand is to decision-makers'
    },
    {
        name: 'relationships',
        label: 'Relationships & Network',
        weight: 0.2,
        description: 'The strength of your professional relationships and internal network'
    },
    {
        name: 'growth',
        label: 'Growth & Development',
        weight: 0.15,
        description: 'How actively you are growing your skills and advancing your career'
    }
]

// ----------------------------------------
// Promotion Readiness Assessment
// ----------------------------------------

const promotionReadinessQuestions: Question[] = [
    // results
    {
        id: 'pr_1',
        text: 'I have a documented track record of exceeding goals and targets for the past 2+ performance cycles',
        dimension: 'results'
    },
    {
        id: 'pr_2',
        text: 'I can quantify the business impact of my most significant contributions in dollars, percentage, or scale',
        dimension: 'results'
    },
    {
        id: 'pr_3',
        text: 'My work consistently produces outcomes that are visible and valued at the team and company level',
        dimension: 'results'
    },
    {
        id: 'pr_4',
        text: 'I have delivered results on complex projects that were critical to the organization',
        dimension: 'results'
    },
    // visibility
    {
        id: 'pr_5',
        text: 'I regularly present work, updates, or ideas to senior leadership audiences',
        dimension: 'visibility'
    },
    {
        id: 'pr_6',
        text: 'Senior leaders outside my direct chain know my name and associate it with high performance',
        dimension: 'visibility'
    },
    {
        id: 'pr_7',
        text: 'I am frequently included in high-visibility projects or strategic initiatives',
        dimension: 'visibility'
    },
    {
        id: 'pr_8',
        text: 'My manager actively promotes my work and name in conversations I am not part of',
        dimension: 'visibility'
    },
    // relationships
    {
        id: 'pr_9',
        text: 'I have at least one senior sponsor who has explicitly committed to advocating for my promotion',
        dimension: 'relationships'
    },
    {
        id: 'pr_10',
        text: 'I have built meaningful relationships with at least 3 senior leaders in my organization',
        dimension: 'relationships'
    },
    {
        id: 'pr_11',
        text: 'Key decision-makers who will influence my promotion know my ambitions and capabilities',
        dimension: 'relationships'
    },
    {
        id: 'pr_12',
        text: 'I have strong peer relationships with respected high-performers who speak well of me',
        dimension: 'relationships'
    },
    // leadership_signals
    {
        id: 'pr_13',
        text: 'I regularly take on work that is clearly at the next level up from my current role',
        dimension: 'leadership_signals'
    },
    {
        id: 'pr_14',
        text: 'I mentor, coach, or actively develop less-experienced team members',
        dimension: 'leadership_signals'
    },
    {
        id: 'pr_15',
        text: 'I am trusted to lead cross-functional efforts or represent my team in important meetings',
        dimension: 'leadership_signals'
    },
    {
        id: 'pr_16',
        text: 'Colleagues and managers treat me as if I already operate at the next level',
        dimension: 'leadership_signals'
    },
    // strategic_thinking
    {
        id: 'pr_17',
        text: "I understand the company's strategic priorities and can articulate how my work connects to them",
        dimension: 'strategic_thinking'
    },
    {
        id: 'pr_18',
        text: 'I bring ideas and proposals that go beyond my immediate scope to improve the business',
        dimension: 'strategic_thinking'
    },
    {
        id: 'pr_19',
        text: 'I anticipate future challenges and proactively prepare solutions before problems arise',
        dimension: 'strategic_thinking'
    },
    {
        id: 'pr_20',
        text: "I think about my team and organization's goals as much as I think about my own deliverables",
        dimension: 'strategic_thinking'
    },
    // influence
    {
        id: 'pr_21',
        text: 'I regularly drive alignment and decisions across teams without relying on my title',
        dimension: 'influence'
    },
    { id: 'pr_22', text: 'People actively seek my input and perspective on important decisions', dimension: 'influence' },
    {
        id: 'pr_23',
        text: 'I have influenced significant outcomes by persuading senior stakeholders without formal authority',
        dimension: 'influence'
    },
    {
        id: 'pr_24',
        text: 'I am seen as a change agent who moves the organization in a positive direction',
        dimension: 'influence'
    }
]

const promotionReadinessDimensions: DimensionDefinition[] = [
    {
        name: 'results',
        label: 'Results & Performance',
        weight: 0.25,
        description: 'Consistent track record of delivering above expectations'
    },
    {
        name: 'visibility',
        label: 'Visibility',
        weight: 0.2,
        description: 'How well known and recognized you are by decision-makers'
    },
    {
        name: 'relationships',
        label: 'Relationships',
        weight: 0.15,
        description: 'Political capital and key relationships with sponsors'
    },
    {
        name: 'leadership_signals',
        label: 'Leadership Signals',
        weight: 0.15,
        description: 'Evidence that you operate at the next level'
    },
    {
        name: 'strategic_thinking',
        label: 'Strategic Thinking',
        weight: 0.15,
        description: 'Ability to think beyond your role and connect to business goals'
    },
    {
        name: 'influence',
        label: 'Influence',
        weight: 0.1,
        description: 'Your ability to drive outcomes without direct authority'
    }
]

// ----------------------------------------
// Leadership Readiness Assessment
// ----------------------------------------

const leadershipReadinessQuestions: Question[] = [
    // feedback
    {
        id: 'lr_1',
        text: 'I give regular, specific, and actionable feedback to team members without waiting for formal review cycles',
        dimension: 'feedback'
    },
    {
        id: 'lr_2',
        text: 'I deliver difficult feedback directly and with care, not avoiding hard conversations',
        dimension: 'feedback'
    },
    {
        id: 'lr_3',
        text: 'I actively seek feedback on my own leadership and genuinely act on what I hear',
        dimension: 'feedback'
    },
    {
        id: 'lr_4',
        text: 'I can distinguish between behavior and intent when giving critical feedback',
        dimension: 'feedback'
    },
    // coaching
    {
        id: 'lr_5',
        text: 'I help team members develop solutions themselves rather than telling them what to do',
        dimension: 'coaching'
    },
    {
        id: 'lr_6',
        text: "I understand each person's career goals and actively help them grow toward those goals",
        dimension: 'coaching'
    },
    { id: 'lr_7', text: 'I create stretch opportunities for high-potential team members regularly', dimension: 'coaching' },
    {
        id: 'lr_8',
        text: 'I invest time in 1:1s focused on development, not just status updates',
        dimension: 'coaching'
    },
    // delegation
    {
        id: 'lr_9',
        text: "I delegate work based on team members' development needs, not just capacity",
        dimension: 'delegation'
    },
    {
        id: 'lr_10',
        text: 'I define clear outcomes and autonomy boundaries when delegating, not just tasks',
        dimension: 'delegation'
    },
    { id: 'lr_11', text: 'I trust my team to execute without micromanaging their approach', dimension: 'delegation' },
    {
        id: 'lr_12',
        text: 'I have a track record of developing others who were promoted or given greater responsibility',
        dimension: 'delegation'
    },
    // accountability
    {
        id: 'lr_13',
        text: 'I set clear expectations and hold team members accountable when commitments are not met',
        dimension: 'accountability'
    },
    {
        id: 'lr_14',
        text: 'I take responsibility for team failures without scapegoating or blaming individuals',
        dimension: 'accountability'
    },
    {
        id: 'lr_15',
        text: 'I celebrate and recognize team wins publicly and attribute them to the right people',
        dimension: 'accountability'
    },
    {
        id: 'lr_16',
        text: 'My team members take ownership of outcomes rather than just completing assigned tasks',
        dimension: 'accountability'
    },
    // communication
    {
        id: 'lr_17',
        text: "I communicate the 'why' behind decisions clearly so my team understands the context",
        dimension: 'communication'
    },
    {
        id: 'lr_18',
        text: 'I adjust my communication style to the audience and situation effectively',
        dimension: 'communication'
    },
    { id: 'lr_19', text: 'I run efficient meetings with clear outcomes and follow-through on actions', dimension: 'communication' },
    {
        id: 'lr_20',
        text: 'My team always knows our priorities and how their work connects to the bigger picture',
        dimension: 'communication'
    },
    // trust
    {
        id: 'lr_21',
        text: 'Team members feel comfortable sharing concerns, mistakes, and disagreements with me',
        dimension: 'trust'
    },
    { id: 'lr_22', text: 'I model vulnerability by sharing my own mistakes and learning moments', dimension: 'trust' },
    { id: 'lr_23', text: 'I follow through consistently on commitments I make to my team', dimension: 'trust' },
    {
        id: 'lr_24',
        text: 'I protect my team from organizational politics and unnecessary distractions',
        dimension: 'trust'
    }
]

const leadershipReadinessDimensions: DimensionDefinition[] = [
    {
        name: 'feedback',
        label: 'Giving & Receiving Feedback',
        weight: 0.15,
        description: 'Ability to deliver honest feedback and receive it gracefully'
    },
    {
        name: 'coaching',
        label: 'Coaching Others',
        weight: 0.2,
        description: 'Ability to develop and grow others through coaching'
    },
    {
        name: 'delegation',
        label: 'Delegation',
        weight: 0.2,
        description: 'Ability to delegate effectively and develop team capability'
    },
    {
        name: 'accountability',
        label: 'Accountability',
        weight: 0.2,
        description: 'Creating a culture of ownership and follow-through'
    },
    {
        name: 'communication',
        label: 'Communication',
        weight: 0.15,
        description: 'Clear, direct, and inspiring communication'
    },
    {
        name: 'trust',
        label: 'Trust Building',
        weight: 0.1,
        description: 'Building psychological safety and strong team relationships'
    }
]

// ----------------------------------------
// New Manager Readiness Assessment
// ----------------------------------------

const newManagerReadinessQuestions: Question[] = [
    // role_transition
    {
        id: 'nm_1',
        text: "I understand that my success as a manager is measured by my team's results, not my individual output",
        dimension: 'role_transition'
    },
    {
        id: 'nm_2',
        text: "I am comfortable with the identity shift from 'expert doing the work' to 'leader enabling others'",
        dimension: 'role_transition'
    },
    {
        id: 'nm_3',
        text: 'I have mentally prepared for the fact that management will require very different skills than my current role',
        dimension: 'role_transition'
    },
    {
        id: 'nm_4',
        text: 'I know that building strong relationships with my team is as important as technical expertise',
        dimension: 'role_transition'
    },
    // delegation
    {
        id: 'nm_5',
        text: 'I can identify which tasks to delegate versus which to handle myself as a new manager',
        dimension: 'delegation'
    },
    {
        id: 'nm_6',
        text: "I can hand off work without feeling the need to redo or heavily edit others' output",
        dimension: 'delegation'
    },
    { id: 'nm_7', text: 'I trust others to find their own path to a goal without me defining every step', dimension: 'delegation' },
    {
        id: 'nm_8',
        text: 'I am prepared to let my team make mistakes as part of their learning and development',
        dimension: 'delegation'
    },
    // difficult_conversations
    {
        id: 'nm_9',
        text: 'I can address performance issues directly and early rather than hoping they resolve themselves',
        dimension: 'difficult_conversations'
    },
    {
        id: 'nm_10',
        text: 'I know how to document and escalate performance concerns when needed',
        dimension: 'difficult_conversations'
    },
    {
        id: 'nm_11',
        text: 'I can navigate conflict between team members with fairness and confidence',
        dimension: 'difficult_conversations'
    },
    {
        id: 'nm_12',
        text: "I am prepared to have a compensation or promotion conversation that doesn't go the way someone hopes",
        dimension: 'difficult_conversations'
    },
    // team_management
    {
        id: 'nm_13',
        text: 'I know how to structure effective weekly 1:1 meetings with each direct report',
        dimension: 'team_management'
    },
    { id: 'nm_14', text: 'I can run team meetings that are valuable rather than status recaps', dimension: 'team_management' },
    {
        id: 'nm_15',
        text: 'I understand how to onboard a new team member effectively and set them up for success',
        dimension: 'team_management'
    },
    {
        id: 'nm_16',
        text: 'I have a framework for tracking team goals, commitments, and progress systematically',
        dimension: 'team_management'
    },
    // communication
    {
        id: 'nm_17',
        text: "I can clearly communicate team goals, priorities, and the 'why' behind decisions",
        dimension: 'communication'
    },
    {
        id: 'nm_18',
        text: 'I can translate company or organizational strategy into clear priorities for my team',
        dimension: 'communication'
    },
    {
        id: 'nm_19',
        text: 'I know how to give clear, actionable direction without micromanaging',
        dimension: 'communication'
    },
    {
        id: 'nm_20',
        text: 'I can communicate upward effectively, keeping my manager informed without over-reporting',
        dimension: 'communication'
    },
    // prioritization
    {
        id: 'nm_21',
        text: 'I understand how to prioritize my own time when I am both managing people and still doing some IC work',
        dimension: 'prioritization'
    },
    {
        id: 'nm_22',
        text: "I know how to protect my team's focus from organizational noise and shifting priorities",
        dimension: 'prioritization'
    },
    {
        id: 'nm_23',
        text: 'I can make clear decisions about team priorities when resources are constrained',
        dimension: 'prioritization'
    },
    {
        id: 'nm_24',
        text: 'I am comfortable saying no to requests that would distract the team from core objectives',
        dimension: 'prioritization'
    }
]

const newManagerReadinessDimensions: DimensionDefinition[] = [
    {
        name: 'role_transition',
        label: 'Role Transition',
        weight: 0.25,
        description: 'Mindset shift from individual contributor to manager'
    },
    {
        name: 'delegation',
        label: 'Delegation',
        weight: 0.2,
        description: 'Letting go of execution and empowering the team'
    },
    {
        name: 'difficult_conversations',
        label: 'Difficult Conversations',
        weight: 0.2,
        description: 'Addressing performance, conflict, and behavior issues'
    },
    {
        name: 'team_management',
        label: 'Team Management',
        weight: 0.15,
        description: 'Running team operations, meetings, and 1:1s effectively'
    },
    {
        name: 'communication',
        label: 'Communication',
        weight: 0.1,
        description: 'Clear communication of expectations and vision'
    },
    {
        name: 'prioritization',
        label: 'Prioritization',
        weight: 0.1,
        description: 'Managing time, focus, and competing demands as a manager'
    }
]

// ----------------------------------------
// Assessment Definitions Registry
// ----------------------------------------

export const ASSESSMENT_DEFINITIONS: Record<string, AssessmentDefinition> = {
    career_health: {
        type: 'career_health',
        title: 'Career Health Assessment',
        description:
            'A comprehensive evaluation of your career health across five key dimensions: role clarity, performance impact, visibility, relationships, and growth.',
        estimatedMinutes: 8,
        questions: careerHealthQuestions,
        dimensions: careerHealthDimensions
    },
    promotion_readiness: {
        type: 'promotion_readiness',
        title: 'Promotion Readiness Assessment',
        description:
            'Evaluate your readiness for promotion by measuring your results track record, visibility with leaders, relationship capital, leadership signals, strategic thinking, and influence.',
        estimatedMinutes: 10,
        questions: promotionReadinessQuestions,
        dimensions: promotionReadinessDimensions
    },
    leadership_readiness: {
        type: 'leadership_readiness',
        title: 'Leadership Readiness Assessment',
        description:
            'Assess your preparedness to lead and develop a team across the core leadership competencies: feedback, coaching, delegation, accountability, communication, and trust.',
        estimatedMinutes: 10,
        questions: leadershipReadinessQuestions,
        dimensions: leadershipReadinessDimensions
    },
    new_manager_readiness: {
        type: 'new_manager_readiness',
        title: 'New Manager Readiness Assessment',
        description:
            'Determine how ready you are to step into a first-time management role, covering role transition mindset, delegation, difficult conversations, team management, communication, and prioritization.',
        estimatedMinutes: 10,
        questions: newManagerReadinessQuestions,
        dimensions: newManagerReadinessDimensions
    }
}

export function getAssessment(type: string): AssessmentDefinition | undefined {
    return ASSESSMENT_DEFINITIONS[type]
}
