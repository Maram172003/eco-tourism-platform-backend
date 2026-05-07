import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectOwner } from './project-owner.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  owner_id!: string;

  @ManyToOne(() => ProjectOwner)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'user_id' })
  owner!: ProjectOwner;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  project_type!: string | null; // hebergement | restauration | artisanat | agence | centre_loisir

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', nullable: true })
  region!: string | null;

  @Column({ type: 'varchar', nullable: true })
  address!: string | null;

  @Column({ type: 'text', nullable: true })
  photo!: string | null;

  @Column({ type: 'varchar', default: 'pending' })
  status!: string; // pending | active | suspended

  @Column({ type: 'simple-array', nullable: true })
  services!: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  eco_labels!: string[] | null;

  @Column({ type: 'varchar', nullable: true })
  website!: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
