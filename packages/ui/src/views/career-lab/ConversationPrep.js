import { useState } from 'react'
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
    Alert
} from '@mui/material'
import { IconCheck } from '@tabler/icons'
import MainCard from 'ui-component/cards/MainCard'

const CONVERSATION_TYPES = [
    {
        id: 'one_on_one',
        title: 'One-on-One Prep',
        description: 'Build a focused agenda for your weekly 1:1 that drives real outcomes — not just status updates.',
        icon: '🗓️',
        color: '#1976d2',
        prompts: [
            { key: 'updates', label: 'Updates to share', placeholder: 'What have you accomplished since your last 1:1? What progress have you made on key priorities?' },
            { key: 'support', label: 'Support I need', placeholder: 'What decisions or resources do you need from your manager? What roadblocks need to be cleared?' },
            { key: 'feedback_give', label: 'Feedback I want to give', placeholder: 'What feedback would help your manager or team improve? How can you frame it constructively?' },
            { key: 'feedback_get', label: 'Feedback I want to get', placeholder: 'What specific feedback do you want on your performance or a recent project?' },
            { key: 'career', label: 'Career development topic', placeholder: 'Is there a career conversation you want to raise? A growth opportunity to discuss?' }
        ]
    },
    {
        id: 'promotion',
        title: 'Promotion Conversation',
        description: 'Walk into your promotion conversation with a compelling, evidence-backed case that is impossible to ignore.',
        icon: '🚀',
        color: '#7b1fa2',
        prompts: [
            { key: 'evidence', label: 'Evidence supporting my case', placeholder: 'What specific accomplishments demonstrate you are already operating at the next level? Use numbers.' },
            { key: 'target_role', label: 'Role I am targeting', placeholder: 'What is the specific title or level you are seeking? Why now, and why you?' },
            { key: 'next_level_value', label: 'Value I will bring at the next level', placeholder: 'What new problems will you solve? How will the business be different because you were promoted?' },
            { key: 'timeline', label: 'Timeline and readiness', placeholder: 'When are you ready? What milestones have you hit that signal readiness?' },
            { key: 'ask', label: 'My specific ask', placeholder: 'How will you frame your ask? What exactly will you say to open the conversation?' }
        ]
    },
    {
        id: 'performance_review',
        title: 'Performance Review Prep',
        description: 'Transform your self-review from a box-checking exercise into a powerful career advancement tool.',
        icon: '📊',
        color: '#00695c',
        prompts: [
            { key: 'top_wins', label: 'My top 3 wins this period', placeholder: 'What are your most impactful accomplishments? What changed because of your work? Quantify everything.' },
            { key: 'do_differently', label: 'What I would do differently', placeholder: 'Where did you fall short or miss an opportunity? Show self-awareness and a growth mindset.' },
            { key: 'development_goals', label: 'My development goals', placeholder: 'What specific skills or capabilities do you want to build in the next period? Why do they matter?' },
            { key: 'contributions_beyond', label: 'Contributions beyond my role', placeholder: 'How have you contributed beyond your job description? Mentoring, culture, cross-team collaboration?' },
            { key: 'next_period', label: 'What I want next period', placeholder: 'What stretch goals, new projects, or career conversations do you want to make happen?' }
        ]
    },
    {
        id: 'development',
        title: 'Development Discussion',
        description: 'Have a structured conversation about your growth that leads to real opportunities, not vague encouragement.',
        icon: '🎯',
        color: '#c62828',
        prompts: [
            { key: 'two_years', label: 'Where I want to be in 2 years', placeholder: 'Paint a specific picture of your career in 2 years. What role, what impact, what reputation?' },
            { key: 'blocking_growth', label: 'What is blocking my growth', placeholder: 'What is the real obstacle between you and the next level? Be honest — is it skills, visibility, sponsorship?' },
            { key: 'resources_needed', label: 'Resources I need', placeholder: 'What opportunities, experiences, training, or introductions would accelerate your development?' },
            { key: 'manager_role', label: 'How my manager can help', placeholder: 'What specific actions can your manager take to support your development? Be concrete and actionable.' },
            { key: 'commitments', label: 'Commitments I will make', placeholder: 'What will you commit to doing differently starting this week? What accountability do you want?' }
        ]
    },
    {
        id: 'difficult',
        title: 'Difficult Conversation',
        description: 'Prepare for hard conversations so you can address what matters without it spiraling or being avoided.',
        icon: '💬',
        color: '#e65100',
        prompts: [
            { key: 'desired_outcome', label: 'The outcome I want', placeholder: 'What does a successful conversation look like? What needs to be different after this conversation?' },
            { key: 'afraid_to_say', label: 'What I am afraid to say directly', placeholder: 'What is the thing you most need to say but are avoiding? Write it raw here, then refine it.' },
            { key: 'impact', label: 'The impact of not having this conversation', placeholder: 'What happens if you do not have this conversation? What does silence cost you or the team?' },
            { key: 'their_perspective', label: 'Their likely perspective', placeholder: 'How does the other person likely see this situation? What do they value? Where might they push back?' },
            { key: 'opening', label: 'How I will open the conversation', placeholder: 'Write your exact opening sentence. Make it direct, non-blaming, and focused on behavior or impact.' }
        ]
    }
]

