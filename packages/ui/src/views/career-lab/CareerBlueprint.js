import { useEffect, useState, useCallback } from 'react'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Tabs,
    Tab,
    Stack,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Grid,
    Divider
} from '@mui/material'
import { IconPlus, IconTrash, IconDeviceFloppy, IconCheck } from '@tabler/icons'
import MainCard from 'ui-component/cards/MainCard'
import careerApi from 'api/career'
import { getCareerUserId } from 'utils/careerUtils'

const EMPTY_BLUEPRINT = {
    current_state: '',
    desired_state: '',
    career_goal: '',
    target_role: '',
    target_salary: '',
    skill_gaps: [],
    success_metrics: [],
    milestones: [],
    action_items: [],
    weekly_priorities: [],
    risks: '',
    dependencies: ''
}

const TabPanel = ({ children, value, index }) => (
    <Box role='tabpanel' hidden={value !== index} sx={{ mt: 3 }}>
        {value === index && children}
    </Box>
)

const EditableList = ({ label, items, onChange, placeholder }) => {
    const handleAdd = () => onChange([...items, ''])
    const handleChange = (i, val) => {
        const updated = [...items]
        updated[i] = val
        onChange(updated)
    }
    const handleRemove = (i) => onChange(items.filter((_, idx) => idx !== i))

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant='subtitle2' fontWeight={700}>{label}</Typography>
                <Button size='small' startIcon={<IconPlus size={14} />} onClick={handleAdd} variant='outlined'>
                    Add
                </Button>
            </Box>
            <Stack spacing={1}>
                {items.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            size='small'
                            value={item}
                            onChange={(e) => handleChange(i, e.target.value)}
                            placeholder={placeholder || 'Enter item...'}
                        />
                        <IconButton size='small' color='error' onClick={() => handleRemove(i)}>
                            <IconTrash size={16} />
                        </IconButton>
                    </Box>
                ))}
                {items.length === 0 && (
                    <Typography variant='body2' color='text.secondary' fontStyle='italic'>
                        No items yet. Click Add to get started.
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}

const MilestoneList = ({ milestones, onChange }) => {
    const handleAdd = () => onChange([...milestones, { title: '', targetDate: '', completed: false }])
    const handleChange = (i, field, val) => {
        const updated = milestones.map((m, idx) => idx === i ? { ...m, [field]: val } : m)
        onChange(updated)
    }
    const handleRemove = (i) => onChange(milestones.filter((_, idx) => idx !== i))

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant='subtitle2' fontWeight={700}>Milestones</Typography>
                <Button size='small' startIcon={<IconPlus size={14} />} onClick={handleAdd} variant='outlined'>
                    Add Milestone
                </Button>
            </Box>
            <Stack spacing={1.5}>
                {milestones.map((m, i) => (
                    <Card key={i} variant='outlined' sx={{ bgcolor: m.completed ? 'success.50' : 'background.paper' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={m.completed}
                                            onChange={(e) => handleChange(i, 'completed', e.target.checked)}
                                            color='success'
                                        />
                                    }
                                    label=''
                                    sx={{ m: 0, mr: 0 }}
                                />
                                <Box sx={{ flex: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <TextField
                                        size='small'
                                        value={m.title}
                                        onChange={(e) => handleChange(i, 'title', e.target.value)}
                                        placeholder='Milestone title...'
                                        sx={{ flex: 1, minWidth: 200 }}
                                        inputProps={{ style: { textDecoration: m.completed ? 'line-through' : 'none' } }}
                                    />
                                    <TextField
                                        size='small'
                                        type='date'
                                        value={m.targetDate}
                                        onChange={(e) => handleChange(i, 'targetDate', e.target.value)}
                                        sx={{ width: 160 }}
                                        InputLabelProps={{ shrink: true }}
                                        label='Target Date'
                                    />
                                </Box>
                                <IconButton size='small' color='error' onClick={() => handleRemove(i)}>
                                    <IconTrash size={16} />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
                {milestones.length === 0 && (
                    <Typography variant='body2' color='text.secondary' fontStyle='italic'>
                        No milestones yet. Add your key career checkpoints.
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}

const ActionItemList = ({ items, onChange }) => {
    const handleAdd = () => onChange([...items, { action: '', priority: 'medium', dueDate: '', status: 'todo' }])
    const handleChange = (i, field, val) => {
        const updated = items.map((a, idx) => idx === i ? { ...a, [field]: val } : a)
        onChange(updated)
    }
    const handleRemove = (i) => onChange(items.filter((_, idx) => idx !== i))

    const priorityColors = { high: 'error', medium: 'warning', low: 'default' }
    const statusColors = { todo: 'default', in_progress: 'primary', done: 'success' }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant='subtitle2' fontWeight={700}>Action Items</Typography>
                <Button size='small' startIcon={<IconPlus size={14} />} onClick={handleAdd} variant='outlined'>
                    Add Action
                </Button>
            </Box>
            <Stack spacing={1.5}>
                {items.map((a, i) => (
                    <Card key={i} variant='outlined'>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <TextField
                                    size='small'
                                    value={a.action}
                                    onChange={(e) => handleChange(i, 'action', e.target.value)}
                                    placeholder='Action item...'
                                    sx={{ flex: 1, minWidth: 200 }}
                                />
                                <FormControl size='small' sx={{ minWidth: 110 }}>
                                    <InputLabel>Priority</InputLabel>
                                    <Select value={a.priority} label='Priority' onChange={(e) => handleChange(i, 'priority', e.target.value)}>
                                        <MenuItem value='high'>High</MenuItem>
                                        <MenuItem value='medium'>Medium</MenuItem>
                                        <MenuItem value='low'>Low</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl size='small' sx={{ minWidth: 120 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select value={a.status} label='Status' onChange={(e) => handleChange(i, 'status', e.target.value)}>
                                        <MenuItem value='todo'>To Do</MenuItem>
                                        <MenuItem value='in_progress'>In Progress</MenuItem>
                                        <MenuItem value='done'>Done</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    size='small'
                                    type='date'
                                    value={a.dueDate}
                                    onChange={(e) => handleChange(i, 'dueDate', e.target.value)}
                                    sx={{ width: 150 }}
                                    InputLabelProps={{ shrink: true }}
                                    label='Due Date'
                                />
                                <IconButton size='small' color='error' onClick={() => handleRemove(i)}>
                                    <IconTrash size={16} />
                                </IconButton>
                            </Box>
                            <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                                <Chip label={a.priority} size='small' color={priorityColors[a.priority]} />
                                <Chip label={a.status.replace('_', ' ')} size='small' color={statusColors[a.status]} />
                            </Box>
                        </CardContent>
                    </Card>
                ))}
                {items.length === 0 && (
                    <Typography variant='body2' color='text.secondary' fontStyle='italic'>
                        No action items yet. Break down your goals into concrete steps.
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}

const CareerBlueprint = () => {
    const userId = getCareerUserId()
    const [tab, setTab] = useState(0)
    const [blueprint, setBlueprint] = useState(EMPTY_BLUEPRINT)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBlueprint = async () => {
            setLoading(true)
            try {
                const res = await careerApi.getBlueprint(userId)
                if (res.data) {
                    setBlueprint({ ...EMPTY_BLUEPRINT, ...res.data })
                }
            } catch {
                // No existing blueprint, use empty
            } finally {
                setLoading(false)
            }
        }
        fetchBlueprint()
    }, [userId])

    const update = (field, value) => {
        setBlueprint((prev) => ({ ...prev, [field]: value }))
        setSaved(false)
    }

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        try {
            await careerApi.updateBlueprint(userId, blueprint)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch {
            // Save locally as fallback
            localStorage.setItem(`career_blueprint_${userId}`, JSON.stringify(blueprint))
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } finally {
            setSaving(false)
        }
    }

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant='h3' fontWeight={800} sx={{ mb: 0.5 }}>Career Blueprint</Typography>
                    <Typography variant='body1' color='text.secondary'>
                        Your personalized career plan and roadmap
                    </Typography>
                </Box>
                <Button
                    variant='contained'
                    startIcon={saved ? <IconCheck size={16} /> : saving ? <CircularProgress size={16} color='inherit' /> : <IconDeviceFloppy size={16} />}
                    onClick={handleSave}
                    disabled={saving}
                    color={saved ? 'success' : 'primary'}
                    sx={{ minWidth: 140 }}
                >
                    {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Blueprint'}
                </Button>
            </Box>

            {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant='scrollable' scrollButtons='auto'>
                    <Tab label='Foundation' />
                    <Tab label='Development Plan' />
                    <Tab label='Action Plan' />
                    <Tab label='Weekly Priorities' />
                </Tabs>
            </Box>

            {/* Tab 1: Foundation */}
            <TabPanel value={tab} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label='Current State'
                            value={blueprint.current_state}
                            onChange={(e) => update('current_state', e.target.value)}
                            placeholder='Describe where you are today in your career...'
                            helperText='Be honest about your current situation, strengths, and challenges'
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label='Desired State'
                            value={blueprint.desired_state}
                            onChange={(e) => update('desired_state', e.target.value)}
                            placeholder='Describe your ideal career in 2-3 years...'
                            helperText='Paint a vivid picture of where you want to be'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label='Career Goal'
                            value={blueprint.career_goal}
                            onChange={(e) => update('career_goal', e.target.value)}
                            placeholder='What is your primary career goal? Be specific and measurable...'
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label='Target Role'
                            value={blueprint.target_role}
                            onChange={(e) => update('target_role', e.target.value)}
                            placeholder='e.g., Senior Director of Product'
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label='Target Salary'
                            value={blueprint.target_salary}
                            onChange={(e) => update('target_salary', e.target.value)}
                            placeholder='e.g., $200,000'
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Tab 2: Development Plan */}
            <TabPanel value={tab} index={1}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <EditableList
                            label='Skill Gaps to Address'
                            items={blueprint.skill_gaps}
                            onChange={(val) => update('skill_gaps', val)}
                            placeholder='e.g., Financial modeling, Executive presence...'
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <EditableList
                            label='Success Metrics'
                            items={blueprint.success_metrics}
                            onChange={(val) => update('success_metrics', val)}
                            placeholder='e.g., Lead a cross-functional project by Q3...'
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Tab 3: Action Plan */}
            <TabPanel value={tab} index={2}>
                <Stack spacing={4}>
                    <MilestoneList
                        milestones={blueprint.milestones}
                        onChange={(val) => update('milestones', val)}
                    />
                    <Divider />
                    <ActionItemList
                        items={blueprint.action_items}
                        onChange={(val) => update('action_items', val)}
                    />
                </Stack>
            </TabPanel>

            {/* Tab 4: Weekly Priorities */}
            <TabPanel value={tab} index={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <EditableList
                            label="This Week's Top Priorities (3-5 max)"
                            items={blueprint.weekly_priorities}
                            onChange={(val) => update('weekly_priorities', val.slice(0, 5))}
                            placeholder='e.g., Finish Q2 proposal, Meet with mentor...'
                        />
                        {blueprint.weekly_priorities.length >= 5 && (
                            <Alert severity='info' sx={{ mt: 1 }}>
                                Focus is power. 5 priorities is the maximum — pick your most important work.
                            </Alert>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={5}
                            label='Risks'
                            value={blueprint.risks}
                            onChange={(e) => update('risks', e.target.value)}
                            placeholder='What risks could derail your progress this week or quarter?'
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={5}
                            label='Dependencies'
                            value={blueprint.dependencies}
                            onChange={(e) => update('dependencies', e.target.value)}
                            placeholder='What do you depend on from others? Approvals, information, decisions?'
                        />
                    </Grid>
                </Grid>
            </TabPanel>
        </MainCard>
    )
}

export default CareerBlueprint
