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

@Entity('guides')
export class Guide {
  @PrimaryColumn('uuid')
  user_id!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar' })
  full_name!: string;

  @Column({ type: 'varchar', nullable: true })
  guide_type!: string | null; // local | professionnel

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ type: 'varchar', nullable: true })
  country!: string | null;

  @Column({ type: 'varchar', nullable: true })
  language!: string | null;

  @Column({ type: 'text', nullable: true })
  photo!: string | null;

  @Column({ type: 'varchar', nullable: true })
  zone!: string | null; // geographic zone of activity

  @Column({ type: 'simple-array', nullable: true })
  specialties!: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  languages_spoken!: string[] | null;

  @Column({ type: 'int', nullable: true })
  years_experience!: number | null;

  @Column({ type: 'varchar', default: 'pending' })
  status!: string; // pending | active | suspended

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
