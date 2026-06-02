// Get or create a userId stored in localStorage
export function getCareerUserId() {
    let userId = localStorage.getItem('career_user_id')
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
        localStorage.setItem('career_user_id', userId)
    }
    return userId
}

// Map tier to color and label
export function getTierColor(tier) {
    const map = {
        exceptional: '#2e7d32',
        strong: '#388e3c',
        on_track: '#1976d2',
        developing: '#f57c00',
        needs_work: '#d32f2f'
    }
    return map[tier] || '#757575'
}

export function getTierLabel(tier) {
    const map = {
        exceptional: 'Exceptional',
        strong: 'Strong',
        on_track: 'On Track',
        developing: 'Developing',
        needs_work: 'Needs Significant Work'
    }
    return map[tier] || tier
}

// Format score as percentage string
export function formatScore(score) {
    return `${Math.round(score)}/100`
}

// Assessment type metadata
export const ASSESSMENT_META = {
    career_health: {
        title: 'Career Health',
        icon: '🏥',
        color: '#1976d2',
        description: 'Measure the overall health of your career trajectory'
    },
    promotion_readiness: {
        title: 'Promotion Readiness',
        icon: '🚀',
        color: '#7b1fa2',
        description: 'Find out if you are ready to make your move to the next level'
    },
    leadership_readiness: {
        title: 'Leadership Readiness',
        icon: '🎯',
        color: '#c62828',
        description: 'Assess your readiness to lead teams and develop others'
    },
    new_manager_readiness: {
        title: 'New Manager Readiness',
        icon: '👥',
        color: '#00695c',
        description: 'Are you prepared for the transition from IC to people manager?'
    }
}
