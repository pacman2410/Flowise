import { useParams, useNavigate } from 'react-router-dom'
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    Divider,
    Avatar
} from '@mui/material'
import { IconCheck, IconArrowRight, IconStar } from '@tabler/icons'

const OFFERS = {
    promotion: {
        assessmentType: 'promotion_readiness',
        accentColor: '#7b1fa2',
        gradientFrom: '#4a148c',
        gradientTo: '#7b1fa2',
        hero: {
            headline: 'Find Out Exactly Why You Haven\'t Been Promoted Yet',
            subheadline:
                'The Promotion Readiness Diagnostic gives you a data-driven score across 6 dimensions and tells you precisely what is blocking your next move.',
            cta: 'Take the Free Diagnostic'
        },
        whatYouGet: [
            {
                icon: '📊',
                title: 'Your Promotion Readiness Score',
                body: 'A 0–100 score across 6 critical dimensions so you know exactly where you stand — not just a vague feeling.'
            },
            {
                icon: '🔍',
                title: 'A Personalized Promotion Gap Analysis',
                body: 'Discover the specific gaps that are blocking your promotion and understand which ones matter most to fix first.'
            },
            {
                icon: '📋',
                title: 'A 30-Day Promotion Action Plan',
                body: 'Walk away with a concrete, prioritized action plan you can start executing this week to close your promotion gaps.'
            }
        ],
        dimensions: [
            { name: 'Results', description: 'Consistently exceed expectations and deliver at the next level' },
            { name: 'Visibility', description: 'Ensure senior leaders know your name and your contributions' },
            { name: 'Relationships', description: 'Build sponsors, mentors, and allies who will advocate for you' },
            { name: 'Leadership Signals', description: 'Demonstrate you are already leading before you have the title' },
            { name: 'Strategic Thinking', description: 'Think and act beyond your current scope' },
            { name: 'Influence', description: 'Move decisions and people without relying on formal authority' }
        ],
        testimonials: [
            {
                name: 'Sarah K.',
                role: 'Senior Product Manager',
                text: 'I had been passed over for promotion twice before taking this diagnostic. It showed me exactly what I was missing. Six months later, I got promoted.'
            },
            {
                name: 'Marcus T.',
                role: 'Engineering Manager',
                text: 'The gap analysis was brutally honest and spot-on. I scored low on Visibility and that was the missing piece. I spent 90 days working on it and it changed everything.'
            },
            {
                name: 'Jennifer R.',
                role: 'Director of Marketing',
                text: 'I thought I was ready for promotion. The diagnostic revealed I had a blind spot in Strategic Thinking. It saved me from a very awkward conversation with my VP.'
            }
        ]
    },
    'new-manager': {
        assessmentType: 'new_manager_readiness',
        accentColor: '#00695c',
        gradientFrom: '#004d40',
        gradientTo: '#00897b',
        hero: {
            headline: 'Are You Actually Ready to Become a Manager?',
            subheadline:
                'Most new managers struggle because they underestimate the mindset shift required. The New Manager Readiness Diagnostic reveals where you are ready and where you need to prepare.',
            cta: 'Take the Free Diagnostic'
        },
        whatYouGet: [
            {
                icon: '📊',
                title: 'Your New Manager Readiness Score',
                body: 'A clear 0–100 score across 6 dimensions of management readiness — so you know if you are prepared or setting yourself up to struggle.'
            },
            {
                icon: '🔍',
                title: 'A Personalized Strengths and Gaps Breakdown',
                body: 'Understand which management skills you already have and which ones need urgent development before you take on your first team.'
            },
            {
                icon: '✅',
                title: 'A Pre-Manager Prep Checklist',
                body: 'A concrete checklist of the mindset shifts, conversations, and capabilities you need to have in place before day one as a manager.'
            }
        ],
        dimensions: [
            { name: 'Role Transition', description: 'Understand and embrace the mindset shift from IC to people leader' },
            { name: 'Delegation', description: 'Let go of doing the work yourself and empower others to grow' },
            { name: 'Difficult Conversations', description: 'Have direct, timely conversations about performance and behavior' },
            { name: 'Team Management', description: 'Build a high-performing, motivated, and psychologically safe team' },
            { name: 'Communication', description: 'Lead with clarity and transparency across all levels' },
            { name: 'Prioritization', description: 'Manage competing demands across people, projects, and stakeholders' }
        ],
        testimonials: [
            {
                name: 'David L.',
                role: 'First-Time Engineering Manager',
                text: 'I thought being a great IC meant I was ready to manage. This diagnostic showed me how wrong I was about delegation. I spent 60 days working on it before accepting the role and it made a huge difference.'
            },
            {
                name: 'Priya M.',
                role: 'New Team Lead',
                text: 'The Difficult Conversations dimension was my lowest score. Knowing that before I started managing gave me time to prepare and get coaching. My first few months were so much smoother because of it.'
            },
            {
                name: 'Alex J.',
                role: 'Product Team Lead',
                text: 'I kept saying I wanted to be a manager but kept postponing. After taking this diagnostic and seeing I scored 78/100, I finally had the confidence to raise my hand. Now I manage a team of 6.'
            }
        ]
    }
}

