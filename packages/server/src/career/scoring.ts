import { AssessmentDefinition, DimensionDefinition, getAssessment } from './assessments'

export interface ScoreResult {
    totalScore: number
    dimensionScores: Record<string, number>
    tier: string
    tierLabel: string
    recommendations: string[]
}

export function getTier(score: number): { tier: string; tierLabel: string } {
    if (score >= 91) return { tier: 'exceptional', tierLabel: 'Exceptional' }
    if (score >= 76) return { tier: 'strong', tierLabel: 'Strong' }
    if (score >= 61) return { tier: 'on_track', tierLabel: 'On Track' }
    if (score >= 41) return { tier: 'developing', tierLabel: 'Developing' }
    return { tier: 'needs_work', tierLabel: 'Needs Significant Work' }
}

// ----------------------------------------
// Recommendation generators per assessment
// ----------------------------------------

function generateCareerHealthRecommendations(
    dimensionScores: Record<string, number>,
    dimensions: DimensionDefinition[]
): string[] {
    const recs: string[] = []

    if ((dimensionScores['role_clarity'] ?? 0) < 60) {
        recs.push(
            'Dedicate time to create a written Career Blueprint. Clarify your 3-year vision and map back what skills and experiences you need now.'
        )
    } else if ((dimensionScores['role_clarity'] ?? 0) > 75) {
        recs.push(
            'Your role clarity is strong — use that clarity to mentor others who are still figuring out their direction.'
        )
    }

    if ((dimensionScores['performance_impact'] ?? 0) < 60) {
        recs.push(
            'Start tracking your wins weekly. Build a habit of quantifying your impact in numbers — time saved, revenue generated, problems solved.'
        )
    } else if ((dimensionScores['performance_impact'] ?? 0) > 75) {
        recs.push(
            'Your performance and impact scores are high — make sure your visibility matches by proactively sharing these results with leadership.'
        )
    }

    if ((dimensionScores['visibility'] ?? 0) < 60) {
        recs.push(
            'Identify 3 senior leaders you want to build relationships with this quarter. Create a plan to share your work more proactively.'
        )
    } else if ((dimensionScores['visibility'] ?? 0) > 75) {
        recs.push(
            'You have strong visibility — leverage it by positioning yourself as a thought leader and volunteering for cross-functional initiatives.'
        )
    }

    if ((dimensionScores['relationships'] ?? 0) < 60) {
        recs.push(
            'Invest in relationship-building intentionally. Schedule coffee chats with 2 cross-functional stakeholders per month.'
        )
    } else if ((dimensionScores['relationships'] ?? 0) > 75) {
        recs.push(
            'Your network is a real asset — activate it by introducing people who could benefit from knowing each other and deepening key sponsor relationships.'
        )
    }

    if ((dimensionScores['growth'] ?? 0) < 60) {
        recs.push(
            'Create a concrete learning plan. Identify 1-2 skills critical for your next role and dedicate at least 2 hours per week to developing them.'
        )
    } else if ((dimensionScores['growth'] ?? 0) > 75) {
        recs.push(
            'Your growth mindset is evident — consider sharing your learning strategies with peers or writing about what you are learning to amplify your brand.'
        )
    }

    return recs
}