const PrepDialog = ({ open, onClose, convType }) => {
    const [answers, setAnswers] = useState({})
    const [saved, setSaved] = useState(false)

    if (!convType) return null

    const handleChange = (key, val) => setAnswers((prev) => ({ ...prev, [key]: val }))

    const handleSave = () => {
        const storageKey = `conv_prep_${convType.id}`
        localStorage.setItem(storageKey, JSON.stringify({ answers, savedAt: new Date().toISOString() }))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const handleOpen = () => {
        const storageKey = `conv_prep_${convType.id}`
        const stored = localStorage.getItem(storageKey)
        if (stored) {
            const { answers: savedAnswers } = JSON.parse(stored)
            setAnswers(savedAnswers || {})
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='md'
            fullWidth
            TransitionProps={{ onEnter: handleOpen }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography fontSize={28}>{convType.icon}</Typography>
                    <Box>
                        <Typography variant='h6' fontWeight={700}>{convType.title}</Typography>
                        <Typography variant='body2' color='text.secondary'>{convType.description}</Typography>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Alert severity='info' sx={{ mb: 3 }}>
                    Answer each prompt honestly. The goal is to think through the conversation before it happens, not to craft a script.
                </Alert>

                <Stack spacing={3}>
                    {convType.prompts.map((prompt, i) => (
                        <Box key={prompt.key}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Box
                                    sx={{
                                        width: 24, height: 24, borderRadius: '50%',
                                        bgcolor: convType.color, color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                                    }}
                                >
                                    {i + 1}
                                </Box>
                                <Typography variant='subtitle2' fontWeight={700}>{prompt.label}</Typography>
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={answers[prompt.key] || ''}
                                onChange={(e) => handleChange(prompt.key, e.target.value)}
                                placeholder={prompt.placeholder}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': { borderColor: convType.color }
                                    }
                                }}
                            />
                        </Box>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
                <Button onClick={onClose} variant='outlined'>Close</Button>
                <Button
                    variant='contained'
                    onClick={handleSave}
                    startIcon={saved ? <IconCheck size={16} /> : null}
                    color={saved ? 'success' : 'primary'}
                    sx={!saved ? { bgcolor: convType.color, '&:hover': { bgcolor: convType.color, opacity: 0.9 } } : {}}
                >
                    {saved ? 'Preparation Saved!' : 'Save Preparation'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const ConversationPrep = () => {
    const [activeConv, setActiveConv] = useState(null)

    return (
        <MainCard>
            <Box sx={{ mb: 4 }}>
                <Typography variant='h3' fontWeight={800} sx={{ mb: 0.5 }}>Conversation Prep</Typography>
                <Typography variant='body1' color='text.secondary'>
                    Prepare for high-stakes conversations before they happen. Great conversations are built, not improvised.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {CONVERSATION_TYPES.map((conv) => {
                    const storageKey = `conv_prep_${conv.id}`
                    const hasSaved = typeof window !== 'undefined' && localStorage.getItem(storageKey)

                    return (
                        <Grid item xs={12} sm={6} key={conv.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    border: `2px solid ${conv.color}22`,
                                    borderTop: `4px solid ${conv.color}`,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                }}
                            >
                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                                        <Typography fontSize={32}>{conv.icon}</Typography>
                                        <Box>
                                            <Typography variant='h6' fontWeight={700}>{conv.title}</Typography>
                                            {hasSaved && (
                                                <Chip
                                                    label='Prepared'
                                                    size='small'
                                                    icon={<IconCheck size={12} />}
                                                    color='success'
                                                    variant='outlined'
                                                    sx={{ mt: 0.5 }}
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2.5, flex: 1 }}>
                                        {conv.description}
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant='caption' fontWeight={700} color='text.secondary' sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Guided Prompts
                                        </Typography>
                                        <Stack direction='row' spacing={0.5} flexWrap='wrap' gap={0.5} sx={{ mt: 0.75 }}>
                                            {conv.prompts.map((p) => (
                                                <Chip key={p.key} label={p.label} size='small' variant='outlined' sx={{ fontSize: '0.7rem' }} />
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Button
                                        variant='contained'
                                        fullWidth
                                        onClick={() => setActiveConv(conv)}
                                        sx={{
                                            bgcolor: conv.color,
                                            '&:hover': { bgcolor: conv.color, opacity: 0.9 }
                                        }}
                                    >
                                        {hasSaved ? 'Review & Update Prep' : 'Prepare Now'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

            {/* Tips card */}
            <Card elevation={0} sx={{ mt: 4, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant='h6' fontWeight={700} sx={{ mb: 1.5 }}>Tips for High-Impact Conversations</Typography>
                    <Grid container spacing={2}>
                        {[
                            { title: 'Prepare in writing', body: 'Writing forces clarity. If you cannot write it clearly, you cannot say it clearly.' },
                            { title: 'Know your ask', body: 'Never leave a conversation without a clear request or next step. Vague conversations produce vague results.' },
                            { title: 'Lead with curiosity', body: 'Ask questions before advocating. Understanding their perspective makes your case stronger.' },
                            { title: 'Follow up in writing', body: 'After important conversations, send a brief email summarizing what was agreed. It creates accountability.' }
                        ].map((tip, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            width: 28, height: 28, borderRadius: '50%',
                                            bgcolor: 'primary.main', color: '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '0.875rem', flexShrink: 0
                                        }}
                                    >
                                        {i + 1}
                                    </Box>
                                    <Box>
                                        <Typography variant='subtitle2' fontWeight={700}>{tip.title}</Typography>
                                        <Typography variant='body2' color='text.secondary'>{tip.body}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            <PrepDialog
                open={Boolean(activeConv)}
                onClose={() => setActiveConv(null)}
                convType={activeConv}
            />
        </MainCard>
    )
}

export default ConversationPrep