const StarRating = ({ count = 5 }) => (
    <Box sx={{ display: 'flex', gap: 0.25 }}>
        {Array.from({ length: count }).map((_, i) => (
            <IconStar key={i} size={14} fill='#f59e0b' color='#f59e0b' />
        ))}
    </Box>
)

const LandingPage = () => {
    const { offerType } = useParams()
    const navigate = useNavigate()
    const offer = OFFERS[offerType]

    if (!offer) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant='h4' fontWeight={700} sx={{ mb: 2 }}>Offer Not Found</Typography>
                <Button variant='contained' onClick={() => navigate('/career-lab')}>
                    Go to Career Lab HQ
                </Button>
            </Box>
        )
    }

    const handleCTA = () => navigate(`/career-lab/assessment/${offer.assessmentType}`)

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 } }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${offer.gradientFrom} 0%, ${offer.gradientTo} 100%)`,
                    borderRadius: 4,
                    p: { xs: 4, md: 8 },
                    mb: 6,
                    color: '#fff',
                    textAlign: 'center'
                }}
            >
                <Chip
                    label='FREE DIAGNOSTIC'
                    size='small'
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, mb: 3, letterSpacing: 1 }}
                />
                <Typography
                    variant='h2'
                    fontWeight={900}
                    sx={{
                        color: '#fff',
                        mb: 3,
                        fontSize: { xs: '1.75rem', md: '2.75rem' },
                        lineHeight: 1.2,
                        maxWidth: 800,
                        mx: 'auto'
                    }}
                >
                    {offer.hero.headline}
                </Typography>
                <Typography
                    variant='h6'
                    sx={{
                        color: 'rgba(255,255,255,0.85)',
                        fontWeight: 400,
                        mb: 5,
                        maxWidth: 700,
                        mx: 'auto',
                        lineHeight: 1.6
                    }}
                >
                    {offer.hero.subheadline}
                </Typography>
                <Button
                    variant='contained'
                    size='large'
                    onClick={handleCTA}
                    endIcon={<IconArrowRight />}
                    sx={{
                        bgcolor: '#fff',
                        color: offer.accentColor,
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        px: 5,
                        py: 1.75,
                        borderRadius: 3,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    {offer.hero.cta}
                </Button>
                <Typography variant='caption' sx={{ display: 'block', mt: 2, color: 'rgba(255,255,255,0.6)' }}>
                    Takes about 5 minutes. No email required. Instant results.
                </Typography>
            </Box>

            {/* What You'll Get */}
            <Box sx={{ mb: 6 }}>
                <Typography variant='h4' fontWeight={800} textAlign='center' sx={{ mb: 1 }}>
                    What You Will Get
                </Typography>
                <Typography variant='body1' color='text.secondary' textAlign='center' sx={{ mb: 4 }}>
                    In about 5 minutes, you will walk away with actionable insights you can use immediately.
                </Typography>
                <Grid container spacing={3}>
                    {offer.whatYouGet.map((item, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    border: `2px solid ${offer.accentColor}22`,
                                    borderTop: `4px solid ${offer.accentColor}`,
                                    borderRadius: 3,
                                    p: 1
                                }}
                            >
                                <CardContent>
                                    <Typography fontSize={40} sx={{ mb: 2 }}>{item.icon}</Typography>
                                    <Typography variant='h6' fontWeight={700} sx={{ mb: 1.5 }}>{item.title}</Typography>
                                    <Typography variant='body2' color='text.secondary' lineHeight={1.7}>{item.body}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ my: 5 }} />

            {/* The 6 Dimensions */}
            <Box sx={{ mb: 6 }}>
                <Typography variant='h4' fontWeight={800} textAlign='center' sx={{ mb: 1 }}>
                    The 6 Dimensions Measured
                </Typography>
                <Typography variant='body1' color='text.secondary' textAlign='center' sx={{ mb: 4 }}>
                    You will be scored on each of these critical dimensions so you know exactly where you stand.
                </Typography>
                <Grid container spacing={2}>
                    {offer.dimensions.map((dim, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                        <Box
                                            sx={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                bgcolor: offer.accentColor, color: '#fff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
                                            }}
                                        >
                                            {i + 1}
                                        </Box>
                                        <Typography variant='subtitle1' fontWeight={700}>{dim.name}</Typography>
                                    </Box>
                                    <Typography variant='body2' color='text.secondary' sx={{ ml: 5.5 }}>
                                        {dim.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ my: 5 }} />

            {/* Testimonials */}
            <Box sx={{ mb: 6 }}>
                <Typography variant='h4' fontWeight={800} textAlign='center' sx={{ mb: 1 }}>
                    What Others Are Saying
                </Typography>
                <Typography variant='body1' color='text.secondary' textAlign='center' sx={{ mb: 4 }}>
                    Professionals who used this diagnostic to accelerate their careers
                </Typography>
                <Grid container spacing={3}>
                    {offer.testimonials.map((t, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <StarRating />
                                    <Typography
                                        variant='body1'
                                        sx={{ mt: 2, mb: 3, fontStyle: 'italic', lineHeight: 1.7, color: 'text.primary' }}
                                    >
                                        &ldquo;{t.text}&rdquo;
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{ bgcolor: offer.accentColor, width: 36, height: 36, fontSize: '0.875rem', fontWeight: 700 }}>
                                            {t.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant='subtitle2' fontWeight={700}>{t.name}</Typography>
                                            <Typography variant='caption' color='text.secondary'>{t.role}</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Final CTA */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${offer.gradientFrom} 0%, ${offer.gradientTo} 100%)`,
                    borderRadius: 4,
                    p: { xs: 4, md: 6 },
                    mb: 4,
                    textAlign: 'center',
                    color: '#fff'
                }}
            >
                <Typography variant='h4' fontWeight={800} sx={{ color: '#fff', mb: 2 }}>
                    Ready to Find Out Where You Actually Stand?
                </Typography>
                <Typography variant='h6' sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400, mb: 4, maxWidth: 600, mx: 'auto' }}>
                    It takes 5 minutes and gives you more clarity about your career than most people get in years of guessing.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='center' alignItems='center' sx={{ mb: 3 }}>
                    {['No email required', 'Instant results', 'Free forever', '5-minute assessment'].map((benefit) => (
                        <Box key={benefit} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <IconCheck size={16} color='#a5d6a7' />
                            <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.85)' }}>{benefit}</Typography>
                        </Box>
                    ))}
                </Stack>

                <Button
                    variant='contained'
                    size='large'
                    onClick={handleCTA}
                    endIcon={<IconArrowRight />}
                    sx={{
                        bgcolor: '#fff',
                        color: offer.accentColor,
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        px: 5,
                        py: 1.75,
                        borderRadius: 3,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    {offer.hero.cta}
                </Button>
            </Box>
        </Box>
    )
}

export default LandingPage
