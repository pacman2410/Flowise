import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity()
export class WeeklyCheckIn {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Index()
    @Column()
    userId: string

    @Column()
    weekOf: string // ISO date string for the Monday of that week

    @Column({ type: 'integer', nullable: true })
    confidenceScore?: number // 1-10

    @Column({ type: 'integer', nullable: true })
    momentumScore?: number // 1-10

    @Column({ type: 'text', nullable: true })
    completedActions?: string // JSON array of strings

    @Column({ type: 'text', nullable: true })
    blockers?: string // JSON array of strings

    @Column({ type: 'text', nullable: true })
    wins?: string // JSON array of strings

    @Column({ type: 'text', nullable: true })
    nextWeekPriorities?: string // JSON array of strings

    @Column({ type: 'text', nullable: true })
    aiRecommendations?: string // JSON array from AI

    @Column({ type: 'float', nullable: true })
    careerHealthDelta?: number // Change in career health score this week

    @CreateDateColumn()
    createdDate: Date
}
