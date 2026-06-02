import { useEffect, useState } from 'react'
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
    Slider,
    TextField,
    Stack,
    Divider,
    Collapse,
    IconButton
} from '@mui/material'
import { IconChevronDown, IconChevronUp, IconCheck } from '@tabler/icons'
import MainCard from 'ui-component/cards/MainCard'
import careerApi from 'api/career'
import { getCareerUserId } from 'utils/careerUtils'

function getWeekStart(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
}

function formatWeekLabel(weekStart) {
    if (!weekStart) return 'Unknown week'
    const start = new Date(weekStart)
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 6)
    return `Week of ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

const MultiTextInput = ({ label, count, values, onChange, placeholder }) => {
    const handleChange = (i, val) => {
        const updated = [...values]
        updated[i] = val
        onChange(updated)
    }
    return (
        <Box>
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>{label}</Typography>
            <Stack spacing={1}>
                {Array.from({ length: count }).map((_, i) => (
                    <TextField
                        key={i}
                        size='small'
                        fullWidth
                        value={values[i] || ''}
                        onChange={(e) => handleChange(i, e.target.value)}
                        placeholder={`${placeholder} ${i + 1}...`}
                    />
                ))}
            </Stack>
        </Box>
    )
}

const CheckInHistoryItem = ({ checkIn }) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant='body2' fontWeight={700}>
                            {formatWeekLabel(checkIn.week_start || checkIn.createdAt)}
                        </Typography>
                        <Stack direction='row' spacing={1} sx={{ mt: 0.5 }}>
                            <Chip
                                label={`Confidence: ${checkIn.confidence_score}/10`}
                                size='small'
                                sx={{
                                    bgcolor: checkIn.confidence_score >= 7 ? '#e8f5e9' : checkIn.confidence_score >= 4 ? '#fff3e0' : '#fce4ec',
                                    color: checkIn.confidence_score >= 7 ? '#2e7d32' : checkIn.confidence_score >= 4 ? '#e65100' : '#c62828',
                                    fontWeight: 600
                                }}
                            />
                            <Chip
                                label={`Momentum: ${checkIn.momentum_score}/10`}
                                size='small'
                                sx={{
                                    bgcolor: checkIn.momentum_score >= 7 ? '#e3f2fd' : '#f3e5f5',
                                    color: checkIn.momentum_score >= 7 ? '#1565c0' : '#6a1b9a',
                                    fontWeight: 600
                                }}
                            />
                            {Array.isArray(checkIn.wins) && checkIn.wins.filter(Boolean).length > 0 && (
                                <Chip
                                    label={`${checkIn.wins.filter(Boolean).length} win${checkIn.wins.filter(Boolean).length > 1 ? 's' : ''}`}
                                    size='small'
                                    color='success'
                                    variant='outlined'
                                />
                            )}
                        </Stack>
                    </Box>
                    <IconButton size='small' onClick={() => setExpanded(!expanded)}>
                        {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </IconButton>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ mt: 2 }}>
                        {Array.isArray(checkIn.wins) && checkIn.wins.filter(Boolean).length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant='caption' fontWeight={700} color='success.main'>Wins</Typography>
                                {checkIn.wins.filter(Boolean).map((w, i) => (
                                    <Typography key={i} variant='body2' sx={{ ml: 1, mt: 0.5 }}>• {w}</Typography>
                                ))}
                            </Box>
                        )}
                        {Array.isArray(checkIn.blockers) && checkIn.blockers.filter(Boolean).length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant='caption' fontWeight={700} color='error.main'>Blockers</Typography>
                                {checkIn.blockers.filter(Boolean).map((b, i) => (
                                    <Typography key={i} variant='body2' sx={{ ml: 1, mt: 0.5 }}>• {b}</Typography>
                                ))}
                            </Box>
                        )}
                        {Array.isArray(checkIn.next_priorities) && checkIn.next_priorities.filter(Boolean).length > 0 && (
                            <Box>
                                <Typography variant='caption' fontWeight={700} color='primary.main'>Next Week Priorities</Typography>
                                {checkIn.next_priorities.filter(Boolean).map((p, i) => (
                                    <Typography key={i} variant='body2' sx={{ ml: 1, mt: 0.5 }}>• {p}</Typography>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    )
}

const EMPTY_FORM = {
    confidence: 5,
    momentum: 5,
    wins: ['', '', ''],
    blockers: ['', '', ''],
    actionsCompleted: ['', '', '', '', ''],
    nextPriorities: ['', '', '', '', '']
}

const WeeklyCheckIn = () => {
    const userId = getCareerUserId()
    const [form, setForm] = useState(EMPTY_FORM)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(null)

    const thisWeek = getWeekStart(new Date())

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true)
            try {
                const res = await careerApi.getCheckIns(userId)
                setHistory(Array.isArray(res.data) ? res.data : [])
            } catch {
                setHistory([])
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [userId])

    const update = (field, val) => setForm((prev) => ({ ...prev, [field]: val }))

    const handleSubmit = async () => {
        setSubmitting(true)
        setError(null)
        try {
            const payload = {
                week_start: thisWeek,
                confidence_score: form.confidence,
                momentum_score: form.momentum,
                wins: form.wins.filter(Boolean),
                blockers: form.blockers.filter(Boolean),
                actions_completed: form.actionsCompleted.filter(Boolean),
                next_priorities: form.nextPriorities.filter(Boolean)
            }
            await careerApi.createCheckIn(userId, payload)
            setHistory((prev) => [{ ...payload, createdAt: new Date().toISOString() }, ...prev])
            setForm(EMPTY_FORM)
            setSubmitted(true)
            setTimeout(() => setSubmitted(false), 4000)
        } catch {
            // Store locally as fallback
            const payload = {
                week_start: thisWeek,
                confidence_score: form.confidence,
                momentum_score: form.momentum,
                wins: form.wins.filter(Boolean),
                blockers: form.blockers.filter(Boolean),
                actions_completed: form.actionsCompleted.filter(Boolean),
                next_priorities: form.nextPriorities.filter(Boolean),
                createdAt: new Date().toISOString()
            }
            setHistory((prev) => [payload, ...prev])
            setForm(EMPTY_FORM)
            setSubmitted(true)
            setTimeout(() => setSubmitted(false), 4000)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <MainCard>
            <Typography variant='h3' fontWeight={800} sx={{ mb: 0.5 }}>Weekly Check-In</Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
                Build momentum with a consistent weekly reflection practice
            </Typography>

            <Grid container spacing={3}>
                {/* Left Panel — Form */}
                <Grid item xs={12} md={7}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant='h6' fontWeight={700}>This Week</Typography>
                                    <Typography variant='body2' color='text.secondary'>{formatWeekLabel(thisWeek)}</Typography>
                                </Box>
                                <Chip label='New Check-In' color='primary' size='small' />
                            </Box>

                            {submitted && (
                                <Alert severity='success' icon={<IconCheck />} sx={{ mb: 2 }}>
                                    Check-in saved! Great work staying consistent.
                                </Alert>
                            )}

                            {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

                            <Stack spacing={3}>
                                {/* Confidence Slider */}
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='subtitle2' fontWeight={700}>Confidence Level</Typography>
                                        <Typography variant='subtitle2' fontWeight={700} color='primary'>
                                            {form.confidence}/10
                                        </Typography>
                                    </Box>
                                    <Slider
                                        value={form.confidence}
                                        min={1}
                                        max={10}
                                        step={1}
                                        marks
                                        onChange={(_, val) => update('confidence', val)}
                                        sx={{ color: form.confidence >= 7 ? '#2e7d32' : form.confidence >= 4 ? '#f57c00' : '#d32f2f' }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant='caption' color='text.secondary'>Low confidence</Typography>
                                        <Typography variant='caption' color='text.secondary'>High confidence</Typography>
                                    </Box>
                                </Box>

                                {/* Momentum Slider */}
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant='subtitle2' fontWeight={700}>Career Momentum</Typography>
                                        <Typography variant='subtitle2' fontWeight={700} color='secondary'>
                                            {form.momentum}/10
                                        </Typography>
                                    </Box>
                                    <Slider
                                        value={form.momentum}
                                        min={1}
                                        max={10}
                                        step={1}
                                        marks
                                        onChange={(_, val) => update('momentum', val)}
                                        color='secondary'
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant='caption' color='text.secondary'>Stalled</Typography>
                                        <Typography variant='caption' color='text.secondary'>Unstoppable</Typography>
                                    </Box>
                                </Box>

                                <Divider />

                                <MultiTextInput
                                    label='Wins This Week'
                                    count={3}
                                    values={form.wins}
                                    onChange={(val) => update('wins', val)}
                                    placeholder='Win'
                                />

                                <MultiTextInput
                                    label='Blockers I Faced'
                                    count={3}
                                    values={form.blockers}
                                    onChange={(val) => update('blockers', val)}
                                    placeholder='Blocker'
                                />

                                <MultiTextInput
                                    label='Actions Completed'
                                    count={5}
                                    values={form.actionsCompleted}
                                    onChange={(val) => update('actionsCompleted', val)}
                                    placeholder='Action completed'
                                />

                                <MultiTextInput
                                    label="Next Week's Priorities"
                                    count={5}
                                    values={form.nextPriorities}
                                    onChange={(val) => update('nextPriorities', val)}
                                    placeholder='Priority'
                                />

                                <Button
                                    variant='contained'
                                    size='large'
                                    fullWidth
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    startIcon={submitting ? <CircularProgress size={16} color='inherit' /> : null}
                                >
                                    {submitting ? 'Saving...' : 'Submit This Week\'s Check-In'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Panel — History */}
                <Grid item xs={12} md={5}>
                    <Typography variant='h6' fontWeight={700} sx={{ mb: 2 }}>Check-In History</Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : history.length === 0 ? (
                        <Card elevation={0} sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center' }}>
                            <Typography variant='body2' color='text.secondary'>
                                No check-ins yet. Complete your first check-in to start building your track record.
                            </Typography>
                        </Card>
                    ) : (
                        <Stack spacing={1.5}>
                            {history.map((c, i) => (
                                <CheckInHistoryItem key={i} checkIn={c} />
                            ))}
                        </Stack>
                    )}
                </Grid>
            </Grid>
        </MainCard>
    )
}

export default WeeklyCheckIn
