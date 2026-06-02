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
    TextField,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    InputAdornment
} from '@mui/material'
import { IconPlus, IconEdit, IconTrash, IconSearch, IconPackage } from '@tabler/icons'
import MainCard from 'ui-component/cards/MainCard'
import careerApi from 'api/career'
import { getCareerUserId } from 'utils/careerUtils'

const CATEGORIES = [
    { value: 'all', label: 'All' },
    { value: 'accomplishment', label: 'Accomplishment', color: '#1565c0', bgcolor: '#e3f2fd' },
    { value: 'business_impact', label: 'Business Impact', color: '#2e7d32', bgcolor: '#e8f5e9' },
    { value: 'recognition', label: 'Recognition', color: '#6a1b9a', bgcolor: '#f3e5f5' },
    { value: 'stakeholder_feedback', label: 'Stakeholder Feedback', color: '#00695c', bgcolor: '#e0f2f1' },
    { value: 'project', label: 'Project', color: '#e65100', bgcolor: '#fff3e0' },
    { value: 'leadership', label: 'Leadership', color: '#b71c1c', bgcolor: '#fce4ec' },
    { value: 'metric', label: 'Metric', color: '#0d47a1', bgcolor: '#e8eaf6' }
]

const getCategoryMeta = (value) => CATEGORIES.find((c) => c.value === value) || CATEGORIES[1]

const EMPTY_FORM = {
    title: '',
    category: 'accomplishment',
    description: '',
    impact: '',
    metric: '',
    stakeholder: '',
    evidence_date: new Date().toISOString().split('T')[0],
    tags: ''
}

