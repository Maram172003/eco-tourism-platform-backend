import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('project_owners')
export class ProjectOwner {
  @PrimaryColumn('uuid')
  user_id!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar' })
  full_name!: string;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ type: 'varchar', nullable: true })
  country!: string | null;

  @Column({ type: 'varchar', nullable: true })
  language!: string | null;

  @Column({ type: 'text', nullable: true })
  photo!: string | null;

  @Column({ type: 'varchar', nullable: true })
  organization!: string | null;

  @Column({ type: 'varchar', nullable: true })
  position!: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ type: 'int', default: 0 })
  profile_completion!: number;

  @Column({ type: 'boolean', default: false })
  is_onboarded!: boolean;

  @Column({ type: 'int', nullable: true })
  sustainability_score!: number | null;

  @Column({ type: 'int', nullable: true })
  score_questionnaire!: number | null;

  @Column({ type: 'int', default: 0 })
  score_reservations!: number;

  @Column({ type: 'int', default: 0 })
  score_feedbacks!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