function generatePromotionReadinessRecommendations(
    dimensionScores: Record<string, number>,
    dimensions: DimensionDefinition[]
): string[] {
    const recs: string[] = []

    if ((dimensionScores['results'] ?? 0) < 60) {
        recs.push(
            'Focus on delivering 1-2 high-visibility wins before your next review cycle. Document impact rigorously with metrics.'
        )
    } else if ((dimensionScores['results'] ?? 0) > 75) {
        recs.push(
            'Your results track record is compelling — make sure you have a sharp narrative ready to present during promotion discussions.'
        )
    }

    if ((dimensionScores['visibility'] ?? 0) < 60) {
        recs.push(
            'Find opportunities to present your work to senior audiences. Volunteer to represent your team in cross-functional meetings.'
        )
    } else if ((dimensionScores['visibility'] ?? 0) > 75) {
        recs.push(
            'You are well-known among leaders — capitalize on this by sharing strategic ideas, not just project updates.'
        )
    }

    if ((dimensionScores['relationships'] ?? 0) < 60) {
        recs.push(
            'Actively cultivate a sponsor relationship. Identify a senior leader who knows your work and ask for explicit advocacy.'
        )
    } else if ((dimensionScores['relationships'] ?? 0) > 75) {
        recs.push(
            'Your sponsor and peer relationships are strong — make sure your sponsors know exactly when and what to advocate for on your behalf.'
        )
    }

    if ((dimensionScores['leadership_signals'] ?? 0) < 60) {
        recs.push(
            'Start taking on work that is clearly at the next level. Mentor a junior team member or lead a cross-team initiative.'
        )
    } else if ((dimensionScores['leadership_signals'] ?? 0) > 75) {
        recs.push(
            'You are already operating at the next level — document specific examples to use as evidence in your promotion case.'
        )
    }

    if ((dimensionScores['strategic_thinking'] ?? 0) < 60) {
        recs.push(
            "Read your company's strategic documents and connect your work explicitly to company-level goals in all communications."
        )
    } else if ((dimensionScores['strategic_thinking'] ?? 0) > 75) {
        recs.push(
            'Your strategic thinking is an asset — bring proposals and business cases, not just updates, to leadership conversations.'
        )
    }

    if ((dimensionScores['influence'] ?? 0) < 60) {
        recs.push(
            'Practice leading without authority. Volunteer to align stakeholders on a cross-team challenge without a formal mandate.'
        )
    } else if ((dimensionScores['influence'] ?? 0) > 75) {
        recs.push(
            'Your influence is strong — use it to build coalition support for your promotion among peers and decision-makers.'
        )
    }

    return recs
}

function generateLeadershipReadinessRecommendations(
    dimensionScores: Record<string, number>,
    dimensions: DimensionDefinition[]
): string[] {
    const recs: string[] = []

    if ((dimensionScores['feedback'] ?? 0) < 60) {
        recs.push(
            'Practice giving feedback using the SBI model (Situation-Behavior-Impact) in your next 5 interactions. Don\'t wait for the perfect moment.'
        )
    } else if ((dimensionScores['feedback'] ?? 0) > 75) {
        recs.push(
            'Your feedback skills are strong — help others on your team develop this skill by modeling and coaching it explicitly.'
        )
    }

    if ((dimensionScores['coaching'] ?? 0) < 60) {
        recs.push(
            "In your next 5 1:1s, ask your team member 'What approach are you thinking?' before offering your perspective."
        )
    } else if ((dimensionScores['coaching'] ?? 0) > 75) {
        recs.push(
            'Your coaching ability is excellent — document your approach and consider formalizing mentorship programs for your team.'
        )
    }

    if ((dimensionScores['delegation'] ?? 0) < 60) {
        recs.push(
            'Identify 3 tasks you currently own that you could delegate this week. Define clear outcomes and let the person determine their method.'
        )
    } else if ((dimensionScores['delegation'] ?? 0) > 75) {
        recs.push(
            'Your delegation approach is developing strong team members — track who you have helped grow and make it visible to leadership.'
        )
    }

    if ((dimensionScores['accountability'] ?? 0) < 60) {
        recs.push(
            'Establish a weekly cadence of tracking commitments and following up. Make accountability a consistent part of your team culture.'
        )
    } else if ((dimensionScores['accountability'] ?? 0) > 75) {
        recs.push(
            'Your accountability culture is strong — codify your team norms so they persist even when you are not in the room.'
        )
    }

    if ((dimensionScores['communication'] ?? 0) < 60) {
        recs.push(
            'Before your next team meeting, write down the 3 most important things you want your team to walk away knowing. Practice clarity.'
        )
    } else if ((dimensionScores['communication'] ?? 0) > 75) {
        recs.push(
            'Your communication is clear and effective — consider formalizing it with a team newsletter or regular written updates to keep alignment high.'
        )
    }

    if ((dimensionScores['trust'] ?? 0) < 60) {
        recs.push(
            'Share a mistake or learning moment with your team this week. Psychological safety starts with leader vulnerability.'
        )
    } else if ((dimensionScores['trust'] ?? 0) > 75) {
        recs.push(
            'You have built strong trust with your team — use that foundation to have more ambitious conversations about growth and change.'
        )
    }

    return recs
}

