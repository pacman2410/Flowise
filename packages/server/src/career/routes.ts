import { Application, Request, Response } from 'express'
import { DataSource } from 'typeorm'
import { ASSESSMENT_DEFINITIONS, getAssessment } from './assessments'
import { scoreAssessment } from './scoring'
import { UserProfile } from '../entity/UserProfile'
import { AssessmentResponse } from '../entity/AssessmentResponse'
import { CareerBlueprint } from '../entity/CareerBlueprint'
import { WeeklyCheckIn } from '../entity/WeeklyCheckIn'
import { PromotionEvidence } from '../entity/PromotionEvidence'

export function registerCareerRoutes(app: Application, AppDataSource: DataSource): void {
    // ----------------------------------------
    // Assessments
    // ----------------------------------------

    // GET /api/v1/career/assessments - list all assessment types with metadata
    app.get('/api/v1/career/assessments', (req: Request, res: Response) => {
        try {
            const list = Object.values(ASSESSMENT_DEFINITIONS).map((def) => ({
                type: def.type,
                title: def.title,
                description: def.description,
                estimatedMinutes: def.estimatedMinutes,
                questionCount: def.questions.length,
                dimensions: def.dimensions.map((d) => ({ name: d.name, label: d.label, description: d.description }))
            }))
            return res.json(list)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // GET /api/v1/career/assessments/:type - get full assessment definition with questions
    app.get('/api/v1/career/assessments/:type', (req: Request, res: Response) => {
        try {
            const def = getAssessment(req.params.type)
            if (!def) {
                return res.status(404).send(`Assessment type '${req.params.type}' not found`)
            }
            return res.json(def)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // POST /api/v1/career/assessments/:type/submit - submit answers, compute scores, save response
    app.post('/api/v1/career/assessments/:type/submit', async (req: Request, res: Response) => {
        try {
            const { type } = req.params
            const { userId, answers } = req.body

            if (!userId) {
                return res.status(400).send('userId is required')
            }

            const def = getAssessment(type)
            if (!def) {
                return res.status(404).send(`Assessment type '${type}' not found`)
            }

            if (!answers || typeof answers !== 'object') {
                return res.status(400).send('answers must be an object mapping questionId to score (1-5)')
            }

            // Validate all question answers are present and valid
            const missingQuestions: string[] = []
            for (const q of def.questions) {
                const answer = answers[q.id]
                if (answer === undefined || answer === null) {
                    missingQuestions.push(q.id)
                } else if (typeof answer !== 'number' || answer < 1 || answer > 5 || !Number.isInteger(answer)) {
                    return res.status(400).send(`Answer for question '${q.id}' must be an integer between 1 and 5`)
                }
            }
            if (missingQuestions.length > 0) {
                return res.status(400).send(`Missing answers for questions: ${missingQuestions.join(', ')}`)
            }

            // Compute scores
            const scoreResult = scoreAssessment(type, answers)

            // Save to database
            const repo = AppDataSource.getRepository(AssessmentResponse)
            const response = repo.create({
                userId,
                assessmentType: type as any,
                answers: JSON.stringify(answers),
                totalScore: scoreResult.totalScore,
                dimensionScores: JSON.stringify(scoreResult.dimensionScores),
                recommendations: JSON.stringify(scoreResult.recommendations),
                tier: scoreResult.tier
            })
            const saved = await repo.save(response)

            return res.status(201).json({
                id: saved.id,
                userId: saved.userId,
                assessmentType: saved.assessmentType,
                createdDate: saved.createdDate,
                ...scoreResult
            })
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // ----------------------------------------
    // Scores
    // ----------------------------------------

    // GET /api/v1/career/scores/:userId - get all assessment scores for a user
    app.get('/api/v1/career/scores/:userId', async (req: Request, res: Response) => {
        try {
            const responses = await AppDataSource.getRepository(AssessmentResponse).find({
                where: { userId: req.params.userId },
                order: { createdDate: 'DESC' }
            })
            const result = responses.map((r: AssessmentResponse) => ({
                id: r.id,
                assessmentType: r.assessmentType,
                totalScore: r.totalScore,
                dimensionScores: JSON.parse(r.dimensionScores),
                recommendations: JSON.parse(r.recommendations),
                tier: r.tier,
                createdDate: r.createdDate
            }))
            return res.json(result)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // GET /api/v1/career/scores/:userId/:type - get most recent score for specific assessment type
    app.get('/api/v1/career/scores/:userId/:type', async (req: Request, res: Response) => {
        try {
            const response = await AppDataSource.getRepository(AssessmentResponse).findOne({
                where: { userId: req.params.userId, assessmentType: req.params.type as any },
                order: { createdDate: 'DESC' }
            })
            if (!response) {
                return res
                    .status(404)
                    .send(`No ${req.params.type} assessment found for user ${req.params.userId}`)
            }
            return res.json({
                id: response.id,
                assessmentType: response.assessmentType,
                totalScore: response.totalScore,
                dimensionScores: JSON.parse(response.dimensionScores),
                recommendations: JSON.parse(response.recommendations),
                tier: response.tier,
                createdDate: response.createdDate
            })
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // ----------------------------------------
    // Career Blueprint
    // ----------------------------------------

    // GET /api/v1/career/blueprint/:userId - get career blueprint
    app.get('/api/v1/career/blueprint/:userId', async (req: Request, res: Response) => {
        try {
            const blueprint = await AppDataSource.getRepository(CareerBlueprint).findOne({
                where: { userId: req.params.userId }
            })
            if (!blueprint) {
                return res.status(404).send(`No career blueprint found for user ${req.params.userId}`)
            }
            return res.json({
                ...blueprint,
                skillGaps: blueprint.skillGaps ? JSON.parse(blueprint.skillGaps) : [],
                milestones: blueprint.milestones ? JSON.parse(blueprint.milestones) : [],
                actionPlan: blueprint.actionPlan ? JSON.parse(blueprint.actionPlan) : [],
                weeklyPriorities: blueprint.weeklyPriorities ? JSON.parse(blueprint.weeklyPriorities) : [],
                risks: blueprint.risks ? JSON.parse(blueprint.risks) : [],
                dependencies: blueprint.dependencies ? JSON.parse(blueprint.dependencies) : [],
                successMetrics: blueprint.successMetrics ? JSON.parse(blueprint.successMetrics) : []
            })
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // PUT /api/v1/career/blueprint/:userId - create or update career blueprint (upsert)
    app.put('/api/v1/career/blueprint/:userId', async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getRepository(CareerBlueprint)
            let blueprint = await repo.findOne({ where: { userId: req.params.userId } })

            const body = req.body
            const updates: Partial<CareerBlueprint> = {}

            if (body.currentState !== undefined) updates.currentState = body.currentState
            if (body.desiredState !== undefined) updates.desiredState = body.desiredState
            if (body.careerGoal !== undefined) updates.careerGoal = body.careerGoal
            if (body.targetRole !== undefined) updates.targetRole = body.targetRole
            if (body.targetSalary !== undefined) updates.targetSalary = body.targetSalary
            if (body.skillGaps !== undefined)
                updates.skillGaps = Array.isArray(body.skillGaps) ? JSON.stringify(body.skillGaps) : body.skillGaps
            if (body.milestones !== undefined)
                updates.milestones = Array.isArray(body.milestones) ? JSON.stringify(body.milestones) : body.milestones
            if (body.actionPlan !== undefined)
                updates.actionPlan = Array.isArray(body.actionPlan) ? JSON.stringify(body.actionPlan) : body.actionPlan
            if (body.weeklyPriorities !== undefined)
                updates.weeklyPriorities = Array.isArray(body.weeklyPriorities)
                    ? JSON.stringify(body.weeklyPriorities)
                    : body.weeklyPriorities
            if (body.risks !== undefined)
                updates.risks = Array.isArray(body.risks) ? JSON.stringify(body.risks) : body.risks
            if (body.dependencies !== undefined)
                updates.dependencies = Array.isArray(body.dependencies)
                    ? JSON.stringify(body.dependencies)
                    : body.dependencies
            if (body.successMetrics !== undefined)
                updates.successMetrics = Array.isArray(body.successMetrics)
                    ? JSON.stringify(body.successMetrics)
                    : body.successMetrics

            if (!blueprint) {
                blueprint = repo.create({ userId: req.params.userId, ...updates })
            } else {
                Object.assign(blueprint, updates)
            }

            const saved = await repo.save(blueprint)
            return res.json({
                ...saved,
                skillGaps: saved.skillGaps ? JSON.parse(saved.skillGaps) : [],
                milestones: saved.milestones ? JSON.parse(saved.milestones) : [],
                actionPlan: saved.actionPlan ? JSON.parse(saved.actionPlan) : [],
                weeklyPriorities: saved.weeklyPriorities ? JSON.parse(saved.weeklyPriorities) : [],
                risks: saved.risks ? JSON.parse(saved.risks) : [],
                dependencies: saved.dependencies ? JSON.parse(saved.dependencies) : [],
                successMetrics: saved.successMetrics ? JSON.parse(saved.successMetrics) : []
            })
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // ----------------------------------------
    // Weekly Check-Ins
    // ----------------------------------------

    // GET /api/v1/career/checkin/:userId - get all weekly check-ins for user
    app.get('/api/v1/career/checkin/:userId', async (req: Request, res: Response) => {
        try {
            const checkIns = await AppDataSource.getRepository(WeeklyCheckIn).find({
                where: { userId: req.params.userId },
                order: { createdDate: 'DESC' }
            })
            const result = checkIns.map((c: WeeklyCheckIn) => ({
                ...c,
                completedActions: c.completedActions ? JSON.parse(c.completedActions) : [],
                blockers: c.blockers ? JSON.parse(c.blockers) : [],
                wins: c.wins ? JSON.parse(c.wins) : [],
                nextWeekPriorities: c.nextWeekPriorities ? JSON.parse(c.nextWeekPriorities) : [],
                aiRecommendations: c.aiRecommendations ? JSON.parse(c.aiRecommendations) : []
            }))
            return res.json(result)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // POST /api/v1/career/checkin/:userId - create a new weekly check-in
    app.post('/api/v1/career/checkin/:userId', async (req: Request, res: Response) => {
        try {
            const body = req.body

            if (!body.weekOf) {
                return res.status(400).send('weekOf is required (ISO date string for the Monday of the week)')
            }

            const repo = AppDataSource.getRepository(WeeklyCheckIn)
            const checkIn = repo.create({
                userId: req.params.userId,
                weekOf: body.weekOf,
                confidenceScore: body.confidenceScore,
                momentumScore: body.momentumScore,
                careerHealthDelta: body.careerHealthDelta,
                completedActions: Array.isArray(body.completedActions)
                    ? JSON.stringify(body.completedActions)
                    : body.completedActions,
                blockers: Array.isArray(body.blockers) ? JSON.stringify(body.blockers) : body.blockers,
                wins: Array.isArray(body.wins) ? JSON.stringify(body.wins) : body.wins,
                nextWeekPriorities: Array.isArray(body.nextWeekPriorities)
                    ? JSON.stringify(body.nextWeekPriorities)
                    : body.nextWeekPriorities,
                aiRecommendations: Array.isArray(body.aiRecommendations)
                    ? JSON.stringify(body.aiRecommendations)
                    : body.aiRecommendations
            })

            const saved = await repo.save(checkIn)
            return res.status(201).json({
                ...saved,
                completedActions: saved.completedActions ? JSON.parse(saved.completedActions) : [],
                blockers: saved.blockers ? JSON.parse(saved.blockers) : [],
                wins: saved.wins ? JSON.parse(saved.wins) : [],
                nextWeekPriorities: saved.nextWeekPriorities ? JSON.parse(saved.nextWeekPriorities) : [],
                aiRecommendations: saved.aiRecommendations ? JSON.parse(saved.aiRecommendations) : []
            })
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // ----------------------------------------
    // Promotion Evidence
    // ----------------------------------------

    // GET /api/v1/career/evidence/:userId - get all evidence items for user
    app.get('/api/v1/career/evidence/:userId', async (req: Request, res: Response) => {
        try {
            const evidence = await AppDataSource.getRepository(PromotionEvidence).find({
                where: { userId: req.params.userId },
                order: { createdDate: 'DESC' }
            })
            return res.json(evidence)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // POST /api/v1/career/evidence/:userId - create evidence item
    app.post('/api/v1/career/evidence/:userId', async (req: Request, res: Response) => {
        try {
            const body = req.body

            if (!body.category) {
                return res.status(400).send('category is required')
            }
            if (!body.title) {
                return res.status(400).send('title is required')
            }
            if (!body.description) {
                return res.status(400).send('description is required')
            }

            const repo = AppDataSource.getRepository(PromotionEvidence)
            const item = repo.create({
                userId: req.params.userId,
                category: body.category,
                title: body.title,
                description: body.description,
                impact: body.impact,
                metric: body.metric,
                stakeholder: body.stakeholder,
                date: body.date,
                tags: body.tags
            })

            const saved = await repo.save(item)
            return res.status(201).json(saved)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // PUT /api/v1/career/evidence/:userId/:id - update evidence item
    app.put('/api/v1/career/evidence/:userId/:id', async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getRepository(PromotionEvidence)
            const item = await repo.findOne({
                where: { id: req.params.id, userId: req.params.userId }
            })

            if (!item) {
                return res
                    .status(404)
                    .send(`Evidence item ${req.params.id} not found for user ${req.params.userId}`)
            }

            const body = req.body
            if (body.category !== undefined) item.category = body.category
            if (body.title !== undefined) item.title = body.title
            if (body.description !== undefined) item.description = body.description
            if (body.impact !== undefined) item.impact = body.impact
            if (body.metric !== undefined) item.metric = body.metric
            if (body.stakeholder !== undefined) item.stakeholder = body.stakeholder
            if (body.date !== undefined) item.date = body.date
            if (body.tags !== undefined) item.tags = body.tags

            const saved = await repo.save(item)
            return res.json(saved)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // DELETE /api/v1/career/evidence/:userId/:id - delete evidence item
    app.delete('/api/v1/career/evidence/:userId/:id', async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getRepository(PromotionEvidence)
            const item = await repo.findOne({
                where: { id: req.params.id, userId: req.params.userId }
            })

            if (!item) {
                return res
                    .status(404)
                    .send(`Evidence item ${req.params.id} not found for user ${req.params.userId}`)
            }

            await repo.remove(item)
            return res.status(200).json({ message: 'Evidence item deleted successfully', id: req.params.id })
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // ----------------------------------------
    // User Profile
    // ----------------------------------------

    // GET /api/v1/career/profile/:userId - get user profile
    app.get('/api/v1/career/profile/:userId', async (req: Request, res: Response) => {
        try {
            const profile = await AppDataSource.getRepository(UserProfile).findOne({
                where: { userId: req.params.userId }
            })
            if (!profile) {
                return res.status(404).send(`No profile found for user ${req.params.userId}`)
            }
            return res.json(profile)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })

    // PUT /api/v1/career/profile/:userId - create or update user profile (upsert)
    app.put('/api/v1/career/profile/:userId', async (req: Request, res: Response) => {
        try {
            const repo = AppDataSource.getRepository(UserProfile)
            let profile = await repo.findOne({ where: { userId: req.params.userId } })

            const body = req.body
            const updates: Partial<UserProfile> = {}

            if (body.name !== undefined) updates.name = body.name
            if (body.currentTitle !== undefined) updates.currentTitle = body.currentTitle
            if (body.currentLevel !== undefined) updates.currentLevel = body.currentLevel
            if (body.targetTitle !== undefined) updates.targetTitle = body.targetTitle
            if (body.targetLevel !== undefined) updates.targetLevel = body.targetLevel
            if (body.industry !== undefined) updates.industry = body.industry
            if (body.yearsExperience !== undefined) updates.yearsExperience = body.yearsExperience
            if (body.targetSalary !== undefined) updates.targetSalary = body.targetSalary
            if (body.careerGoal !== undefined) updates.careerGoal = body.careerGoal

            if (!profile) {
                profile = repo.create({ userId: req.params.userId, ...updates })
            } else {
                Object.assign(profile, updates)
            }

            const saved = await repo.save(profile)
            return res.json(saved)
        } catch (err: any) {
            return res.status(500).send(err?.message ?? 'Internal server error')
        }
    })
}
