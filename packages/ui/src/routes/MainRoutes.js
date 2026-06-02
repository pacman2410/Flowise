import { lazy } from 'react'

// project imports
import MainLayout from 'layout/MainLayout'
import Loadable from 'ui-component/loading/Loadable'

// chatflows routing
const Chatflows = Loadable(lazy(() => import('views/chatflows')))

// marketplaces routing
const Marketplaces = Loadable(lazy(() => import('views/marketplaces')))

// apikey routing
const APIKey = Loadable(lazy(() => import('views/apikey')))

// tools routing
const Tools = Loadable(lazy(() => import('views/tools')))

// credentials routing
const Credentials = Loadable(lazy(() => import('views/credentials')))

// Career Lab routing
const CareerLabDashboard = Loadable(lazy(() => import('views/career-lab/Dashboard')))
const TakeAssessment = Loadable(lazy(() => import('views/career-lab/TakeAssessment')))
const ScoreReport = Loadable(lazy(() => import('views/career-lab/ScoreReport')))
const CareerBlueprint = Loadable(lazy(() => import('views/career-lab/CareerBlueprint')))
const WeeklyCheckIn = Loadable(lazy(() => import('views/career-lab/WeeklyCheckIn')))
const EvidenceVault = Loadable(lazy(() => import('views/career-lab/EvidenceVault')))
const ConversationPrep = Loadable(lazy(() => import('views/career-lab/ConversationPrep')))
const CareerLandingPage = Loadable(lazy(() => import('views/career-lab/LandingPage')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Chatflows />
        },
        {
            path: '/chatflows',
            element: <Chatflows />
        },
        {
            path: '/marketplaces',
            element: <Marketplaces />
        },
        {
            path: '/apikey',
            element: <APIKey />
        },
        {
            path: '/tools',
            element: <Tools />
        },
        {
            path: '/credentials',
            element: <Credentials />
        },
        {
            path: '/career-lab',
            element: <CareerLabDashboard />
        },
        {
            path: '/career-lab/assessment/:type',
            element: <TakeAssessment />
        },
        {
            path: '/career-lab/scores',
            element: <ScoreReport />
        },
        {
            path: '/career-lab/blueprint',
            element: <CareerBlueprint />
        },
        {
            path: '/career-lab/checkin',
            element: <WeeklyCheckIn />
        },
        {
            path: '/career-lab/evidence',
            element: <EvidenceVault />
        },
        {
            path: '/career-lab/conversation-prep',
            element: <ConversationPrep />
        },
        {
            path: '/career-lab/offer/:offerType',
            element: <CareerLandingPage />
        }
    ]
}

export default MainRoutes
