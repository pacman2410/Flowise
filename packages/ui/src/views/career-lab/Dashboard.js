import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Divider,
    Stack
} from '@mui/material'
import MainCard from 'ui-component/cards/MainCard'
import careerApi from 'api/career'
import { getCareerUserId, ASSESSMENT_META, getTierColor, getTierLabel, formatScore } from 'utils/careerUtils'

const QuickActionButton = ({ label, path, color }) => {
    const navigate = useNavigate()
    return (
        <Chip
            label={label}
            onClick={() => navigate(path)}
            clickable
            sx={{
                px: 1,
                py: 2.5,
                fontSize: '0.875rem',
                fontWeight: 600,
                bgcolor: color || 'primary.main',
                color: '#fff',
                '&:hover': { opacity: 0.85 },
                borderRadius: 2
            }}
        />
    )
}

const AssessmentCard = ({ type, meta, score, navigate }) => {
    return (
        <Card
            sx={{
                height: '100%',
                border: `2px solid ${meta.color}22`,
                borderTop: `4px solid ${meta.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Typography fontSize={32}>{meta.icon}</Typography>
                    <Box>
                        <Typography variant='h5' fontWeight={700} color='text.primary'>
                            {meta.title}
                        </Typography>
                        {score && (
                            <Chip
                                label={getTierLabel(score.tier)}
                                size='small'
                                sx={{ bgcolor: getTierColor(score.tier), color: '#fff', fontWeight: 600, mt: 0.5 }}
                            />
                        )}
                    </Box>
                </Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2, minHeight: 48 }}>
                    {meta.description}
                </Typography>
                {score ? (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Typography variant='h3' fontWeight={800} sx={{ color: meta.color }}>
                                {Math.round(score.total_score)}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>/ 100</Typography>
                        </Box>
                        <Typography variant='caption' color='text.secondary'>
                            Last taken: {new Date(score.created_at || score.updatedAt || Date.now()).toLocaleDateString()}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' color='text.secondary' fontStyle='italic'>
                            Not yet taken
                        </Typography>
                    </Box>
                )}
                <Button
                    variant='contained'
                    fullWidth
                    onClick={() => navigate(`/career-lab/assessment/${type}`)}
                    sx={{ bgcolor: meta.color, '&:hover': { bgcolor: meta.color, opacity: 0.9 } }}
                >
                    {score ? 'Retake Assessment' : 'Take Assessment'}
                </Button>
            </CardContent>
        </Card>
    )
}

const Dashboard = () => {
    const navigate = useNavigate()
    const [scores, setScores] = useState(null)
    const [checkIns, setCheckIns] = useState([])
    const [evidence, setEvidence] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const userId = getCareerUserId()

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const [scoresRes, checkInsRes, evidenceRes] = await Promise.allSettled([
                    careerApi.getUserScores(userId),
                    careerApi.getCheckIns(userId),
                    careerApi.getEvidence(userId)
                ])
                if (scoresRes.status === 'fulfilled') setScores(scoresRes.value.data)
                if (checkInsRes.status === 'fulfilled') setCheckIns(checkInsRes.value.data || [])
                if (evidenceRes.status === 'fulfilled') setEvidence(evidenceRes.value.data || [])
            } catch (err) {
                setError('Could not load your career data. The backend may not be configured yet.')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [userId])

    const healthScore = scores && (scores.career_health || scores.find?.((s) => s.assessment_type === 'career_health'))
    const scoresMap = {}
    if (Array.isArray(scores)) {
        scores.forEach((s) => { scoresMap[s.assessment_type] = s })
    } else if (scores && typeof scores === 'object') {
        Object.assign(scoresMap, scores)
    }

    const recentActivity = [
        ...checkIns.slice(0, 2).map((c) => ({
            type: 'check-in',
            label: `Weekly Check-In — Confidence ${c.confidence_score}/10`,
            date: c.week_start || c.createdAt,
            path: '/career-lab/checkin'
        })),
        ...evidence.slice(0, 1).map((e) => ({
            type: 'evidence',
            label: e.title,
            date: e.evidence_date || e.createdAt,
            path: '/career-lab/evidence'
        }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)

    return (
        <MainCard>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 50%, #42a5f5 100%)',
                    borderRadius: 3,
                    p: { xs: 3, md: 5 },
                    mb: 4,
                    color: '#fff',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 3
                }}
            >
                <Box>
                    <Typography variant='h2' fontWeight={800} sx={{ color: '#fff', mb: 1, fontSize: { xs: '2rem', md: '2.75rem' } }}>
                        Career Lab HQ
                    </Typography>
                    <Typography variant='h5' sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>
                        Your Personal Career Operating System
                    </Typography>
                    {!loading && !healthScore && (
                        <Button
                            variant='contained'
                            size='large'
                            onClick={() => navigate('/career-lab/assessment/career_health')}
                            sx={{
                                mt: 3,
                                bgcolor: '#fff',
                                color: '#1976d2',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#e3f2fd' }
                            }}
                        >
                            Get Started — Take Your First Assessment
                        </Button>
                    )}
                </Box>
                {loading ? (
                    <CircularProgress sx={{ color: '#fff' }} />
                ) : healthScore ? (
                    <Card sx={{ minWidth: 200, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 3 }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.8)', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Career Health
                            </Typography>
                            <Typography variant='h1' fontWeight={900} sx={{ color: '#fff', fontSize: '3.5rem', lineHeight: 1 }}>
                                {Math.round(healthScore.total_score || healthScore.score || 0)}
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.7)' }}>/ 100</Typography>
                            <Chip
                                label={getTierLabel(healthScore.tier)}
                                size='small'
                                sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700 }}
                            />
                        </CardContent>
                    </Card>
                ) : null}
            </Box>

            {error && (
                <Alert severity='info' sx={{ mb: 3 }}>
                    {error} Your data will appear here once the Career Lab API is connected.
                </Alert>
            )}

            {/* Assessment Cards Grid */}
            <Typography variant='h4' fontWeight={700} sx={{ mb: 2 }}>
                Assessments
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {Object.entries(ASSESSMENT_META).map(([type, meta]) => (
                    <Grid item xs={12} sm={6} key={type}>
                        <AssessmentCard
                            type={type}
                            meta={meta}
                            score={scoresMap[type]}
                            navigate={navigate}
                        />
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Quick Actions */}
            <Typography variant='h4' fontWeight={700} sx={{ mb: 2 }}>
                Quick Actions
            </Typography>
            <Stack direction='row' spacing={1.5} flexWrap='wrap' gap={1.5} sx={{ mb: 4 }}>
                <QuickActionButton label='📋 My Blueprint' path='/career-lab/blueprint' color='#5c35cc' />
                <QuickActionButton label='✅ Weekly Check-In' path='/career-lab/checkin' color='#00897b' />
                <QuickActionButton label='⭐ Evidence Vault' path='/career-lab/evidence' color='#e65100' />
                <QuickActionButton label='💬 Conversation Prep' path='/career-lab/conversation-prep' color='#c62828' />
                <QuickActionButton label='📊 Score Report' path='/career-lab/scores' color='#1565c0' />
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Recent Activity */}
            <Typography variant='h4' fontWeight={700} sx={{ mb: 2 }}>
                Recent Activity
            </Typography>
            {recentActivity.length === 0 ? (
                <Card variant='outlined' sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <Typography color='text.secondary'>
                        No activity yet. Take an assessment or complete a weekly check-in to get started!
                    </Typography>
                </Card>
            ) : (
                <Stack spacing={1.5}>
                    {recentActivity.map((item, idx) => (
                        <Card
                            key={idx}
                            variant='outlined'
                            sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}
                            onClick={() => navigate(item.path)}
                        >
                            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Chip
                                        label={item.type === 'check-in' ? 'Check-In' : 'Evidence'}
                                        size='small'
                                        color={item.type === 'check-in' ? 'success' : 'warning'}
                                    />
                                    <Typography variant='body2' fontWeight={500}>{item.label}</Typography>
                                </Box>
                                <Typography variant='caption' color='text.secondary'>
                                    {item.date ? new Date(item.date).toLocaleDateString() : ''}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </MainCard>
    )
}

export default Dashboard
