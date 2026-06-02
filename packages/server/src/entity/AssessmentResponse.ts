import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm'

export type AssessmentType = 'career_health' | 'promotion_readiness' | 'leadership_readiness' | 'new_manager_readiness'

@Entity()
export class AssessmentResponse {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Index()
    @Column()
    userId: string

    @Column()
    assessmentType: AssessmentType

    @Column({ type: 'text' })
    answers: string // JSON: { questionId: number (1-5) }

    @Column({ type: 'float' })
    totalScore: number // 0-100

    @Column({ type: 'text' })
    dimensionScores: string // JSON: { dimensionName: score }

    @Column({ type: 'text' })
    recommendations: string // JSON array of recommendation strings

    @Column()
    tier: string // 'needs_work' | 'developing' | 'on_track' | 'strong' | 'exceptional'

    @CreateDateColumn()
    createdDate: Date
}
