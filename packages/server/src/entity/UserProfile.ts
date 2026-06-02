import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    userId: string // UUID from browser localStorage

    @Column({ nullable: true })
    name?: string

    @Column({ nullable: true })
    currentTitle?: string

    @Column({ nullable: true })
    currentLevel?: string // IC1, IC2, Manager, Director, etc.

    @Column({ nullable: true })
    targetTitle?: string

    @Column({ nullable: true })
    targetLevel?: string

    @Column({ nullable: true })
    industry?: string

    @Column({ nullable: true })
    yearsExperience?: number

    @Column({ nullable: true })
    targetSalary?: string

    @Column({ type: 'text', nullable: true })
    careerGoal?: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}
