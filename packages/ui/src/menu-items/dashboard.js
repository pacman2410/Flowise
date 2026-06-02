// assets
import {
    IconHierarchy,
    IconBuildingStore,
    IconKey,
    IconTool,
    IconLock,
    IconBriefcase,
    IconClipboardList,
    IconMap,
    IconCalendarCheck,
    IconTrophy,
    IconMessages,
    IconChartBar
} from '@tabler/icons'

// constant
const icons = {
    IconHierarchy,
    IconBuildingStore,
    IconKey,
    IconTool,
    IconLock,
    IconBriefcase,
    IconClipboardList,
    IconMap,
    IconCalendarCheck,
    IconTrophy,
    IconMessages,
    IconChartBar
}

// ==============================|| CAREER LAB MENU ITEMS ||============================== //

const careerLab = {
    id: 'career-lab',
    title: 'Career Lab HQ',
    type: 'group',
    children: [
        {
            id: 'career-lab-dashboard',
            title: 'Career Lab HQ',
            type: 'item',
            url: '/career-lab',
            icon: icons.IconBriefcase,
            breadcrumbs: true
        },
        {
            id: 'career-lab-assessments',
            title: 'Assessments',
            type: 'item',
            url: '/career-lab/scores',
            icon: icons.IconClipboardList,
            breadcrumbs: true
        },
        {
            id: 'career-lab-blueprint',
            title: 'My Blueprint',
            type: 'item',
            url: '/career-lab/blueprint',
            icon: icons.IconMap,
            breadcrumbs: true
        },
        {
            id: 'career-lab-checkin',
            title: 'Weekly Check-In',
            type: 'item',
            url: '/career-lab/checkin',
            icon: icons.IconCalendarCheck,
            breadcrumbs: true
        },
        {
            id: 'career-lab-evidence',
            title: 'Evidence Vault',
            type: 'item',
            url: '/career-lab/evidence',
            icon: icons.IconTrophy,
            breadcrumbs: true
        },
        {
            id: 'career-lab-conversation',
            title: 'Conversation Prep',
            type: 'item',
            url: '/career-lab/conversation-prep',
            icon: icons.IconMessages,
            breadcrumbs: true
        }
    ]
}

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'chatflows',
            title: 'Chatflows',
            type: 'item',
            url: '/chatflows',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'marketplaces',
            title: 'Marketplaces',
            type: 'item',
            url: '/marketplaces',
            icon: icons.IconBuildingStore,
            breadcrumbs: true
        },
        {
            id: 'tools',
            title: 'Tools',
            type: 'item',
            url: '/tools',
            icon: icons.IconTool,
            breadcrumbs: true
        },
        {
            id: 'credentials',
            title: 'Credentials',
            type: 'item',
            url: '/credentials',
            icon: icons.IconLock,
            breadcrumbs: true
        },
        {
            id: 'apikey',
            title: 'API Keys',
            type: 'item',
            url: '/apikey',
            icon: icons.IconKey,
            breadcrumbs: true
        }
    ]
}

export { careerLab }
export default dashboard
