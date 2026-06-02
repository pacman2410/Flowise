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
    LinearProgress,
    CircularProgress,
    Alert,
    Collapse,
    Stack,
    Divider,
    IconButton
} from '@mui/material'
import { IconChevronDown, IconChevronUp, IconArrowRight } from '@tabler/icons'
import MainCard from 'ui-component/cards/MainCard'
import careerApi from 'api/career'
import { getCareerUserId, ASSESSMENT_META, getTierColor, getTierLabel, formatScore } from 'utils/careerUtils'

const MOCK_SCORES = [
    {
        assessment_type: 'career_health',
        total_score: 72,
        tier: 'on_track',
        created_at: new Date().toISOString(),
        dimension_scores: [
            { dimension: 'Direction', score: 80 },
            { dimension: 'Growth', score: 68 },
            { dimension: 'Visibility', score: 62 },
            { dimension: 'Relationships', score: 74 },
            { dimension: 'Impact', score: 76 }
        ],
        recommendations: [
            'Increase your visibility with senior stakeholders by sharing monthly progress updates.',
            'Invest in one new skill each quarter to keep your growth trajectory strong.',
            'Build two new relationships with cross-functional leaders this quarter.'
        ]
    }
]

const ScoreCard = ({ score, meta, type }) => {
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false)
    const dims = score.dimension_scores || []
    const recs = score.recommendations || []

    return (
        <Card
            sx={{
                border: `2px solid ${meta.color}22`,
                borderTop: `4px solid ${meta.color}`,
                borderRadius: 2
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography fontSize={28}>{meta.icon}</Typography>
                        <Box>
                            <Typography variant='h6' fontWeight={700}>{meta.title}</Typography>
                            <Typography variant='caption' color='text.secondary'>
                                {score.created_at ? new Date(score.created_at).toLocaleDateString() : 'Date unknown'}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant='h3' fontWeight={900} sx={{ color: meta.color, lineHeight: 1 }}>
                            {Math.round(score.total_score)}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>/ 100</Typography>
                    </Box>
                </Box>

                <Chip
                    label={getTierLabel(score.tier)}
                    size='small'
                    sx={{ bgcolor: getTierColor(score.tier), color: '#fff', fontWeight: 700, mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={() => setExpanded(!expanded)}
                        endIcon={expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                        sx={{ flex: 1 }}
                    >
                        {expanded ? 'Hide Details' : 'View Details'}
                    </Button>
                    <Button
                        size='small'
                        variant='contained'
                        onClick={() => navigate(`/career-lab/assessment/${type}`)}
                        sx={{ bgcolor: meta.color, '&:hover': { bgcolor: meta.color, opacity: 0.9 } }}
                    >
                        Retake
                    </Button>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ mt: 3 }}>
                        {dims.length > 0 && (
                            <>
                                <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1.5 }}>Dimension Scores</Typography>
                                <Stack spacing={1.5} sx={{ mb: 3 }}>
                                    {dims.map((d) => (
                                        <Box key={d.dimension}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant='body2' fontWeight={500}>{d.dimension}</Typography>
                                                <Typography variant='body2' fontWeight={700}>
                                                    {Math.round(d.score)}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant='determinate'
                                                value={d.score}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'grey.200',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: d.score >= 70 ? '#2e7d32' : d.score >= 50 ? '#f57c00' : '#d32f2f'
                                                    }
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            </>
                        )}

                        {recs.length > 0 && (
                            <>
                                <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>Recommendations</Typography>
                                <Stack spacing={1}>
                                    {recs.map((rec, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                            <Box
                                                sx={{
                                                    width: 20, height: 20, borderRadius: '50%',
                                                    bgcolor: meta.color, color: '#fff',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, mt: 0.25
                                                }}
                                            >
                                                {i + 1}
                                            </Box>
                                            <Typography variant='body2' color='text.secondary'>{rec}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    )
}

const EmptyAssessmentCard = ({ type, meta }) => {
    const navigate = useNavigate()
    return (
        <Card
            sx={{
                border: `2px dashed ${meta.color}44`,
                borderRadius: 2,
                bgcolor: meta.color + '06'
            }}
        >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography fontSize={28} sx={{ mb: 1 }}>{meta.icon}</Typography>
                <Typography variant='h6' fontWeight={700} sx={{ mb: 0.5 }}>{meta.title}</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>Not yet taken</Typography>
                <Button
                    variant='contained'
                    size='small'
                    onClick={() => navigate(`/career-lab/assessment/${type}`)}
                    sx={{ bgcolor: meta.color, '&:hover': { bgcolor: meta.color, opacity: 0.9 } }}
                    endIcon={<IconArrowRight size={14} />}
                >
                    Take Now
                </Button>
            </CardContent>
        </Card>
    )
}

const ScoreReport = () => {
    const navigate = useNavigate()
    const userId = getCareerUserId()
    const [scores, setScores] = useState([])
    const [loading, setLoading] = useState(true)
    const [usedMock, setUsedMock] = useState(false)

    useEffect(() => {
        const fetchScores = async () => {
            setLoading(true)
            try {
                const res = await careerApi.getUserScores(userId)
                const data = res.data
                if (Array.isArray(data) && data.length > 0) {
                    setScores(data)
                } else if (data && typeof data === 'object' && !Array.isArray(data)) {
                    // API returned object keyed by type
                    const mapped = Object.entries(data).map(([type, s]) => ({ assessment_type: type, ...s }))
                    setScores(mapped)
                } else {
                    setScores(MOCK_SCORES)
                    setUsedMock(true)
                }
            } catch {
                setScores(MOCK_SCORES)
                setUsedMock(true)
            } finally {
                setLoading(false)
            }
        }
        fetchScores()
    }, [userId])

    const scoresMap = {}
    scores.forEach((s) => { scoresMap[s.assessment_type] = s })

    // Collect top recommendations across all assessments
    const allRecs = scores.flatMap((s) => (s.recommendations || []).slice(0, 2))
    const topRecs = allRecs.slice(0, 5)

    // Average score across taken assessments
    const avgScore = scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + (s.total_score || 0), 0) / scores.length)
        : null

    if (loading) {
        return (
            <MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        )
    }

    return (
        <MainCard>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant='h3' fontWeight={800} sx={{ mb: 0.5 }}>My Score Report</Typography>
                <Typography variant='body1' color='text.secondary'>
                    Your comprehensive career assessment results
                </Typography>
            </Box>

            {usedMock && (
                <Alert severity='info' sx={{ mb: 3 }}>
                    Showing sample data — connect the Career Lab API to see your real results.
                </Alert>
            )}

            {/* Summary banner */}
            {avgScore !== null && (
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
                        borderRadius: 3,
                        p: 3,
                        mb: 4,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                    }}
                >
                    <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                        <Typography variant='h2' fontWeight={900} sx={{ color: '#fff', lineHeight: 1 }}>{avgScore}</Typography>
                        <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.7)' }}>Overall Avg</Typography>
                    </Box>
                    <Divider orientation='vertical' flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
                    <Box>
                        <Typography variant='h6' fontWeight={700} sx={{ color: '#fff' }}>
                            {scores.length} of {Object.keys(ASSESSMENT_META).length} assessments completed
                        </Typography>
                        <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Complete all four assessments for a full career health picture
                        </Typography>
                        {scores.length < Object.keys(ASSESSMENT_META).length && (
                            <Button
                                size='small'
                                variant='contained'
                                sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                                onClick={() => navigate('/career-lab')}
                            >
                                Take More Assessments
                            </Button>
                        )}
                    </Box>
                </Box>
            )}

            {/* Assessment Score Cards */}
            <Typography variant='h5' fontWeight={700} sx={{ mb: 2 }}>Assessment Results</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {Object.entries(ASSESSMENT_META).map(([type, meta]) => (
                    <Grid item xs={12} sm={6} key={type}>
                        {scoresMap[type] ? (
                            <ScoreCard score={scoresMap[type]} meta={meta} type={type} />
                        ) : (
                            <EmptyAssessmentCard type={type} meta={meta} />
                        )}
                    </Grid>
                ))}
            </Grid>

            {/* Top Recommendations */}
            {topRecs.length > 0 && (
                <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant='h5' fontWeight={700} sx={{ mb: 2 }}>Top Recommendations Across All Assessments</Typography>
                    <Stack spacing={1.5}>
                        {topRecs.map((rec, i) => (
                            <Card key={i} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 28, height: 28, borderRadius: '50%',
                                            bgcolor: '#1976d2', color: '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '0.875rem', flexShrink: 0
                                        }}
                                    >
                                        {i + 1}
                                    </Box>
                                    <Typography variant='body2' sx={{ pt: 0.25 }}>{rec}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </>
            )}

            {/* Footer actions */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant='outlined' onClick={() => navigate('/career-lab/blueprint')}>
                    Build My Career Blueprint
                </Button>
                <Button variant='outlined' onClick={() => navigate('/career-lab/conversation-prep')}>
                    Prepare for Promotion Conversation
                </Button>
                <Button variant='outlined' onClick={() => navigate('/career-lab/evidence')}>
                    Add Evidence
                </Button>
            </Box>
        </MainCard>
    )
}

export default ScoreReport