const EvidenceCard = ({ item, onEdit, onDelete }) => {
    const cat = getCategoryMeta(item.category)
    const [confirmDelete, setConfirmDelete] = useState(false)

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                borderLeft: `4px solid ${cat.color}`,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 3 }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip
                        label={cat.label}
                        size='small'
                        sx={{ bgcolor: cat.bgcolor, color: cat.color, fontWeight: 700, fontSize: '0.7rem' }}
                    />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size='small' onClick={() => onEdit(item)}>
                            <IconEdit size={14} />
                        </IconButton>
                        {confirmDelete ? (
                            <>
                                <Button size='small' color='error' onClick={() => { onDelete(item.id); setConfirmDelete(false) }}>
                                    Confirm
                                </Button>
                                <Button size='small' onClick={() => setConfirmDelete(false)}>Cancel</Button>
                            </>
                        ) : (
                            <IconButton size='small' color='error' onClick={() => setConfirmDelete(true)}>
                                <IconTrash size={14} />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 0.5, lineHeight: 1.3 }}>
                    {item.title}
                </Typography>

                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                        mb: 1.5,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {item.description}
                </Typography>

                {item.impact && (
                    <Box sx={{ bgcolor: 'success.50', borderRadius: 1, px: 1.5, py: 0.75, mb: 1 }}>
                        <Typography variant='caption' fontWeight={700} color='success.main'>Impact: </Typography>
                        <Typography variant='caption' color='text.secondary'>{item.impact}</Typography>
                    </Box>
                )}

                {item.metric && (
                    <Box sx={{ bgcolor: 'primary.50', borderRadius: 1, px: 1.5, py: 0.75, mb: 1 }}>
                        <Typography variant='caption' fontWeight={700} color='primary.main'>Metric: </Typography>
                        <Typography variant='caption' color='text.secondary'>{item.metric}</Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    {item.stakeholder && (
                        <Typography variant='caption' color='text.secondary' fontStyle='italic'>
                            — {item.stakeholder}
                        </Typography>
                    )}
                    <Typography variant='caption' color='text.secondary' sx={{ ml: 'auto' }}>
                        {item.evidence_date ? new Date(item.evidence_date).toLocaleDateString() : ''}
                    </Typography>
                </Box>

                {item.tags && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {String(item.tags).split(',').filter(Boolean).map((tag, i) => (
                            <Chip key={i} label={tag.trim()} size='small' variant='outlined' sx={{ fontSize: '0.65rem' }} />
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}

const EvidenceForm = ({ form, onChange }) => (
    <Stack spacing={2}>
        <TextField
            fullWidth
            label='Title'
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder='Brief, specific title for this evidence...'
            required
        />
        <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={form.category} label='Category' onChange={(e) => onChange('category', e.target.value)}>
                {CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
                    <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
        <TextField
            fullWidth
            multiline
            rows={3}
            label='Description'
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder='What happened? What did you do and how did it happen?'
        />
        <TextField
            fullWidth
            label='Impact'
            value={form.impact}
            onChange={(e) => onChange('impact', e.target.value)}
            placeholder='What was the outcome or result? (e.g., Reduced churn by 15%)'
        />
        <TextField
            fullWidth
            label='Quantified Metric'
            value={form.metric}
            onChange={(e) => onChange('metric', e.target.value)}
            placeholder='Specific number or % (e.g., $500K ARR, 3x faster, 40% reduction)'
        />
        <TextField
            fullWidth
            label='Stakeholder / Source'
            value={form.stakeholder}
            onChange={(e) => onChange('stakeholder', e.target.value)}
            placeholder='Who witnessed or can verify this? (e.g., VP of Engineering)'
        />
        <TextField
            fullWidth
            type='date'
            label='Date'
            value={form.evidence_date}
            onChange={(e) => onChange('evidence_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
        />
        <TextField
            fullWidth
            label='Tags (comma-separated)'
            value={form.tags}
            onChange={(e) => onChange('tags', e.target.value)}
            placeholder='e.g., Q3, product-launch, cross-functional'
        />
    </Stack>
)

const EvidenceVault = () => {
    const userId = getCareerUserId()
    const [evidence, setEvidence] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterCategory, setFilterCategory] = useState('all')
    const [search, setSearch] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [packetDialogOpen, setPacketDialogOpen] = useState(false)

    useEffect(() => {
        const fetchEvidence = async () => {
            setLoading(true)
            try {
                const res = await careerApi.getEvidence(userId)
                setEvidence(Array.isArray(res.data) ? res.data : [])
            } catch {
                setEvidence([])
            } finally {
                setLoading(false)
            }
        }
        fetchEvidence()
    }, [userId])

    const handleOpenAdd = () => {
        setEditingItem(null)
        setForm(EMPTY_FORM)
        setDialogOpen(true)
    }

    const handleOpenEdit = (item) => {
        setEditingItem(item)
        setForm({
            title: item.title || '',
            category: item.category || 'accomplishment',
            description: item.description || '',
            impact: item.impact || '',
            metric: item.metric || '',
            stakeholder: item.stakeholder || '',
            evidence_date: item.evidence_date ? item.evidence_date.split('T')[0] : new Date().toISOString().split('T')[0],
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '')
        })
        setDialogOpen(true)
    }

    const handleFormChange = (field, val) => setForm((prev) => ({ ...prev, [field]: val }))

    const handleSave = async () => {
        if (!form.title.trim()) return
        setSaving(true)
        const payload = { ...form }
        try {
            if (editingItem) {
                await careerApi.updateEvidence(userId, editingItem.id, payload)
                setEvidence((prev) => prev.map((e) => e.id === editingItem.id ? { ...e, ...payload } : e))
            } else {
                const res = await careerApi.createEvidence(userId, payload)
                const newItem = res.data || { ...payload, id: `local_${Date.now()}` }
                setEvidence((prev) => [newItem, ...prev])
            }
            setDialogOpen(false)
        } catch {
            // Local fallback
            if (editingItem) {
                setEvidence((prev) => prev.map((e) => e.id === editingItem.id ? { ...e, ...payload } : e))
            } else {
                setEvidence((prev) => [{ ...payload, id: `local_${Date.now()}` }, ...prev])
            }
            setDialogOpen(false)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await careerApi.deleteEvidence(userId, id)
        } catch {
            // Delete locally anyway
        }
        setEvidence((prev) => prev.filter((e) => e.id !== id))
    }

    const filtered = evidence.filter((e) => {
        const matchCat = filterCategory === 'all' || e.category === filterCategory
        const matchSearch = !search || [e.title, e.description, e.impact].some((f) =>
            f && f.toLowerCase().includes(search.toLowerCase())
        )
        return matchCat && matchSearch
    })

    return (
        <MainCard>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant='h3' fontWeight={800} sx={{ mb: 0.5 }}>Evidence Vault</Typography>
                    <Typography variant='body1' color='text.secondary'>
                        Your promotion evidence library — {evidence.length} item{evidence.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Stack direction='row' spacing={1}>
                    <Button
                        variant='outlined'
                        startIcon={<IconPackage size={16} />}
                        onClick={() => setPacketDialogOpen(true)}
                    >
                        Generate Promotion Packet
                    </Button>
                    <Button
                        variant='contained'
                        startIcon={<IconPlus size={16} />}
                        onClick={handleOpenAdd}
                    >
                        Add Evidence
                    </Button>
                </Stack>
            </Box>

            {/* Search & Filters */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    size='small'
                    placeholder='Search evidence...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2, maxWidth: 360 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <IconSearch size={16} />
                            </InputAdornment>
                        )
                    }}
                />
                <Stack direction='row' spacing={1} flexWrap='wrap' gap={0.5}>
                    {CATEGORIES.map((c) => (
                        <Chip
                            key={c.value}
                            label={c.label}
                            onClick={() => setFilterCategory(c.value)}
                            variant={filterCategory === c.value ? 'filled' : 'outlined'}
                            size='small'
                            sx={
                                filterCategory === c.value && c.value !== 'all'
                                    ? { bgcolor: c.color, color: '#fff', fontWeight: 700 }
                                    : filterCategory === c.value
                                    ? { bgcolor: 'primary.main', color: '#fff', fontWeight: 700 }
                                    : {}
                            }
                        />
                    ))}
                </Stack>
            </Box>

            {/* Evidence Grid */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : filtered.length === 0 ? (
                <Card elevation={0} sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 5, textAlign: 'center' }}>
                    <Typography variant='h6' fontWeight={600} sx={{ mb: 1 }}>No Evidence Yet</Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                        Start capturing your wins, impact, and recognition. Every entry strengthens your promotion case.
                    </Typography>
                    <Button variant='contained' startIcon={<IconPlus size={16} />} onClick={handleOpenAdd}>
                        Add Your First Evidence
                    </Button>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {filtered.map((item, i) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id || i}>
                            <EvidenceCard item={item} onEdit={handleOpenEdit} onDelete={handleDelete} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='sm' fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editingItem ? 'Edit Evidence' : 'Add Evidence'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <EvidenceForm form={form} onChange={handleFormChange} />
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant='contained'
                        onClick={handleSave}
                        disabled={saving || !form.title.trim()}
                    >
                        {saving ? 'Saving...' : editingItem ? 'Update Evidence' : 'Add Evidence'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Promotion Packet Dialog */}
            <Dialog open={packetDialogOpen} onClose={() => setPacketDialogOpen(false)} maxWidth='sm' fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Generate Promotion Packet</DialogTitle>
                <DialogContent>
                    <Alert severity='info' sx={{ mb: 2 }}>
                        This feature compiles your evidence vault into a professional promotion case document.
                    </Alert>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                        The Promotion Packet Generator will:
                    </Typography>
                    <Stack spacing={1}>
                        {[
                            'Organize your evidence by category and impact',
                            'Generate a narrative summary of your contributions',
                            'Highlight your top 5 most impactful achievements',
                            'Create a business case for your promotion',
                            'Format everything into a shareable document'
                        ].map((item, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        width: 20, height: 20, borderRadius: '50%',
                                        bgcolor: 'primary.main', color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.7rem', fontWeight: 700, flexShrink: 0
                                    }}
                                >
                                    {i + 1}
                                </Box>
                                <Typography variant='body2'>{item}</Typography>
                            </Box>
                        ))}
                    </Stack>
                    <Alert severity='warning' sx={{ mt: 2 }}>
                        You currently have {evidence.length} evidence items. Add at least 5-10 strong pieces of evidence for the best packet.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setPacketDialogOpen(false)}>Close</Button>
                    <Button variant='contained' disabled>
                        Generate Packet (Coming Soon)
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    )
}

export default EvidenceVault
