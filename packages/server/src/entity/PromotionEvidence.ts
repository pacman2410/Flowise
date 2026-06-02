import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm'

export type EvidenceCategory =
    | 'accomplishment'
    | 'business_impact'
    | 'recognition'
    | 'stakeholder_feedback'
    | 'project'
    | 'leadership'
    | 'metric'

@Entity()
export class PromotionEvidence {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Index()
    @Column()
    userId: string

    @Column()
    category: EvidenceCategory

    @Column()
    title: string

    @Column({ type: 'text' })
    description: string

    @Column({ nullable: true })
    impact?: string

    @Column({ nullable: true })
    metric?: string // quantified result e.g. "Reduced latency by 40%"

    @Column({ nullable: true })
    stakeholder?: string

    @Column({ nullable: true })
    date?: string // ISO date string

    @Column({ nullable: true })
    tags?: string // comma-separated

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}