function generateNewManagerReadinessRecommendations(
    dimensionScores: Record<string, number>,
    dimensions: DimensionDefinition[]
): string[] {
    const recs: string[] = []

    if ((dimensionScores['role_transition'] ?? 0) < 60) {
        recs.push(
            'Write down 5 things you believe make you valuable today. For each one, consider how it translates to enabling others — not doing it yourself.'
        )
    } else if ((dimensionScores['role_transition'] ?? 0) > 75) {
        recs.push(
            'Your mindset for the role transition is solid — now focus on building the specific skills that make the transition smoother in practice.'
        )
    }

    if ((dimensionScores['delegation'] ?? 0) < 60) {
        recs.push(
            "Practice the 'describe the destination, not the route' delegation method. Define what done looks like, not how to get there."
        )
    } else if ((dimensionScores['delegation'] ?? 0) > 75) {
        recs.push(
            'Your delegation readiness is strong — practice calibrating autonomy levels for different team members based on their experience and confidence.'
        )
    }

    if ((dimensionScores['difficult_conversations'] ?? 0) < 60) {
        recs.push(
            'Role-play difficult conversations with a coach or mentor before they happen. Preparation dramatically reduces avoidance.'
        )
    } else if ((dimensionScores['difficult_conversations'] ?? 0) > 75) {
        recs.push(
            'Your readiness for difficult conversations is a differentiator — most new managers avoid them. Lean into this strength from day one.'
        )
    }

    if ((dimensionScores['team_management'] ?? 0) < 60) {
        recs.push(
            'Design your 1:1 agenda template now. The best managers are consistent and intentional about 1:1 structure from day one.'
        )
    } else if ((dimensionScores['team_management'] ?? 0) > 75) {
        recs.push(
            'Your team management fundamentals are well prepared — focus next on building systems that scale as your team grows.'
        )
    }

    if ((dimensionScores['communication'] ?? 0) < 60) {
        recs.push(
            "Practice translating company strategy into team priorities. Write a clear 'our team exists to...' statement for your future team."
        )
    } else if ((dimensionScores['communication'] ?? 0) > 75) {
        recs.push(
            'Your communication approach is manager-ready — practice tailoring your style to different team members as a next growth area.'
        )
    }

    if ((dimensionScores['prioritization'] ?? 0) < 60) {
        recs.push(
            'Build a personal time budget. Decide in advance how much of your week goes to people management vs. individual work.'
        )
    } else if ((dimensionScores['prioritization'] ?? 0) > 75) {
        recs.push(
            'Your prioritization instincts are well-developed — continue building frameworks to help your future team prioritize independently.'
        )
    }

    return recs
}

function generateRecommendations(
    assessmentType: string,
    dimensionScores: Record<string, number>,
    def: AssessmentDefinition
): string[] {
    switch (assessmentType) {
        case 'career_health':
            return generateCareerHealthRecommendations(dimensionScores, def.dimensions)
        case 'promotion_readiness':
            return generatePromotionReadinessRecommendations(dimensionScores, def.dimensions)
        case 'leadership_readiness':
            return generateLeadershipReadinessRecommendations(dimensionScores, def.dimensions)
        case 'new_manager_readiness':
            return generateNewManagerReadinessRecommendations(dimensionScores, def.dimensions)
        default:
            return []
    }
}

export function scoreAssessment(assessmentType: string, answers: Record<string, number>): ScoreResult {
    const def = getAssessment(assessmentType)
    if (!def) throw new Error(`Unknown assessment type: ${assessmentType}`)

    // Group answers by dimension and compute raw dimension scores (0-100)
    const dimensionScores: Record<string, number> = {}

    for (const dim of def.dimensions) {
        const dimQuestions = def.questions.filter((q) => q.dimension === dim.name)
        if (dimQuestions.length === 0) continue

        let total = 0
        let count = 0
        for (const q of dimQuestions) {
            const answer = answers[q.id]
            if (answer !== undefined) {
                const val = q.reverseScored ? 6 - answer : answer
                total += val
                count++
            }
        }
        const avgRaw = count > 0 ? total / count : 0 // 1-5 scale
        dimensionScores[dim.name] = Math.round(((avgRaw - 1) / 4) * 100) // normalize to 0-100
    }

    // Weighted total score
    let totalScore = 0
    for (const dim of def.dimensions) {
        const dimScore = dimensionScores[dim.name] ?? 0
        totalScore += dimScore * dim.weight
    }
    totalScore = Math.round(totalScore)

    const { tier, tierLabel } = getTier(totalScore)
    const recommendations = generateRecommendations(assessmentType, dimensionScores, def)

    return { totalScore, dimensionScores, tier, tierLabel, recommendations }
}
