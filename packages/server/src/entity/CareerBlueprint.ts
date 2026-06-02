import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity()
export class CareerBlueprint {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Index()
    @Column({ unique: true })
    userId: string

    @Column({ type: 'text', nullable: true })
    currentState?: string

    @Column({ type: 'text', nullable: true })
    desiredState?: string

    @Column({ nullable: true })
    careerGoal?: string

    @Column({ nullable: true })
    targetRole?: string

    @Column({ nullable: true })
    targetSalary?: string

    @Column({ type: 'text', nullable: true })
    skillGaps?: string // JSON array

    @Column({ type: 'text', nullable: true })
    milestones?: string // JSON array of { title, targetDate, completed }

    @Column({ type: 'text', nullable: true })
    actionPlan?: string // JSON array of { action, priority, dueDate, status }

    @Column({ type: 'text', nullable: true })
    weeklyPriorities?: string // JSON array

    @Column({ type: 'text', nullable: true })
    risks?: string // JSON array

    @Column({ type: 'text', nullable: true })
    dependencies?: string // JSON array

    @Column({ type: 'text', nullable: true })
    successMetrics?: string // JSON array

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}
