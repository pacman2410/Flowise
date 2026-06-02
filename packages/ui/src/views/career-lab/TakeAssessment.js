import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    LinearProgress,
    CircularProgress,
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Stack,
    Divider,
    Paper
} from '@mui/material'
import MainCard from 'ui-component/cards/MainCard'
import careerApi from 'api/career'
import { getCareerUserId, ASSESSMENT_META, getTierColor, getTierLabel, formatScore } from 'utils/careerUtils'

const RATING_LABELS = {
    1: 'Strongly Disagree',
    2: 'Disagree',
    3: 'Neutral',
    4: 'Agree',
    5: 'Strongly Agree'
}

// Fallback questions if API is not available
const FALLBACK_QUESTIONS = {
    career_health: [
        { id: 'ch1', dimension: 'Direction', text: 'I have a clear picture of where I want my career to be in 3 years.' },
        { id: 'ch2', dimension: 'Direction', text: 'I am actively working toward my long-term career goals.' },
        { id: 'ch3', dimension: 'Direction', text: 'My current role aligns with my long-term career aspirations.' },
        { id: 'ch4', dimension: 'Growth', text: 'I am regularly learning new skills that are valuable in my field.' },
        { id: 'ch5', dimension: 'Growth', text: 'I have received meaningful feedback on my performance in the last 30 days.' },
        { id: 'ch6', dimension: 'Growth', text: 'I feel challenged and stretched in my current role.' },
        { id: 'ch7', dimension: 'Visibility', text: 'Key stakeholders in my organization know about my contributions.' },
        { id: 'ch8', dimension: 'Visibility', text: 'I proactively share my work and accomplishments with leadership.' },
        { id: 'ch9', dimension: 'Relationships', text: 'I have strong relationships with mentors or sponsors who advocate for me.' },
        { id: 'ch10', dimension: 'Relationships', text: 'I have a strong professional network inside and outside my organization.' },
        { id: 'ch11', dimension: 'Impact', text: 'My work has measurable, visible impact on business outcomes.' },
        { id: 'ch12', dimension: 'Impact', text: 'I regularly quantify and communicate the value I deliver.' }
    ],
    promotion_readiness: [
        { id: 'pr1', dimension: 'Results', text: 'I consistently exceed expectations in my core responsibilities.' },
        { id: 'pr2', dimension: 'Results', text: 'I have delivered at least one project at the next level above my current role.' },
        { id: 'pr3', dimension: 'Visibility', text: 'Senior leaders outside my direct team know and value my work.' },
        { id: 'pr4', dimension: 'Visibility', text: 'I am seen as a go-to expert in at least one critical area.' },
        { id: 'pr5', dimension: 'Relationships', text: 'I have an executive sponsor who will advocate for my promotion.' },
        { id: 'pr6', dimension: 'Relationships', text: 'My manager actively supports and champions my promotion.' },
        { id: 'pr7', dimension: 'Leadership Signals', text: 'I regularly mentor or develop others on my team.' },
        { id: 'pr8', dimension: 'Leadership Signals', text: 'I take initiative to solve problems without being asked.' },
        { id: 'pr9', dimension: 'Strategic Thinking', text: 'I think and act with a scope beyond my current job description.' },
        { id: 'pr10', dimension: 'Strategic Thinking', text: 'I understand and contribute to the broader business strategy.' },
        { id: 'pr11', dimension: 'Influence', text: 'I regularly influence decisions made by people senior to me.' },
        { id: 'pr12', dimension: 'Influence', text: 'I can bring people together and build consensus across teams.' }
    ],
    leadership_readiness: [
        { id: 'lr1', dimension: 'Vision', text: 'I can clearly articulate a compelling vision that motivates others.' },
        { id: 'lr2', dimension: 'Vision', text: 'I connect day-to-day work to the larger organizational strategy.' },
        { id: 'lr3', dimension: 'People Development', text: 'I actively invest time in developing others on my team.' },
        { id: 'lr4', dimension: 'People Development', text: 'I provide honest, constructive feedback regularly.' },
        { id: 'lr5', dimension: 'Execution', text: 'I consistently deliver results through and with others.' },
        { id: 'lr6', dimension: 'Execution', text: 'I hold myself and others accountable to commitments.' },
        { id: 'lr7', dimension: 'Communication', text: 'I communicate clearly and adapt my style to my audience.' },
        { id: 'lr8', dimension: 'Communication', text: 'I seek out and genuinely listen to diverse perspectives.' },
        { id: 'lr9', dimension: 'Decision Making', text: 'I make timely decisions even with incomplete information.' },
        { id: 'lr10', dimension: 'Decision Making', text: 'I take calculated risks and own the outcomes.' },
        { id: 'lr11', dimension: 'Influence', text: 'I build trust with stakeholders at all levels.' },
        { id: 'lr12', dimension: 'Influence', text: 'I navigate organizational dynamics effectively.' }
    ],
    new_manager_readiness: [
        { id: 'nm1', dimension: 'Role Transition', text: 'I understand the fundamental mindset shift from individual contributor to manager.' },
        { id: 'nm2', dimension: 'Role Transition', text: 'I am prepared to prioritize team success over personal contribution.' },
        { id: 'nm3', dimension: 'Delegation', text: 'I can identify what tasks to delegate and to whom.' },
        { id: 'nm4', dimension: 'Delegation', text: 'I am comfortable letting go of doing the work myself.' },
        { id: 'nm5', dimension: 'Difficult Conversations', text: 'I can have direct, uncomfortable conversations with colleagues.' },
        { id: 'nm6', dimension: 'Difficult Conversations', text: 'I address performance issues promptly and constructively.' },
        { id: 'nm7', dimension: 'Team Management', text: 'I know how to motivate individuals with different working styles.' },
        { id: 'nm8', dimension: 'Team Management', text: 'I can build psychological safety within a team.' },
        { id: 'nm9', dimension: 'Communication', text: 'I communicate with clarity in both one-on-ones and group settings.' },
        { id: 'nm10', dimension: 'Communication', text: 'I give credit generously and share context freely with my team.' },
        { id: 'nm11', dimension: 'Prioritization', text: 'I can prioritize competing demands across people, projects, and stakeholders.' },
        { id: 'nm12', dimension: 'Prioritization', text: 'I protect my team from unnecessary distractions and context switches.' }
    ]
}

const ScoreCircle = ({ score, color }) => (
    <Box sx={{ position: 'relative', display: 'inline-flex', width: 160, height: 160 }}>
        <CircularProgress
            variant='determinate'
            value={score}
            size={160}
            thickness={6}
            sx={{ color: color || '#1976d2' }}
        />
        <Box
            sx={{
                top: 0, left: 0, bottom: 0, right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <Typography variant='h2' fontWeight={800} color='text.primary'>{Math.round(score)}</Typography>
            <Typography variant='caption' color='text.secondary'>/ 100</Typography>
        </Box>
    </Box>
)

const TakeAssessment = () => {
    const { type } = useParams()
    const navigate = useNavigate()
    const userId = getCareerUserId()
    const meta = ASSESSMENT_META[type] || { title: 'Assessment', icon: '📋', color: '#1976d2', description: '' }

    const [phase, setPhase] = useState('intro') // intro | questions | submitting | results
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [results, setResults] = useState(null)
    const [loadingQuestions, setLoadingQuestions] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoadingQuestions(true)
            try {
                const res = await careerApi.getAssessment(type)
                const data = res.data
                if (data && data.questions && data.questions.length > 0) {
                    setQuestions(data.questions)
                } else {
                    setQuestions(FALLBACK_QUESTIONS[type] || FALLBACK_QUESTIONS.career_health)
                }
            } catch {
                setQuestions(FALLBACK_QUESTIONS[type] || FALLBACK_QUESTIONS.career_health)
            } finally {
                setLoadingQuestions(false)
            }
        }
        fetchQuestions()
    }, [type])

    const handleStart = () => {
        setCurrentIndex(0)
        setAnswers({})
        setPhase('questions')
    }

    const handleAnswer = (questionId, value) => {
        const newAnswers = { ...answers, [questionId]: parseInt(value) }
        setAnswers(newAnswers)

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1)
            }
        }, 300)
    }

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1)
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1)
    }

    const handleSubmit = async () => {
        setPhase('submitting')
        setError(null)
        try {
            const answerArray = questions.map((q) => ({
                question_id: q.id,
                dimension: q.dimension,
                value: answers[q.id] || 3
            }))
            const res = await careerApi.submitAssessment(type, { userId, answers: answerArray })
            setResults(res.data)
            setPhase('results')
        } catch (err) {
            // Build local results if API is not connected
            const dims = {}
            questions.forEach((q) => {
                if (!dims[q.dimension]) dims[q.dimension] = { total: 0, count: 0 }
                dims[q.dimension].total += answers[q.id] || 3
                dims[q.dimension].count += 1
            })
            const dimensionScores = Object.entries(dims).map(([name, { total, count }]) => ({
                dimension: name,
                score: Math.round((total / (count * 5)) * 100)
            }))
            const avgScore = dimensionScores.reduce((s, d) => s + d.score, 0) / dimensionScores.length
            const totalScore = Math.round(avgScore)
            let tier = 'needs_work'
            if (totalScore >= 85) tier = 'exceptional'
            else if (totalScore >= 70) tier = 'strong'
            else if (totalScore >= 55) tier = 'on_track'
            else if (totalScore >= 40) tier = 'developing'

            setResults({
                total_score: totalScore,
                tier,
                dimension_scores: dimensionScores,
                recommendations: [
                    'Schedule a focused conversation with your manager about your career direction.',
                    'Identify two high-visibility projects to pursue in the next quarter.',
                    'Build a relationship with one senior leader who can advocate for you.',
                    'Document your key accomplishments with measurable business impact.',
                    'Create a 90-day development plan focusing on your top gap areas.'
                ]
            })
            setPhase('results')
        }
    }

    const handleRetake = () => {
        setAnswers({})
        setCurrentIndex(0)
        setResults(null)
        setPhase('intro')
    }

    if (loadingQuestions) {
        return (
            <MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        )
    }

    if (phase === 'intro') {
        return (
            <MainCard>
                <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 4 }}>
                    <Typography fontSize={56} sx={{ mb: 2 }}>{meta.icon}</Typography>
                    <Typography variant='h3' fontWeight={800} sx={{ mb: 1 }}>{meta.title}</Typography>
                    <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>{meta.description}</Typography>

                    <Stack direction='row' justifyContent='center' spacing={3} sx={{ mb: 4 }}>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 120 }}>
                            <Typography variant='h4' fontWeight={700} color='primary'>{questions.length}</Typography>
                            <Typography variant='caption' color='text.secondary'>Questions</Typography>
                        </Paper>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 120 }}>
                            <Typography variant='h4' fontWeight={700} color='primary'>~5 min</Typography>
                            <Typography variant='caption' color='text.secondary'>Est. Time</Typography>
                        </Paper>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 120 }}>
                            <Typography variant='h4' fontWeight={700} color='primary'>Free</Typography>
                            <Typography variant='caption' color='text.secondary'>No cost</Typography>
                        </Paper>
                    </Stack>

                    <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 3, mb: 4, textAlign: 'left' }}>
                        <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>What to expect:</Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                            • Rate each statement on a scale from 1 (Strongly Disagree) to 5 (Strongly Agree)
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                            • Answer honestly — there are no right or wrong answers
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            • You will receive a personalized score and action plan instantly
                        </Typography>
                    </Box>

                    <Button
                        variant='contained'
                        size='large'
                        onClick={handleStart}
                        sx={{
                            bgcolor: meta.color,
                            '&:hover': { bgcolor: meta.color, opacity: 0.9 },
                            px: 5,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 700
                        }}
                    >
                        Start Assessment
                    </Button>
                </Box>
            </MainCard>
        )
    }

    if (phase === 'questions') {
        const question = questions[currentIndex]
        const progress = ((currentIndex) / questions.length) * 100
        const answeredCurrent = answers[question?.id] !== undefined

        return (
            <MainCard>
                <Box sx={{ maxWidth: 700, mx: 'auto' }}>
                    {/* Progress */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant='body2' color='text.secondary' fontWeight={600}>
                                Question {currentIndex + 1} of {questions.length}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {Math.round(progress)}% complete
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant='determinate'
                            value={progress}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: meta.color } }}
                        />
                    </Box>

                    {/* Dimension chip */}
                    {question?.dimension && (
                        <Chip
                            label={question.dimension}
                            size='small'
                            sx={{ mb: 2, bgcolor: meta.color + '22', color: meta.color, fontWeight: 600 }}
                        />
                    )}

                    {/* Question */}
                    <Card elevation={0} sx={{ border: '2px solid', borderColor: 'divider', borderRadius: 3, mb: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant='h5' fontWeight={600} sx={{ mb: 4, lineHeight: 1.5 }}>
                                {question?.text}
                            </Typography>

                            <FormControl component='fieldset' fullWidth>
                                <RadioGroup
                                    value={answers[question?.id] !== undefined ? String(answers[question.id]) : ''}
                                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                                >
                                    <Stack spacing={1.5}>
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <Paper
                                                key={val}
                                                elevation={0}
                                                onClick={() => handleAnswer(question.id, val)}
                                                sx={{
                                                    border: '2px solid',
                                                    borderColor: answers[question?.id] === val ? meta.color : 'divider',
                                                    borderRadius: 2,
                                                    p: 1.5,
                                                    cursor: 'pointer',
                                                    bgcolor: answers[question?.id] === val ? meta.color + '11' : 'background.paper',
                                                    transition: 'all 0.15s',
                                                    '&:hover': {
                                                        borderColor: meta.color,
                                                        bgcolor: meta.color + '08'
                                                    }
                                                }}
                                            >
                                                <FormControlLabel
                                                    value={String(val)}
                                                    control={<Radio sx={{ '&.Mui-checked': { color: meta.color } }} />}
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={val}
                                                                size='small'
                                                                sx={{
                                                                    bgcolor: answers[question?.id] === val ? meta.color : 'grey.200',
                                                                    color: answers[question?.id] === val ? '#fff' : 'text.secondary',
                                                                    fontWeight: 700,
                                                                    minWidth: 32
                                                                }}
                                                            />
                                                            <Typography variant='body2' fontWeight={500}>{RATING_LABELS[val]}</Typography>
                                                        </Box>
                                                    }
                                                    sx={{ m: 0, width: '100%' }}
                                                />
                                            </Paper>
                                        ))}
                                    </Stack>
                                </RadioGroup>
                            </FormControl>
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            variant='outlined'
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </Button>

                        {currentIndex === questions.length - 1 ? (
                            <Button
                                variant='contained'
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length < questions.length}
                                sx={{ bgcolor: meta.color, '&:hover': { bgcolor: meta.color, opacity: 0.9 } }}
                            >
                                Submit Assessment ({Object.keys(answers).length}/{questions.length} answered)
                            </Button>
                        ) : (
                            <Button
                                variant='contained'
                                onClick={handleNext}
                                disabled={!answeredCurrent}
                                sx={{ bgcolor: meta.color, '&:hover': { bgcolor: meta.color, opacity: 0.9 } }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </MainCard>
        )
    }

    if (phase === 'submitting') {
        return (
            <MainCard>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <CircularProgress size={56} sx={{ color: meta.color, mb: 3 }} />
                    <Typography variant='h5' fontWeight={600}>Analyzing your responses...</Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                        Calculating your score and generating personalized recommendations
                    </Typography>
                </Box>
            </MainCard>
        )
    }

    if (phase === 'results' && results) {
        const dims = results.dimension_scores || []
        return (
            <MainCard>
                <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    {/* Results header */}
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Typography variant='h3' fontWeight={800} sx={{ mb: 1 }}>{meta.title} Results</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <ScoreCircle score={results.total_score} color={meta.color} />
                        </Box>
                        <Chip
                            label={getTierLabel(results.tier)}
                            sx={{
                                bgcolor: getTierColor(results.tier),
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '1rem',
                                px: 2,
                                py: 0.5,
                                height: 'auto'
                            }}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Dimension Scores */}
                    {dims.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant='h5' fontWeight={700} sx={{ mb: 2 }}>Dimension Breakdown</Typography>
                            <Stack spacing={2}>
                                {dims.map((dim) => (
                                    <Box key={dim.dimension}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant='body2' fontWeight={600}>{dim.dimension}</Typography>
                                            <Typography variant='body2' fontWeight={700} sx={{ color: meta.color }}>
                                                {Math.round(dim.score)}/100
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant='determinate'
                                            value={dim.score}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                bgcolor: 'grey.200',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: dim.score >= 70 ? '#2e7d32' : dim.score >= 50 ? '#f57c00' : '#d32f2f'
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    <Divider sx={{ my: 3 }} />

                    {/* Recommendations */}
                    {results.recommendations && results.recommendations.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant='h5' fontWeight={700} sx={{ mb: 2 }}>Your Personalized Recommendations</Typography>
                            <Stack spacing={1.5}>
                                {results.recommendations.map((rec, idx) => (
                                    <Card key={idx} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, display: 'flex', gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 28, height: 28, borderRadius: '50%',
                                                    bgcolor: meta.color, color: '#fff',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: '0.875rem', flexShrink: 0
                                                }}
                                            >
                                                {idx + 1}
                                            </Box>
                                            <Typography variant='body2' sx={{ pt: 0.25 }}>{rec}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {error && <Alert severity='warning' sx={{ mb: 3 }}>{error}</Alert>}

                    {/* Actions */}
                    <Stack direction='row' spacing={2} justifyContent='center'>
                        <Button variant='outlined' onClick={handleRetake}>
                            Retake Assessment
                        </Button>
                        <Button
                            variant='contained'
                            onClick={() => navigate('/career-lab/scores')}
                            sx={{ bgcolor: meta.color, '&:hover': { bgcolor: meta.color, opacity: 0.9 } }}
                        >
                            Save & View Full Report
                        </Button>
                    </Stack>
                </Box>
            </MainCard>
        )
    }

    return null
}

export default TakeAssessment
